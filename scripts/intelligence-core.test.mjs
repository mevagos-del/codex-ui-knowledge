import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildSearchIndex,
  findSearchIndexDrift,
  recommend,
  validateDecisionMetadata,
  validateRecipes,
} from "./intelligence-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const catalog = readJson("catalog.json");
const registry = readJson("source-registry.json");
const taxonomy = readJson("intelligence/taxonomy.json");
const rules = readJson("intelligence/selection-rules.json");
const index = buildSearchIndex(catalog, registry);

function entry(overrides = {}) {
  return {
    id: "candidate",
    name: "Candidate",
    path: "components/candidate/",
    categories: ["components", "buttons"],
    useCases: ["primary-action"],
    tags: [],
    production: "recommended",
    performance: "good",
    mobile: "safe",
    complexity: "low",
    reducedMotion: true,
    visualIntensity: "low",
    contentDensity: "high",
    interactionPriority: "primary",
    adaptability: "high",
    risk: { accessibility: "low", performance: "low", compatibility: "low" },
    source: "example",
    usage: { personal: true, openSource: true, commercial: true, reference: "https://example.com/license" },
    ...overrides,
  };
}

test("rejects an unknown use case", () => {
  const issues = validateDecisionMetadata({ ...entry(), useCases: ["unknown-purpose"] }, taxonomy);
  assert.match(issues.join("\n"), /unknown useCase unknown-purpose/);
});

test("reports missing decision metadata", () => {
  const issues = validateDecisionMetadata({ id: "incomplete" }, taxonomy);
  assert.match(issues.join("\n"), /missing visualIntensity/);
  assert.match(issues.join("\n"), /missing risk\.accessibility/);
});

test("detects search index drift", () => {
  const changed = structuredClone(index);
  changed.entries[0].name = "Changed";
  assert.match(findSearchIndexDrift(catalog, registry, changed).join("\n"), /differs from catalog/);
});

test("rejects a recipe with a missing package", () => {
  const issues = validateRecipes({ recipes: [{ id: "broken", packages: [{ id: "missing" }], includes: [] }] }, new Set());
  assert.match(issues.join("\n"), /references missing package missing/);
});

test("commercial selection rejects Hover.css conditional usage", () => {
  const hover = index.entries.filter((item) => item.source === "hover-css");
  const result = recommend(hover, { usage: "commercial" }, rules);
  assert.equal(result.accepted.length, 0);
  assert.equal(result.rejected.length, 12);
  assert.match(result.rejected[0].reasons.join("\n"), /commercial usage is conditional/);
});

test("mobile-safe selection rejects mobile avoid", () => {
  const result = recommend([entry({ mobile: "avoid" })], { mobile: "safe" }, rules);
  assert.equal(result.accepted.length, 0);
  assert.match(result.rejected[0].reasons.join("\n"), /mobile avoid exceeds safe/);
});

test("maximum performance filters expensive candidates", () => {
  const result = recommend([entry({ performance: "expensive" })], { maxPerformance: "good" }, rules);
  assert.equal(result.accepted.length, 0);
  assert.match(result.rejected[0].reasons.join("\n"), /performance expensive exceeds good/);
});

test("accessibility ceiling filters high-risk candidates", () => {
  const result = recommend([entry({ risk: { accessibility: "high", performance: "low", compatibility: "low" } })], { maxAccessibilityRisk: "medium" }, rules);
  assert.equal(result.accepted.length, 0);
  assert.match(result.rejected[0].reasons.join("\n"), /accessibility risk high exceeds medium/);
});

test("ranking is deterministic", () => {
  const candidates = [entry({ id: "zeta" }), entry({ id: "alpha" })];
  const first = recommend(candidates, { useCase: "primary-action" }, rules);
  const second = recommend(candidates.toReversed(), { useCase: "primary-action" }, rules);
  assert.deepEqual(first.accepted.map(({ entry: item }) => item.id), ["alpha", "zeta"]);
  assert.deepEqual(second.accepted.map(({ entry: item }) => item.id), ["alpha", "zeta"]);
});

test("all five source families retain expected counts and decision metadata", () => {
  const counts = Object.fromEntries(registry.sources.map((source) => [source.id, index.entries.filter((item) => item.source === source.id).length]));
  assert.deepEqual(counts, {
    "uiverse-galaxy": 50,
    "open-props": 6,
    "hover-css": 12,
    "animate-css": 12,
    "pattern-craft": 20,
  });
  assert.equal(index.entries.length, 100);
  assert.ok(index.entries.every((item) => item.useCases.length && item.adaptability && item.risk.accessibility));
  assert.ok(registry.sources.every((source) => source.usage.reference && source.usage.commercial !== undefined));
});
