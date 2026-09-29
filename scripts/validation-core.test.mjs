import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  findCatalogDuplicates,
  findCorruptNativeFunction,
  isBrokenLocalReference,
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

test("rejects malformed provenance and revision mismatches", () => {
  const item = pattern({
    source: { ...pattern().source, url: "https://example.com/unpinned.css", revision: "b".repeat(40) },
  });
  const result = validatePatternProvenance(item, definitions, process.cwd());
  assert.match(result.errors.join("\n"), /does not match/);
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
