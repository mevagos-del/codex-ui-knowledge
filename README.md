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
| `open-props` | [Open Props](https://github.com/argyleink/open-props) | Planned | Design tokens and CSS primitives |
| `hover-css` | [Hover.css](https://github.com/IanLunn/Hover) | Planned | Hover effects and microinteractions |
| `animate-css` | [Animate.css](https://github.com/animate-css/animate.css) | Planned | Entrance, exit, and attention animations |
| `pattern-craft` | [Pattern Craft](https://github.com/megh-bari/pattern-craft) | Planned | Backgrounds and decorative surfaces |

Planned sources are approved for future investigation but cannot supply catalog
patterns until their license is verified and their registry status becomes active.

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
2. Search `catalog.json` and the relevant directory.
3. Inspect the candidate's documentation and example.
4. Choose the simplest suitable production-ready pattern.
5. Adapt it to the target project's existing components and design tokens.
6. Verify keyboard use, reduced motion, responsive behavior, and performance.
7. Add a new pattern only when no suitable reusable option exists.

Project-specific `AGENTS.md` files and design systems override this generic
knowledge base.

## Current status

The repository contains 50 framework-neutral patterns from the completed Uiverse
Galaxy pilot. No patterns from the planned sources have been imported.

## Validation

Install the locked development dependencies and validate the complete catalog:

```sh
npm ci
npm test
```

The validator uses Ajv and `ajv-formats` for the registry and catalog schemas,
`css-tree` for CSS parsing and property checks, and `parse5` for HTML parsing.
It validates registry-driven provenance and licensing, duplicate identities and
upstream files, required package files, scoped selectors and keyframes, native
functions and references, responsive demo shells, reduced motion, labels,
keyboard focus styles, landmarks, and loader announcements. Successful output
reports dynamic totals by source and category.
