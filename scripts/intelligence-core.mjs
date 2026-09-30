const decisionFields = [
  "useCases", "visualIntensity", "contentDensity", "interactionPriority",
  "adaptability", "risk",
];

function fieldValue(object, field) {
  return field.split(".").reduce((value, key) => value?.[key], object);
}

export function validateTaxonomy(taxonomy) {
  const issues = [];
  if (!Array.isArray(taxonomy?.useCases) || !taxonomy.useCases.length) {
    issues.push("taxonomy requires useCases");
    return issues;
  }
  const seen = new Set();
  for (const useCase of taxonomy.useCases) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(useCase)) issues.push(`invalid useCase ${useCase}`);
    if (seen.has(useCase)) issues.push(`duplicate useCase ${useCase}`);
    seen.add(useCase);
  }
  return issues;
}

export function validateDecisionMetadata(item, taxonomy) {
  const issues = [];
  for (const field of decisionFields) {
    if (item?.[field] === undefined) issues.push(`${item?.id ?? "<unknown>"} missing ${field}`);
  }
  if (!Array.isArray(item?.useCases) || !item.useCases.length) {
    issues.push(`${item?.id ?? "<unknown>"} useCases must be a non-empty array`);
  } else {
    const allowed = new Set(taxonomy.useCases ?? []);
    for (const useCase of item.useCases) {
      if (!allowed.has(useCase)) issues.push(`${item.id} has unknown useCase ${useCase}`);
    }
  }
  for (const field of ["visualIntensity", "contentDensity", "interactionPriority", "adaptability"]) {
    if (item?.[field] !== undefined && !taxonomy.dimensions?.[field]?.includes(item[field])) {
      issues.push(`${item.id} has invalid ${field} ${item[field]}`);
    }
  }
  for (const dimension of ["accessibility", "performance", "compatibility"]) {
    if (item?.risk?.[dimension] === undefined) issues.push(`${item?.id ?? "<unknown>"} missing risk.${dimension}`);
    else if (!taxonomy.dimensions?.risk?.includes(item.risk[dimension])) {
      issues.push(`${item.id} has invalid risk.${dimension} ${item.risk[dimension]}`);
    }
  }
  return issues;
}

export function buildSearchIndex(catalog, registry) {
  const sources = new Map((registry.sources ?? []).map((source) => [source.id, source]));
  return {
    version: 1,
    catalogVersion: catalog.version,
    generatedBy: "node scripts/generate-search-index.mjs",
    entries: (catalog.patterns ?? []).map((item) => {
      const source = sources.get(item.source.id);
      return {
        id: item.id,
        name: item.name,
        path: item.path,
        categories: item.categories,
        useCases: item.useCases,
        tags: item.tags,
        production: item.production,
        performance: item.performance,
        mobile: item.mobile,
        complexity: item.complexity,
        reducedMotion: item.reducedMotion,
        visualIntensity: item.visualIntensity,
        contentDensity: item.contentDensity,
        interactionPriority: item.interactionPriority,
        adaptability: item.adaptability,
        risk: item.risk,
        source: item.source.id,
        usage: {
          personal: source?.usage?.personal,
          openSource: source?.usage?.openSource,
          commercial: source?.usage?.commercial,
          reference: source?.usage?.reference,
        },
      };
    }),
  };
}

export function findSearchIndexDrift(catalog, registry, actual) {
  const expected = buildSearchIndex(catalog, registry);
  return JSON.stringify(actual) === JSON.stringify(expected)
    ? []
    : ["search index differs from catalog or source registry; run npm run generate:index"];
}

export function validateSelectionRules(rules, taxonomy) {
  const issues = [];
  const validFields = new Set([
    "production", "mobile", "performance", "reducedMotion",
    "visualIntensity", "contentDensity", "interactionPriority", "adaptability",
    "risk.accessibility", "risk.performance", "risk.compatibility",
  ]);
  const ids = new Set();
  for (const rule of rules?.hardRejections ?? []) {
    if (ids.has(rule.id)) issues.push(`duplicate selection rule ${rule.id}`);
    ids.add(rule.id);
    const conditions = rule.conditions ?? [rule];
    for (const condition of conditions) {
      if (![...validFields, "motion", "motion.continuous", "useCases", "categories"].includes(condition.field)) {
        issues.push(`selection rule ${rule.id} uses unknown field ${condition.field}`);
      }
      if (!["equals", "includes", "exists"].includes(condition.operator)) {
        issues.push(`selection rule ${rule.id} uses unknown operator ${condition.operator}`);
      }
    }
    if (!rule.reason) issues.push(`selection rule ${rule.id} requires a reason`);
  }
  for (const dimension of ["production", "mobile", "complexity", "performance", "adaptability", "visualIntensity", "risk", "usage"]) {
    if (!rules?.ranking?.[dimension]) issues.push(`ranking weights missing ${dimension}`);
  }
  const allowedUseCases = new Set(taxonomy.useCases ?? []);
  for (const useCase of rules?.preferredUseCases ?? []) {
    if (!allowedUseCases.has(useCase)) issues.push(`selection rules reference unknown useCase ${useCase}`);
  }
  return issues;
}

function conditionMatches(entry, condition) {
  const actual = fieldValue(entry, condition.field);
  if (condition.operator === "exists") return actual !== undefined;
  if (condition.operator === "includes") return Array.isArray(actual) && actual.includes(condition.value);
  return actual === condition.value;
}

export function validateRecipes(document, catalogIds) {
  const issues = [];
  const recipes = document?.recipes ?? [];
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  if (byId.size !== recipes.length) issues.push("duplicate recipe id");
  for (const recipe of recipes) {
    for (const item of recipe.packages ?? []) {
      if (!catalogIds.has(item.id)) issues.push(`${recipe.id} references missing package ${item.id}`);
    }
    for (const include of recipe.includes ?? []) {
      if (!byId.has(include)) issues.push(`${recipe.id} includes missing recipe ${include}`);
    }
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id, trail = []) {
    if (visiting.has(id)) {
      issues.push(`circular recipe reference ${[...trail, id].join(" -> ")}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const include of byId.get(id)?.includes ?? []) visit(include, [...trail, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
  return [...new Set(issues)];
}

export function validateCompositionRules(document, taxonomy) {
  const issues = [];
  const ids = new Set();
  const knownTerms = new Set([
    ...(taxonomy.useCases ?? []), "tokens", "components", "animations", "backgrounds",
    "overlays", "elevation", "mobile",
  ]);
  for (const rule of document?.rules ?? []) {
    if (ids.has(rule.id)) issues.push(`duplicate composition rule ${rule.id}`);
    ids.add(rule.id);
    if (!Array.isArray(rule.combines) || rule.combines.length < 2) {
      issues.push(`${rule.id} must combine at least two concepts`);
    }
    for (const term of rule.combines ?? []) {
      if (!knownTerms.has(term)) issues.push(`${rule.id} references unknown concept ${term}`);
    }
    if (!rule.guidance) issues.push(`${rule.id} requires guidance`);
    if (!Array.isArray(rule.rejectWhen) || !rule.rejectWhen.length) {
      issues.push(`${rule.id} requires rejection conditions`);
    }
  }
  return issues;
}

function exceeds(order, value, maximum) {
  return maximum !== undefined && order.indexOf(value) > order.indexOf(maximum);
}

function scoreEntry(entry, request, rules) {
  const weights = rules.ranking;
  const parts = [];
  const add = (label, points) => {
    parts.push({ label, points });
    return points;
  };
  let score = 0;
  if (request.useCase && entry.useCases.includes(request.useCase)) score += add(`use case ${request.useCase}`, weights.useCaseMatch);
  score += add(`production ${entry.production}`, weights.production[entry.production]);
  score += add(`mobile ${entry.mobile}`, weights.mobile[entry.mobile]);
  score += add(`complexity ${entry.complexity}`, weights.complexity[entry.complexity]);
  score += add(`performance ${entry.performance}`, weights.performance[entry.performance]);
  score += add(`adaptability ${entry.adaptability}`, weights.adaptability[entry.adaptability]);
  score += add(`visual intensity ${entry.visualIntensity}`, weights.visualIntensity[entry.visualIntensity]);
  for (const dimension of ["accessibility", "performance", "compatibility"]) {
    score += add(`${dimension} risk ${entry.risk[dimension]}`, weights.risk[entry.risk[dimension]]);
  }
  if (request.usage) {
    const value = entry.usage[request.usage];
    score += add(`${request.usage} usage ${value}`, weights.usage[String(value)] ?? 0);
  }
  return { score, parts };
}

export function recommend(entries, request, rules) {
  const accepted = [];
  const rejected = [];
  for (const entry of entries) {
    const reasons = [];
    if (request.useCase && !entry.useCases.includes(request.useCase)) reasons.push(`does not support use case ${request.useCase}`);
    if (request.mobile && exceeds(rules.mobileOrder, entry.mobile, request.mobile)) reasons.push(`mobile ${entry.mobile} exceeds ${request.mobile}`);
    if (request.maxPerformance && exceeds(rules.performanceOrder, entry.performance, request.maxPerformance)) {
      reasons.push(`performance ${entry.performance} exceeds ${request.maxPerformance}`);
    }
    if (request.maxAccessibilityRisk && exceeds(rules.riskOrder, entry.risk.accessibility, request.maxAccessibilityRisk)) {
      reasons.push(`accessibility risk ${entry.risk.accessibility} exceeds ${request.maxAccessibilityRisk}`);
    }
    if (request.usage) {
      const suitability = entry.usage[request.usage];
      if (suitability === false) reasons.push(`${request.usage} usage is not permitted by registered terms`);
      if (suitability === "conditional" && !request.allowConditionalLicense) {
        reasons.push(`${request.usage} usage is conditional; review ${entry.usage.reference}`);
      }
    }
    for (const rule of rules.hardRejections ?? []) {
      const conditions = rule.conditions ?? [rule];
      if (conditions.every((condition) => conditionMatches(entry, condition)) && !request[rule.requestOverride]) reasons.push(rule.reason);
    }
    if (reasons.length) {
      rejected.push({ entry, reasons: [...new Set(reasons)] });
      continue;
    }
    const scored = scoreEntry(entry, request, rules);
    accepted.push({ entry, ...scored });
  }
  accepted.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));
  rejected.sort((a, b) => a.entry.id.localeCompare(b.entry.id));
  return { accepted, rejected };
}
