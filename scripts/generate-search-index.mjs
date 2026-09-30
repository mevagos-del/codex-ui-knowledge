import fs from "node:fs";
import path from "node:path";
import { buildSearchIndex } from "./intelligence-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const index = buildSearchIndex(readJson("catalog.json"), readJson("source-registry.json"));
fs.mkdirSync(path.join(root, "intelligence"), { recursive: true });
fs.writeFileSync(path.join(root, "intelligence", "search-index.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Generated ${index.entries.length} search entries.`);
