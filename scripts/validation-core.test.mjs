import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
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
