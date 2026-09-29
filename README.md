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

| Source | Primary use | Import approach |
| --- | --- | --- |
| [Uiverse Galaxy](https://github.com/uiverse-io/galaxy) | Components and visual effects | Curated selections only |
| [Open Props](https://github.com/argyleink/open-props) | Design tokens and CSS primitives | Referenced and selectively adapted |
| [Hover.css](https://github.com/IanLunn/Hover) | Hover effects and microinteractions | Curated, simplified, and normalized |
| [Animate.css](https://github.com/animate-css/animate.css) | Entrance, exit, and attention animations | Curated selections only |
| [Pattern Craft](https://github.com/megh-bari/pattern-craft) | Backgrounds, gradients, and decorative surfaces | Ideas and selectively adapted patterns |

Before importing code, verify the upstream license and record the exact source in
the pattern documentation. See [SOURCES.md](SOURCES.md).

## Repository structure

```text
codex-ui-knowledge/
├── AGENTS.md
├── README.md
├── SOURCES.md
├── catalog.json
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

The first controlled curation batch contains 50 framework-neutral patterns from Uiverse Galaxy: 10 buttons, 10 cards, 10 inputs, 10 loaders, and 10 hover or interaction effects. Each package includes an attributed README, standalone demo, and scoped stylesheet.
