import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const required = ["id","name","path","categories","tags","source","license","production","performance","mobile","reducedMotion"];
const headings = ["## Category","## Source","## License","## Purpose","## Recommended use","## Avoid / use with caution","## Techniques","## Performance","## Mobile","## Accessibility","## Reduced motion","## Customization","## Notes"];
const expected = { buttons: 10, cards: 10, inputs: 10, loaders: 10, hover: 10 };
const counts = Object.fromEntries(Object.keys(expected).map(key => [key, 0]));
const ids = new Set();
const errors = [];

if (catalog.version !== 1 || !Array.isArray(catalog.patterns)) errors.push("catalog root does not match version 1");
for (const item of catalog.patterns ?? []) {
  for (const key of required) if (!(key in item)) errors.push(`${item.id ?? "unknown"}: missing ${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`${item.id}: unstable id`);
  if (ids.has(item.id)) errors.push(`${item.id}: duplicate id`);
  ids.add(item.id);
  const category = item.categories?.[1];
  if (category in counts) counts[category]++;
  else errors.push(`${item.id}: unexpected category ${category}`);
  for (const file of ["README.md","demo.html","style.css"]) {
    if (!fs.existsSync(path.join(root, item.path, file))) errors.push(`${item.id}: missing ${file}`);
  }
  const readmePath = path.join(root, item.path, "README.md");
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, "utf8");
    for (const heading of headings) if (!readme.includes(heading)) errors.push(`${item.id}: missing ${heading}`);
    if (!readme.includes("github.com/uiverse-io/galaxy/blob/")) errors.push(`${item.id}: missing exact source`);
    if (!readme.includes("MIT")) errors.push(`${item.id}: missing license`);
  }
  const cssPath = path.join(root, item.path, "style.css");
  if (fs.existsSync(cssPath) && !fs.readFileSync(cssPath, "utf8").includes("prefers-reduced-motion")) errors.push(`${item.id}: missing reduced-motion rule`);
}
if (catalog.patterns?.length !== 50) errors.push(`expected 50 patterns, found ${catalog.patterns?.length}`);
for (const [key, value] of Object.entries(expected)) if (counts[key] !== value) errors.push(`expected ${value} ${key}, found ${counts[key]}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${catalog.patterns.length} patterns: ${JSON.stringify(counts)}`);
