import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import * as csstree from "css-tree";
import { parse as parseHtml } from "parse5";
import {
  findCatalogDuplicates,
  findCatalogWarnings,
  findCorruptNativeFunction,
  isBrokenLocalReference,
  packageRequirements,
  parseCssSource,
  sourceDefinitions,
  validatePatternProvenance,
} from "./validation-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(file, "utf8");
const catalog = JSON.parse(read(path.join(root, "catalog.json")));
const schema = JSON.parse(read(path.join(root, "catalog.schema.json")));
const registry = JSON.parse(read(path.join(root, "source-registry.json")));
const registrySchema = JSON.parse(read(path.join(root, "source-registry.schema.json")));
const definitions = sourceDefinitions(registry);
const errors = [];
const warnings = [];
const sourceCounts = new Map();
const categoryCounts = new Map();

function fail(file, message, location) {
  const suffix = location?.line ? `:${location.line}:${location.column ?? 1}` : "";
  errors.push(`${path.relative(root, file)}${suffix}: ${message}`);
}

function attributes(node) {
  return Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
}

function textContent(node) {
  return node.nodeName === "#text"
    ? node.value
    : (node.childNodes ?? []).map(textContent).join("");
}

function walkHtml(node, callback) {
  callback(node);
  for (const child of node.childNodes ?? []) walkHtml(child, callback);
  if (node.content) walkHtml(node.content, callback);
}

function splitSelectors(source) {
  const selectors = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < source.length; index += 1) {
    if ("([".includes(source[index])) depth += 1;
    else if (")]".includes(source[index])) depth -= 1;
    else if (source[index] === "," && depth === 0) {
      selectors.push(source.slice(start, index));
      start = index + 1;
    }
  }
  selectors.push(source.slice(start));
  return selectors;
}

function validateHtml(file, item, requirements) {
  const source = read(file);
  const parseErrors = [];
  const document = parseHtml(source, {
    sourceCodeLocationInfo: true,
    onParseError: (error) => parseErrors.push(error),
  });
  for (const error of parseErrors) {
    fail(file, `HTML parse error: ${error.code}`, { line: error.startLine, column: error.startCol });
  }

  const nodes = [];
  const labels = [];
  const documentIds = new Map();
  walkHtml(document, (node) => {
    if (!node.tagName) return;
    nodes.push(node);
    const attrs = attributes(node);
    const location = node.sourceCodeLocation?.startTag;
    if (attrs.id) {
      if (documentIds.has(attrs.id)) fail(file, `duplicate id ${attrs.id}`, location);
      documentIds.set(attrs.id, node);
    }
    if (node.tagName === "label") labels.push(node);
    if (node.tagName === "button") {
      if (!attrs.type) fail(file, "button requires explicit type", location);
      if (!textContent(node).trim() && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
        fail(file, "button requires accessible name", location);
      }
    }
  });

  const html = nodes.find((node) => node.tagName === "html");
  if (!html || !attributes(html).lang) fail(file, "document requires html[lang]");
  if (!nodes.some((node) => node.tagName === "meta" && attributes(node).name === "viewport")) {
    fail(file, "document requires viewport meta");
  }
  const stylesheet = nodes.find(
    (node) => node.tagName === "link" && attributes(node).rel === "stylesheet",
  );
  if (!stylesheet || attributes(stylesheet).href !== `./${requirements.stylesheet}`) {
    fail(file, `demo must reference ./${requirements.stylesheet}`);
  }
  if (!source.includes(".stage{box-sizing:border-box;width:min(100%,680px)")) {
    fail(file, "demo stage must fit narrow viewports without horizontal overflow");
  }
  if (!source.includes("grid-template-columns:minmax(0,1fr)")) {
    fail(file, "demo stage must use a shrinkable grid track");
  }
  if (nodes.filter((node) => node.tagName === "main").length !== 1) {
    fail(file, "demo requires exactly one main landmark");
  }

  for (const label of labels) {
    const target = attributes(label).for;
    if (target && !documentIds.has(target)) {
      fail(file, `label references missing id ${target}`, label.sourceCodeLocation?.startTag);
    }
  }
  for (const node of nodes.filter((candidate) => candidate.tagName === "input")) {
    const attrs = attributes(node);
    if (["submit", "button", "hidden"].includes(attrs.type)) continue;
    const labelled = attrs["aria-label"] || attrs["aria-labelledby"] ||
      (attrs.id && labels.some((label) => attributes(label).for === attrs.id));
    if (!labelled) fail(file, "input requires label or accessible name", node.sourceCodeLocation?.startTag);
  }

  for (const node of nodes) {
    const attrs = attributes(node);
    if (attrs["aria-labelledby"]) {
      for (const id of attrs["aria-labelledby"].split(/\s+/)) {
        if (!documentIds.has(id)) {
          fail(file, `aria-labelledby references missing id ${id}`, node.sourceCodeLocation?.startTag);
        }
      }
    }
    for (const key of ["href", "src"]) {
      const reference = attrs[key];
      if (!reference) continue;
      if (reference === "#") {
        fail(file, `placeholder ${key} is not a working reference`, node.sourceCodeLocation?.startTag);
      } else if (reference.startsWith("#")) {
        if (!documentIds.has(reference.slice(1))) {
          fail(file, `fragment references missing id ${reference}`, node.sourceCodeLocation?.startTag);
        }
      } else if (isBrokenLocalReference(path.dirname(file), reference)) {
        fail(file, `broken local ${key}: ${reference}`, node.sourceCodeLocation?.startTag);
      }
    }
  }

  const cssSource = read(path.join(path.dirname(file), requirements.stylesheet));
  const combinedCss = `${cssSource}\n${source}`;
  const interactive = nodes.some((node) => {
    const attrs = attributes(node);
    return ["button", "input", "select", "textarea", "a"].includes(node.tagName) ||
      attrs.tabindex === "0";
  });
  if (interactive && !combinedCss.includes(":focus-visible")) {
    fail(file, "interactive demo requires a visible keyboard focus style");
  }
  if (item.reducedMotion && !combinedCss.includes("@media (prefers-reduced-motion:reduce)")) {
    fail(file, "reduced-motion package requires a prefers-reduced-motion rule");
  }
  if (item.categories[1] === "hover" && cssSource.includes(":hover") &&
      !cssSource.includes(":focus-visible")) {
    fail(file, "hover effect requires a focus-visible equivalent");
  }
  if (item.categories[1] === "loaders") {
    const status = nodes.find((node) => attributes(node).role === "status");
    if (!status || !textContent(status).trim()) fail(file, "loader requires status text");
    if (!nodes.some((node) => attributes(node)["aria-hidden"] === "true")) {
      fail(file, "loader decoration must be aria-hidden");
    }
  }
}

function validateStylesheet(file, item, requirements) {
  const source = read(file);
  const parsed = parseCssSource(source);
  for (const error of parsed.errors) {
    fail(file, `CSS parse error: ${error.message}`, error.loc?.start);
  }
  const ast = parsed.ast;
  if (!ast) return;

  const corrupt = findCorruptNativeFunction(source);
  if (corrupt) fail(file, `native CSS function was accidentally scoped: ${corrupt}`);
  const customProperties = new Set();
  const customPropertyReferences = [];
  const keyframes = new Set();
  const animationReferences = [];
  csstree.walk(ast, {
    enter(node) {
      if (node.type === "Atrule" && /keyframes$/i.test(node.name)) {
        const name = csstree.generate(node.prelude).trim();
        keyframes.add(name);
        const keyframePrefix = item.package.scope.replace(/^:where\(\.|^\./, "").replace(/\)$/, "");
        if (!name.startsWith(`${keyframePrefix}-`)) fail(file, `unscoped keyframe ${name}`, node.loc?.start);
      }
      if (node.type !== "Declaration") return;
      const value = csstree.generate(node.value);
      if (node.property.startsWith("--")) {
        customProperties.add(node.property);
        if (!value.trim()) fail(file, `empty custom property ${node.property}`, node.loc?.start);
        return;
      }
      if (item.package.type === "tokens") {
        fail(file, `token stylesheet may only declare custom properties, found ${node.property}`, node.loc?.start);
      }
      const match = csstree.lexer.matchProperty(node.property, node.value);
      if (!value.includes("var(") && !match.matched && match.error) {
        fail(file, `invalid ${node.property} value: ${value} (${match.error.message})`, node.loc?.start);
      }
      for (const reference of value.matchAll(/var\((--[a-z0-9-]+)(?:\s*,[^)]*)?\)/gi)) {
        customPropertyReferences.push({
          name: reference[1], fallback: reference[0].includes(","), location: node.loc?.start,
        });
      }
      if (/^animation(?:-name)?$/.test(node.property)) {
        for (const name of value.matchAll(/\buk-[A-Za-z0-9_-]+\b/g)) {
          animationReferences.push({ name: name[0], location: node.loc?.start });
        }
      }
    },
  });

  for (const reference of customPropertyReferences) {
    if (!reference.fallback && !customProperties.has(reference.name)) {
      fail(file, `undefined custom property ${reference.name}`, reference.location);
    }
  }
  for (const animation of animationReferences) {
    if (!keyframes.has(animation.name)) {
      fail(file, `animation references missing keyframes ${animation.name}`, animation.location);
    }
  }

  const wrapper = item.package.scope;
  if (requirements.requireResponsiveWrapper &&
      !source.includes(`${wrapper}{box-sizing:border-box;max-inline-size:100%;inline-size:100%;`)) {
    fail(file, "pattern wrapper must establish a responsive containing width");
  }
  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      if (this.atrule?.name && /keyframes$/i.test(this.atrule.name)) return;
      for (const selector of splitSelectors(csstree.generate(node.prelude))) {
        if (!selector.trim().startsWith(wrapper)) {
          fail(file, `unscoped selector: ${selector.trim()}`, node.loc?.start);
        }
      }
    },
  });

  if (requirements.requireResponsiveWrapper && !source.includes("@media (prefers-reduced-motion:reduce)")) {
    fail(file, "missing reduced-motion query");
  }
  const hasMotion = /@keyframes|\banimation(?:-name)?\s*:|\btransition\s*:/.test(source);
  if (hasMotion && !item.reducedMotion) {
    fail(file, "CSS contains motion but catalog reducedMotion is false");
  }
  const hasCostlyFilter = /\b(?:backdrop-)?filter\s*:/.test(source);
  if (hasCostlyFilter && (item.performance !== "medium" || item.production !== "conditional")) {
    fail(file, "filter effects require medium performance and conditional production metadata");
  }
  for (const match of source.matchAll(/url\((['"]?)(.*?)\1\)/gi)) {
    const reference = match[2].trim();
    if (isBrokenLocalReference(path.dirname(file), reference)) {
      fail(file, `broken CSS reference ${reference}`);
    }
  }
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
function validateSchema(data, dataSchema, label) {
  const validate = ajv.compile(dataSchema);
  if (!validate(data)) {
    for (const error of validate.errors ?? []) {
      errors.push(`${label}${error.instancePath}: ${error.message}`);
    }
  }
}
validateSchema(catalog, schema, "catalog.json");
validateSchema(registry, registrySchema, "source-registry.json");

const registryIds = new Set();
const registryRepositories = new Set();
for (const source of registry.sources ?? []) {
  if (registryIds.has(source.id)) errors.push(`source-registry.json: duplicate source id ${source.id}`);
  registryIds.add(source.id);
  if (registryRepositories.has(source.repository)) {
    errors.push(`source-registry.json: duplicate repository ${source.repository}`);
  }
  registryRepositories.add(source.repository);
  if (source.repository !== `https://github.com/${source.ownerRepository}`) {
    errors.push(`source-registry.json: ${source.id} repository and ownerRepository differ`);
  }
  try {
    new RegExp(source.provenance.sourceUrlPattern);
  } catch (error) {
    errors.push(`source-registry.json: ${source.id} has invalid sourceUrlPattern: ${error.message}`);
  }
  if (!source.provenance.sourceUrlPattern.includes("(?<path>")) {
    errors.push(`source-registry.json: ${source.id} sourceUrlPattern must capture path`);
  }
  if (source.provenance.revisionRequired &&
      !source.provenance.sourceUrlPattern.includes("(?<revision>")) {
    errors.push(`source-registry.json: ${source.id} sourceUrlPattern must capture revision`);
  }
  if (source.status === "active" && source.license.status !== "verified") {
    errors.push(`source-registry.json: active source ${source.id} requires a verified license`);
  }
  if (source.license.status === "verified") {
    if (!source.license.name) errors.push(`source-registry.json: ${source.id} license name is missing`);
    if (!source.license.url && !source.license.localFile) {
      errors.push(`source-registry.json: ${source.id} verified license reference is missing`);
    }
    if (source.license.localFile &&
        !fs.existsSync(path.resolve(root, source.license.localFile))) {
      errors.push(`source-registry.json: ${source.id} license file is missing`);
    }
  }
}

for (const issue of findCatalogDuplicates(catalog.patterns ?? [], definitions)) {
  errors.push(`catalog.json: ${issue}`);
}
warnings.push(...findCatalogWarnings(catalog.patterns ?? []));

for (const item of catalog.patterns ?? []) {
  const source = definitions.get(item.source?.id);
  sourceCounts.set(item.source?.id, (sourceCounts.get(item.source?.id) ?? 0) + 1);
  const category = item.categories?.[1] ?? item.categories?.[0] ?? "uncategorized";
  categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  if (!item.path.endsWith(`/${item.id}/`) && item.path !== `${item.id}/`) {
    errors.push(`catalog.json: ${item.id} path must end with its id`);
  }
  const provenance = validatePatternProvenance(item, definitions, root);
  for (const issue of provenance.errors) errors.push(`catalog.json: ${item.id} ${issue}`);

  const directory = path.join(root, item.path);
  const requirements = packageRequirements(item);
  if (!requirements) {
    errors.push(`catalog.json: ${item.id} has no valid package requirements`);
    continue;
  }
  for (const name of requirements.requiredFiles) {
    if (!fs.existsSync(path.join(directory, name))) fail(path.join(directory, name), "required file missing");
  }
  const readme = path.join(directory, "README.md");
  if (fs.existsSync(readme)) {
    const content = read(readme);
    for (const heading of requirements.requiredHeadings) {
      if (!content.includes(heading)) fail(readme, `missing ${heading}`);
    }
    if (!content.includes(item.source.url)) fail(readme, "source differs from catalog");
    if (source && !content.includes(source.name)) fail(readme, "registered source attribution is missing");
    if (source?.license.name && !content.includes(source.license.name)) {
      fail(readme, `missing ${source.license.name} license`);
    }
    if (source?.license.localFile && !content.includes(path.basename(source.license.localFile))) {
      fail(readme, "registered local license reference is missing");
    }
  }
  const stylesheet = path.join(directory, requirements.stylesheet);
  const demo = path.join(directory, "demo.html");
  if (fs.existsSync(stylesheet)) validateStylesheet(stylesheet, item, requirements);
  if (fs.existsSync(demo)) validateHtml(demo, item, requirements);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`  ${warning}`);
  console.warn("");
}
console.log(`Validated ${catalog.patterns.length} patterns.\n`);
console.log("Sources:");
for (const [source, count] of [...sourceCounts].sort()) console.log(`  ${source}: ${count}`);
console.log("\nCategories:");
for (const [category, count] of [...categoryCounts].sort()) console.log(`  ${category}: ${count}`);
console.log("\nValidation passed.");
