import fs from "node:fs";
import path from "node:path";
import { recommend } from "./intelligence-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));

function parseArguments(argv) {
  const request = { limit: 5 };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      index += 1;
      return value;
    };
    if (argument === "--use-case") request.useCase = next();
    else if (argument === "--mobile") request.mobile = next();
    else if (argument === "--max-performance") request.maxPerformance = next();
    else if (argument === "--max-accessibility-risk") request.maxAccessibilityRisk = next();
    else if (argument === "--usage") request.usage = next();
    else if (argument === "--commercial") request.usage = "commercial";
    else if (argument === "--limit") request.limit = Number.parseInt(next(), 10);
    else if (argument === "--allow-conditional-license") request.allowConditionalLicense = true;
    else if (argument === "--allow-experimental") request.allowExperimental = true;
    else if (argument === "--allow-expensive") request.allowExpensive = true;
    else if (argument === "--allow-mobile-avoid") request.allowMobileAvoid = true;
    else if (argument === "--allow-high-accessibility-risk") request.allowHighAccessibilityRisk = true;
    else if (argument === "--allow-continuous-motion") request.allowContinuousMotion = true;
    else if (argument === "--allow-dense-content-backdrop") request.allowDenseContentBackdrop = true;
    else if (argument === "--allow-compatibility-sensitive-overlay") request.allowCompatibilitySensitiveOverlay = true;
    else if (argument === "--show-rejected") request.showRejected = true;
    else if (argument === "--help") request.help = true;
    else throw new Error(`unknown option ${argument}`);
  }
  return request;
}

function usage() {
  console.log("Usage: npm run recommend -- --use-case <id> [options]");
  console.log("Options: --mobile safe|fallback|avoid --max-performance excellent|good|medium|expensive");
  console.log("         --max-accessibility-risk low|medium|high --usage personal|openSource|commercial");
  console.log("         --allow-conditional-license --limit <n> --show-rejected");
  console.log("         --allow-continuous-motion --allow-dense-content-backdrop");
}

let request;
try {
  request = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  usage();
  process.exit(2);
}
if (request.help) {
  usage();
  process.exit(0);
}

const index = readJson("intelligence/search-index.json");
const rules = readJson("intelligence/selection-rules.json");
const taxonomy = readJson("intelligence/taxonomy.json");
if (request.useCase && !taxonomy.useCases.includes(request.useCase)) {
  console.error(`Unknown use case: ${request.useCase}`);
  process.exit(2);
}
const { accepted, rejected } = recommend(index.entries, request, rules);
const shown = accepted.slice(0, request.limit);
if (!shown.length) console.log("No candidates passed the requested constraints.");
for (const [indexNumber, result] of shown.entries()) {
  console.log(`${indexNumber + 1}. ${result.entry.id}`);
  console.log(`   score: ${result.score}`);
  console.log(`   path: ${result.entry.path}`);
  console.log(`   matched: ${request.useCase ?? "general suitability"}`);
  for (const part of result.parts.filter((part) => part.points !== 0)) {
    console.log(`   ${part.points > 0 ? "+" : "-"} ${part.label}: ${Math.abs(part.points)}`);
  }
  const remaining = Object.entries(result.entry.risk).filter(([, value]) => value !== "low");
  console.log(`   risks: ${remaining.length ? remaining.map(([name, value]) => `${name}=${value}`).join(", ") : "all low"}`);
}
console.log(`\nMatched ${accepted.length}; rejected ${rejected.length}.`);
if (rejected.length) {
  const reasonCounts = new Map();
  for (const result of rejected) {
    for (const reason of result.reasons) reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
  }
  console.log("Rejection summary:");
  for (const [reason, count] of [...reasonCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`- ${count} × ${reason}`);
  }
}
if (request.showRejected) {
  console.log("\nRejected candidates:");
  for (const result of rejected.slice(0, 20)) console.log(`- ${result.entry.id}: ${result.reasons.join("; ")}`);
}
