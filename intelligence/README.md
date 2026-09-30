# Production intelligence

This directory turns the catalog into an explainable decision layer. It does not
add patterns or replace project-specific design judgment.

## Files

- `taxonomy.json` defines the finite use-case and decision-value vocabulary.
- `selection-rules.json` defines hard rejection rules, ordering, and score weights.
- `composition-rules.json` describes safe combinations and rejection conditions.
- `search-index.json` is generated from `catalog.json` and `source-registry.json`.

Run `npm run generate:index` after catalog or source suitability metadata changes.
Validation fails if the committed index differs from its generated form.

## Selection sequence

Always check project-local components and design tokens first. The CLI then
filters by use case and requested constraints, applies hard rejections, and ranks
the remaining catalog entries. Adapt a passing package before writing a new
implementation.

Hard rejections cover experimental packages, mobile-avoid packages, expensive
effects, high accessibility risk, missing reduced-motion support, explicit
request limits, unjustified continuous motion, dense content backdrops,
compatibility-sensitive overlays, and incompatible or conditional license
suitability. Project-level rules reject hover-only interaction, unnecessary
token replacement, and unsupported compositions before implementation.

## Ranking model

Scores are deterministic and exist only to order candidates that already passed
the filters. The weights are stored in `selection-rules.json`:

- use-case match: 40
- recommended production status: 18
- mobile safe: 14
- excellent/good performance: 12/9
- low complexity: 10
- high adaptability: 12
- low visual intensity: 6
- each low risk dimension: 4
- explicitly requested, verified usage suitability: 8

Conditional and higher-cost values receive fewer points. Ties are sorted by ID.
Visual novelty has no positive weight.

## CLI

```sh
npm run recommend -- --use-case primary-action --mobile safe
npm run recommend -- --use-case hero --max-performance medium
npm run recommend -- --use-case motion-system
npm run recommend -- --use-case hover-feedback --commercial --show-rejected
```

Use `--allow-conditional-license` only after reviewing the linked license terms.
Other opt-ins exist for experimental, expensive, mobile-avoid, high
accessibility-risk, continuous-motion, dense-backdrop, and compatibility-sensitive
candidates. Each result reports its score components, remaining non-low risks,
and an aggregate rejection summary; `--show-rejected` prints candidate-level
rejection reasons.
