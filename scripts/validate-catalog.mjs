import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import * as csstree from "css-tree";
import { parse as parseHtml } from "parse5";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(file, "utf8");
const catalog = JSON.parse(read(path.join(root, "catalog.json")));
const schema = JSON.parse(read(path.join(root, "catalog.schema.json")));
const expectedCounts = { buttons: 10, cards: 10, inputs: 10, loaders: 10, hover: 10 };
const categoryRoots = {
  buttons: "components/buttons", cards: "components/cards", inputs: "components/inputs",
  loaders: "animations/loading", hover: "effects/hover",
};
const requiredFiles = ["README.md", "demo.html", "style.css"];
const requiredHeadings = [
  "## Category", "## Source", "## License", "## Purpose", "## Recommended use",
  "## Avoid / use with caution", "## Techniques", "## Performance", "## Mobile",
  "## Accessibility", "## Reduced motion", "## Customization", "## Notes",
];
const nativeFunctions = [
  "rotate", "translate", "translateX", "translateY", "translate3d", "scale", "scaleX",
  "scaleY", "skew", "calc", "min", "max", "clamp", "var", "rgb", "rgba", "hsl",
  "hsla", "linear-gradient", "radial-gradient", "cubic-bezier",
];
const corruptNativeFunction = new RegExp(
  `\\buk-[a-z0-9-]+-(?:${nativeFunctions.join("|")})\\s*\\(`, "i",
);
const upstream =
  "https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/";
const errors = [];
const counts = Object.fromEntries(Object.keys(expectedCounts).map((key) => [key, 0]));
const ids = new Set();
const paths = new Set();
const sources = new Set();

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

function validateHtml(file, item) {
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
  if (!stylesheet || attributes(stylesheet).href !== "./style.css") {
    fail(file, "demo must reference ./style.css");
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
      } else if (!/^(?:https?:|mailto:|tel:|data:)/.test(reference)) {
        const localPath = path.resolve(path.dirname(file), reference.split(/[?#]/)[0]);
        if (!fs.existsSync(localPath)) {
          fail(file, `broken local ${key}: ${reference}`, node.sourceCodeLocation?.startTag);
        }
      }
    }
  }

  const cssSource = read(path.join(path.dirname(file), "style.css"));
  const interactive = nodes.some((node) => {
    const attrs = attributes(node);
    return ["button", "input", "select", "textarea", "a"].includes(node.tagName) ||
      attrs.tabindex === "0";
  });
  if (interactive && !cssSource.includes(":focus-visible")) {
    fail(file, "interactive demo requires a visible keyboard focus style");
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

function validateStylesheet(file, item) {
  const source = read(file);
  let ast;
  try {
    ast = csstree.parse(source, {
      positions: true,
      onParseError: (error) => fail(file, `CSS parse error: ${error.message}`, error.loc?.start),
    });
  } catch (error) {
    fail(file, `CSS parse error: ${error.message}`, error.loc?.start);
    return;
  }

  const corrupt = source.match(corruptNativeFunction);
  if (corrupt) fail(file, `native CSS function was accidentally scoped: ${corrupt[0]}`);
  const customProperties = new Set();
  const customPropertyReferences = [];
  const keyframes = new Set();
  const animationReferences = [];
  csstree.walk(ast, {
    enter(node) {
      if (node.type === "Atrule" && /keyframes$/i.test(node.name)) {
        const name = csstree.generate(node.prelude).trim();
        keyframes.add(name);
        if (!name.startsWith(`uk-${item.id}-`)) fail(file, `unscoped keyframe ${name}`, node.loc?.start);
      }
      if (node.type !== "Declaration") return;
      const value = csstree.generate(node.value);
      if (node.property.startsWith("--")) {
        customProperties.add(node.property);
        if (!value.trim()) fail(file, `empty custom property ${node.property}`, node.loc?.start);
        return;
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

  const wrapper = `.uk-${item.id}`;
  if (!source.includes(`${wrapper}{box-sizing:border-box;max-inline-size:100%;inline-size:100%;`)) {
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

  if (!source.includes("@media (prefers-reduced-motion:reduce)")) {
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
    if (!/^(?:data:|https?:|#)/.test(reference) &&
        !fs.existsSync(path.resolve(path.dirname(file), reference.split(/[?#]/)[0]))) {
      fail(file, `broken CSS reference ${reference}`);
    }
  }
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
if (!ajv.validate(schema, catalog)) {
  for (const error of ajv.errors ?? []) {
    errors.push(`catalog.json${error.instancePath}: ${error.message}`);
  }
}

for (const item of catalog.patterns ?? []) {
  if (ids.has(item.id)) errors.push(`catalog.json: duplicate id ${item.id}`);
  ids.add(item.id);
  if (paths.has(item.path)) errors.push(`catalog.json: duplicate path ${item.path}`);
  paths.add(item.path);
  if (sources.has(item.source.url)) errors.push(`catalog.json: duplicate source ${item.source.url}`);
  sources.add(item.source.url);
  const category = item.categories?.[1];
  if (category in counts) counts[category] += 1;
  else errors.push(`catalog.json: unexpected category ${category}`);
  if (categoryRoots[category] && item.path !== `${categoryRoots[category]}/${item.id}/`) {
    errors.push(`catalog.json: ${item.id} path/category mismatch`);
  }
  if (!item.source.url.startsWith(upstream)) {
    errors.push(`catalog.json: ${item.id} source is not pinned Galaxy`);
  }
  if (item.source.name !== "Uiverse Galaxy") errors.push(`catalog.json: ${item.id} unexpected source`);
  if (!item.license.includes("MIT")) errors.push(`catalog.json: ${item.id} missing MIT metadata`);

  const directory = path.join(root, item.path);
  for (const name of requiredFiles) {
    if (!fs.existsSync(path.join(directory, name))) fail(path.join(directory, name), "required file missing");
  }
  const readme = path.join(directory, "README.md");
  if (fs.existsSync(readme)) {
    const content = read(readme);
    for (const heading of requiredHeadings) {
      if (!content.includes(heading)) fail(readme, `missing ${heading}`);
    }
    if (!content.includes(item.source.url)) fail(readme, "source differs from catalog");
    if (!content.includes("MIT")) fail(readme, "missing MIT license");
  }
  const stylesheet = path.join(directory, "style.css");
  const demo = path.join(directory, "demo.html");
  if (fs.existsSync(stylesheet)) validateStylesheet(stylesheet, item);
  if (fs.existsSync(demo)) validateHtml(demo, item);
}

if (catalog.patterns?.length !== 50) {
  errors.push(`catalog.json: expected 50 patterns, found ${catalog.patterns?.length}`);
}
for (const [category, expected] of Object.entries(expectedCounts)) {
  if (counts[category] !== expected) {
    errors.push(`catalog.json: expected ${expected} ${category}, found ${counts[category]}`);
  }
  const directory = path.join(root, categoryRoots[category]);
  const actual = fs.existsSync(directory)
    ? fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isDirectory()).length
    : 0;
  if (actual !== expected) {
    errors.push(`${categoryRoots[category]}: expected ${expected} directories, found ${actual}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${catalog.patterns.length} patterns: ${JSON.stringify(counts)}`);
console.log("CSS syntax, values, selectors, keyframes, custom properties, and native functions are valid.");
console.log("HTML parsing, landmarks, labels, focus styles, status messages, and references are valid.");
