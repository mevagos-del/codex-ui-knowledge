# Codex UI Knowledge

Curated frontend knowledge base for Codex: reusable UI patterns, CSS effects,
animations, design tokens, layouts, and production-ready recipes.

This repository is not a mirror of third-party libraries. Patterns are selected,
normalized, documented, and adapted before they are added here.

## Goals

- Help Codex find an existing pattern before creating a new one.
- Prefer simple, accessible, responsive, and performant implementations.
- Keep visual patterns independent from any single product design system.
- Preserve source attribution and license information for every derived pattern.
- Make patterns easy to adapt to project-specific tokens and components.

## Knowledge sources

`source-registry.json` is the machine-readable authority for upstream identity,
repository ownership, license verification, provenance URL rules, revision
pinning, and import status. `catalog.json` references these definitions by stable
source ID. See [SOURCES.md](SOURCES.md) for the human-readable overview.

| Source ID | Source | Status | Primary use |
| --- | --- | --- | --- |
| `uiverse-galaxy` | [Uiverse Galaxy](https://github.com/uiverse-io/galaxy) | Active | Components and visual effects |
| `open-props` | [Open Props](https://github.com/argyleink/open-props) | Active | Design tokens and CSS primitives |
| `hover-css` | [Hover.css](https://github.com/IanLunn/Hover) | Active | Hover effects and microinteractions |
| `animate-css` | [Animate.css](https://github.com/animate-css/animate.css) | Active | Entrance, exit, attention, and state animations |
| `pattern-craft` | [Pattern Craft](https://github.com/megh-bari/pattern-craft) | Active | Backgrounds and decorative surfaces |

Planned sources are approved for future investigation but cannot supply catalog
entries until their license is verified and their registry status becomes active.

## Repository structure

```text
codex-ui-knowledge/
├── AGENTS.md
├── README.md
├── SOURCES.md
├── catalog.json
├── catalog.schema.json
├── source-registry.json
├── source-registry.schema.json
├── licenses/
├── components/
├── effects/
├── animations/
├── backgrounds/
├── tokens/
├── layouts/
├── recipes/
├── intelligence/
├── integrations/
└── guidelines/
```

| Directory | Contains |
| --- | --- |
| `components/` | Reusable controls and interface components |
| `effects/` | Visual treatments that do not define full components |
| `animations/` | Motion patterns, transitions, and microinteractions |
| `backgrounds/` | Decorative surfaces, grids, dots, and gradients |
| `tokens/` | Framework-neutral design primitives and token guidance |
| `layouts/` | Responsive page and component layout patterns |
| `recipes/` | Composed solutions that combine several patterns |
| `intelligence/` | Controlled taxonomy, selection and composition rules, and generated search index |
| `integrations/` | Template instructions for projects that consume this reference system |
| `guidelines/` | Selection, accessibility, performance, and architecture rules |
| `licenses/` | Verified upstream license texts and notices |

## Source and catalog model

Each catalog pattern records a stable source ID, an exact upstream URL, the
revision represented by that URL, and whether the implementation was copied,
adapted, or reimplemented. The validator resolves the source ID through the
registry and applies the registry's URL pattern, revision policy, and license
record. New sources therefore require data and license verification rather than
new source-specific validator code.

Follow [the import protocol](guidelines/import-protocol.md) to register a source,
verify its license, activate it, define a curation scope, record provenance, and
submit a validated import pull request.

## How Codex should use this repository

1. Define the UI problem and constraints.
2. Inspect project-local components and design tokens before consulting shared knowledge.
3. Run `npm run recommend -- --use-case <use-case>` with relevant constraints.
4. Inspect the shortlisted candidates and their rejection risks.
5. Choose the simplest suitable production-ready package.
6. Adapt it to the target project's existing components and design tokens.
7. Verify keyboard use, reduced motion, responsive behavior, and performance.
8. Add a new pattern only when no suitable reusable option exists.

Project-specific `AGENTS.md` files and design systems override this generic
knowledge base.

The intelligence layer is documented in [intelligence/README.md](intelligence/README.md).
It provides a finite use-case taxonomy, explicit hard rejections, documented
ranking weights, composition rules, ten recipes, and a generated 100-entry
search index. This repository is a reference system, not a visual theme.

## Current status

The repository contains 100 packages: 50 framework-neutral Uiverse Galaxy
patterns, six Open Props token families, 12 Hover.css microinteractions, 12
Animate.css motion patterns, and 20 Pattern Craft backgrounds and decorative
surfaces.

## Validation

Install the locked development dependencies and validate the complete catalog:

```sh
npm ci
npm test
npm run recommend -- --use-case primary-action --mobile safe
```

The validator uses Ajv and `ajv-formats` for the registry and catalog schemas,
`css-tree` for CSS parsing and property checks, and `parse5` for HTML parsing.
It validates registry-driven provenance and licensing, duplicate identities and
upstream files, required package files, scoped selectors and keyframes, native
functions and references, responsive demo shells, reduced motion, labels,
keyboard focus styles, landmarks, and loader announcements. Successful output
reports dynamic totals by source and category.

`npm run validate` also checks decision metadata, taxonomy and rule references,
license suitability values, recipe references and cycles, and generated search
index drift. Regenerate the index after catalog or source suitability changes:

```sh
npm run generate:index
```
