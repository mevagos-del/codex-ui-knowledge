import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  analyzeMotionCss,
  findCatalogDuplicates,
  findCorruptNativeFunction,
  isBrokenLocalReference,
  packageRequirements,
  parseCssSource,
  sourceDefinitions,
  validatePatternProvenance,
} from "./validation-core.mjs";

const activeSource = {
  id: "example-source",
  status: "active",
  license: { status: "verified", name: "MIT", url: "https://example.com/LICENSE", localFile: null },
  provenance: {
    sourceUrlPattern: "^https://github\\.com/example/repo/blob/(?<revision>[0-9a-f]{40})/(?<path>[^?#]+)$",
    revisionRequired: true,
  },
};
const revision = "a".repeat(40);
const pattern = (overrides = {}) => ({
  id: "example-pattern",
  name: "Example Pattern",
  path: "components/example-pattern/",
  license: "MIT",
  package: { type: "pattern", stylesheet: "style.css", scope: ".uk-example-pattern" },
  source: {
    id: "example-source",
    url: `https://github.com/example/repo/blob/${revision}/patterns/example.css`,
    revision,
    adaptation: "adapted",
  },
  ...overrides,
});
const definitions = sourceDefinitions({ sources: [activeSource] });
const repositoryRoot = path.resolve(import.meta.dirname, "..");
const repositoryCatalog = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "catalog.json"), "utf8"));

test("rejects a scoped native CSS function", () => {
  assert.equal(
    findCorruptNativeFunction("transform: uk-example-rotate(360deg);"),
    "uk-example-rotate(",
  );
});

test("rejects a missing source definition", () => {
  const result = validatePatternProvenance(pattern(), new Map(), process.cwd());
  assert.match(result.errors.join("\n"), /missing source example-source/);
});

test("rejects a wrong repository URL", () => {
  const item = pattern({
    source: { ...pattern().source, url: "https://example.com/unpinned.css", revision: "b".repeat(40) },
  });
  const result = validatePatternProvenance(item, definitions, process.cwd());
  assert.match(result.errors.join("\n"), /does not match/);
});

test("rejects a provenance revision mismatch", () => {
  const item = pattern({
    source: { ...pattern().source, revision: "b".repeat(40) },
  });
  const result = validatePatternProvenance(item, definitions, process.cwd());
  assert.match(result.errors.join("\n"), /revision does not match/);
});

test("rejects inactive or license-unverified sources", () => {
  const inactive = { ...activeSource, status: "planned", license: { ...activeSource.license, status: "unverified" } };
  const result = validatePatternProvenance(pattern(), sourceDefinitions({ sources: [inactive] }), process.cwd());
  assert.match(result.errors.join("\n"), /not active/);
  assert.match(result.errors.join("\n"), /license is not verified/);
});

test("token packages require tokens.css without requiring style.css", () => {
  const requirements = packageRequirements({
    package: { type: "tokens", stylesheet: "tokens.css", scope: ":where(.op-example)" },
  });
  assert.deepEqual(requirements.requiredFiles, ["README.md", "demo.html", "tokens.css"]);
  assert.equal(requirements.requiredFiles.includes("style.css"), false);
});

test("existing pattern packages still require style.css", () => {
  const requirements = packageRequirements(pattern());
  assert.deepEqual(requirements.requiredFiles, ["README.md", "demo.html", "style.css"]);
});

test("a missing declared token file is detectable", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ui-knowledge-token-package-"));
  try {
    const requirements = packageRequirements({
      package: { type: "tokens", stylesheet: "tokens.css", scope: ":where(.op-example)" },
    });
    const missing = requirements.requiredFiles.filter((name) => !fs.existsSync(path.join(directory, name)));
    assert.ok(missing.includes("tokens.css"));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("detects duplicate IDs and paths", () => {
  const duplicate = pattern({ source: { ...pattern().source, url: `https://github.com/example/repo/blob/${revision}/patterns/other.css` } });
  const issues = findCatalogDuplicates([pattern(), duplicate], definitions).join("\n");
  assert.match(issues, /duplicate id/);
  assert.match(issues, /duplicate path/);
});

test("detects duplicate source and upstream file combinations", () => {
  const duplicate = pattern({ id: "other", path: "components/other/" });
  const issues = findCatalogDuplicates([pattern(), duplicate], definitions).join("\n");
  assert.match(issues, /duplicate url/);
  assert.match(issues, /duplicate upstream/);
});

test("rejects invalid CSS syntax", () => {
  assert.ok(parseCssSource(".example { color red; }").errors.length > 0);
});

test("detects broken local references", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ui-knowledge-validation-"));
  try {
    assert.equal(isBrokenLocalReference(directory, "./missing.svg"), true);
    fs.writeFileSync(path.join(directory, "present.svg"), "<svg/>");
    assert.equal(isBrokenLocalReference(directory, "./present.svg"), false);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("motion validation rejects unscoped keyframes", () => {
  const css = ".uk-example{animation-name:uk-example-enter}@keyframes enter{to{opacity:1}}@media (prefers-reduced-motion:reduce){.uk-example{animation:none}}";
  assert.match(analyzeMotionCss(css, ".uk-example").join("\n"), /unscoped keyframe enter/);
});

test("motion validation rejects missing reduced-motion handling", () => {
  const css = ".uk-example{animation-name:uk-example-enter}@keyframes uk-example-enter{to{opacity:1}}";
  assert.match(analyzeMotionCss(css, ".uk-example").join("\n"), /missing reduced-motion query/);
});

test("motion validation rejects broken animation references", () => {
  const css = ".uk-example{animation-name:uk-example-missing}@media (prefers-reduced-motion:reduce){.uk-example{animation:none}}";
  assert.match(analyzeMotionCss(css, ".uk-example").join("\n"), /missing keyframes uk-example-missing/);
});

test("motion validation requires explicit metadata for infinite motion", () => {
  const css = ".uk-example{animation:uk-example-pulse 1s infinite}@keyframes uk-example-pulse{to{opacity:.5}}@media (prefers-reduced-motion:reduce){.uk-example{animation:none}}";
  assert.match(analyzeMotionCss(css, ".uk-example", { continuous: false }).join("\n"), /motion\.continuous: true/);
  assert.doesNotMatch(analyzeMotionCss(css, ".uk-example", { continuous: true }).join("\n"), /infinite/);
});

test("motion documentation adds intent and duration guidance", () => {
  const requirements = packageRequirements({ ...pattern(), motion: { continuous: false, trigger: "enter" } });
  assert.ok(requirements.requiredHeadings.includes("## Motion intent"));
  assert.ok(requirements.requiredHeadings.includes("## Duration guidance"));
});

test("existing Uiverse pattern packages remain compatible", () => {
  const item = repositoryCatalog.patterns.find((entry) => entry.source.id === "uiverse-galaxy");
  assert.deepEqual(packageRequirements(item).requiredFiles, ["README.md", "demo.html", "style.css"]);
  assert.equal(item.motion, undefined);
});

test("existing Open Props token packages remain compatible", () => {
  const item = repositoryCatalog.patterns.find((entry) => entry.source.id === "open-props");
  assert.deepEqual(packageRequirements(item).requiredFiles, ["README.md", "demo.html", "tokens.css"]);
  assert.equal(packageRequirements(item).requireResponsiveWrapper, false);
});
