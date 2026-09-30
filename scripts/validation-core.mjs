import fs from "node:fs";
import path from "node:path";
import * as csstree from "css-tree";

const nativeFunctions = [
  "rotate", "translate", "translateX", "translateY", "translate3d", "scale", "scaleX",
  "scaleY", "skew", "calc", "min", "max", "clamp", "var", "rgb", "rgba", "hsl",
  "hsla", "linear-gradient", "radial-gradient", "cubic-bezier",
];

const corruptNativeFunction = new RegExp(
  `\\buk-[a-z0-9-]+-(?:${nativeFunctions.join("|")})\\s*\\(`,
  "i",
);

export function findCorruptNativeFunction(source) {
  return source.match(corruptNativeFunction)?.[0] ?? null;
}

export function parseCssSource(source) {
  const errors = [];
  let ast = null;
  try {
    ast = csstree.parse(source, {
      positions: true,
      onParseError: (error) => errors.push(error),
    });
  } catch (error) {
    errors.push(error);
  }
  return { ast, errors };
}

const patternHeadings = [
  "## Category", "## Source", "## License", "## Purpose", "## Recommended use",
  "## Avoid / use with caution", "## Techniques", "## Performance", "## Mobile",
  "## Accessibility", "## Reduced motion", "## Customization", "## Notes",
];

const tokenHeadings = [
  "## Category", "## Source", "## License", "## Purpose", "## Recommended use",
  "## Avoid / use with caution", "## Token groups", "## Adaptation guidance",
  "## Performance", "## Accessibility", "## Browser notes", "## Notes",
];

export function packageRequirements(item) {
  const type = item.package?.type;
  const stylesheet = item.package?.stylesheet;
  if (!type || !stylesheet) return null;
  return {
    stylesheet,
    requiredFiles: ["README.md", "demo.html", stylesheet],
    requiredHeadings: type === "tokens" ? tokenHeadings : patternHeadings,
    requireResponsiveWrapper: type === "pattern",
  };
}

export function sourceDefinitions(registry) {
  return new Map((registry.sources ?? []).map((source) => [source.id, source]));
}

export function matchSourceUrl(source, url) {
  try {
    return new RegExp(source.provenance.sourceUrlPattern).exec(url);
  } catch {
    return null;
  }
}

export function validatePatternProvenance(item, definitions, root) {
  const errors = [];
  const source = definitions.get(item.source?.id);
  if (!source) return { errors: [`references missing source ${item.source?.id ?? "<none>"}`], upstreamPath: null };

  if (source.status !== "active") errors.push(`source ${source.id} is not active`);
  if (source.license.status !== "verified") errors.push(`source ${source.id} license is not verified`);

  const match = matchSourceUrl(source, item.source.url);
  if (!match) {
    errors.push(`source URL does not match ${source.id} provenance rules`);
  } else if (source.provenance.revisionRequired) {
    if (!item.source.revision) errors.push(`source ${source.id} requires a revision`);
    if (!match.groups?.revision) {
      errors.push(`source ${source.id} URL rule does not capture a revision`);
    } else if (match.groups.revision !== item.source.revision) {
      errors.push(`catalog revision does not match provenance URL revision`);
    }
  }

  const itemLicense = typeof item.license === "string" ? item.license : "";
  if (source.license.name &&
      !itemLicense.toLocaleLowerCase("en").includes(source.license.name.toLocaleLowerCase("en"))) {
    errors.push(`license is incompatible with registered ${source.license.name} license`);
  }
  if (source.license.status === "verified") {
    if (!source.license.url && !source.license.localFile) {
      errors.push(`source ${source.id} has no verified license reference`);
    }
    if (source.license.localFile &&
        !fs.existsSync(path.resolve(root, source.license.localFile))) {
      errors.push(`registered license file is missing: ${source.license.localFile}`);
    }
  }

  return { errors, upstreamPath: match?.groups?.path ?? null };
}

export function findCatalogDuplicates(patterns, definitions) {
  const issues = [];
  const seen = {
    id: new Map(),
    path: new Map(),
    url: new Map(),
    upstream: new Map(),
  };
  const check = (kind, key, item) => {
    if (!key) return;
    const previous = seen[kind].get(key);
    if (previous) issues.push(`duplicate ${kind} ${key} (${previous} and ${item.id})`);
    else seen[kind].set(key, item.id);
  };

  for (const item of patterns) {
    check("id", item.id, item);
    check("path", item.path, item);
    check("url", item.source?.url, item);
    const source = definitions.get(item.source?.id);
    const match = source ? matchSourceUrl(source, item.source.url) : null;
    if (match?.groups?.path) check("upstream", `${source.id}:${match.groups.path}`, item);
  }
  return issues;
}

export function findCatalogWarnings(patterns) {
  const warnings = [];
  const names = new Map();
  for (const item of patterns) {
    const normalized = item.name.trim().toLocaleLowerCase("en");
    const previous = names.get(normalized);
    if (previous && previous !== item.id) {
      warnings.push(`suspicious duplicate name "${item.name}" (${previous} and ${item.id})`);
    } else {
      names.set(normalized, item.id);
    }
  }
  return warnings;
}

export function isBrokenLocalReference(baseDirectory, reference) {
  if (!reference || /^(?:#|https?:|mailto:|tel:|data:)/.test(reference)) return false;
  const localPath = path.resolve(baseDirectory, reference.split(/[?#]/)[0]);
  return !fs.existsSync(localPath);
}
