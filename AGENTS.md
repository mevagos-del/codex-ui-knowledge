# Codex UI Knowledge instructions

## Scope

These instructions apply to the entire repository. This repository is a curated
reference library, not a deployable application and not a bulk mirror of external
repositories.

## Core workflow

Before implementing or modifying UI:

1. Identify the UI problem, target device, interaction model, and constraints.
2. Search `catalog.json` and this repository for an existing pattern.
3. Inspect the pattern documentation and example before using its code.
4. Select the simplest pattern that satisfies the requirement.
5. Adapt it to the target project's existing design system and components.
6. Verify mobile behavior, accessibility, reduced motion, and performance.
7. Create a new pattern only when no suitable reusable pattern exists.

Never copy a visual effect blindly. Project-specific instructions, components,
and design tokens always override this generic library.

## Curation rules

- Do not vendor or copy an entire upstream repository.
- Import patterns in small, reviewable batches.
- Remove unnecessary dependencies and decorative complexity.
- Prefer framework-neutral HTML and CSS as the canonical implementation.
- Add framework adapters only when they materially improve reuse.
- Keep each pattern self-contained and independently understandable.
- Do not add near-duplicates. Extend or document an existing pattern instead.
- Preserve upstream attribution and comply with the applicable license.
- Do not import code until its license and exact source URL have been verified.

## Pattern package requirements

Use a descriptive kebab-case directory name. A complete pattern normally contains:

```text
pattern-name/
├── README.md
├── demo.html
├── style.css
└── react.tsx       # optional adapter
```

Every pattern `README.md` must state:

- purpose and suitable use cases;
- cases where it should be avoided;
- source name and exact source URL;
- upstream license and whether the code was adapted;
- category and relevant search tags;
- production status: `recommended`, `conditional`, or `experimental`;
- complexity: `low`, `medium`, or `high`;
- performance: `excellent`, `good`, `medium`, or `expensive`;
- mobile behavior: `safe`, `fallback`, or `avoid`;
- accessibility requirements;
- reduced-motion behavior;
- browser or feature support constraints;
- expected CSS custom properties and integration notes.

Add or update the corresponding `catalog.json` entry in the same change.

## Pattern selection priorities

Prefer, in order:

1. Existing target-project primitives and components.
2. Existing production-ready patterns from this repository.
3. Native CSS and semantic HTML.
4. CSS custom properties and project tokens.
5. Small progressive enhancements.

Avoid unnecessary JavaScript-driven animation, duplicate style systems, heavy
runtime dependencies, and effects whose decoration outweighs their UI value.

## CSS architecture

- Keep selectors local and predictable; avoid styling bare global elements.
- Expose configurable values through well-named CSS custom properties.
- Reuse the target project's spacing, radii, shadow, color, and typography tokens.
- Avoid `!important` unless documenting an unavoidable integration constraint.
- Prefer logical properties when they improve internationalization.
- Use modern CSS only with a documented fallback or explicit support requirement.
- Treat examples as reference implementations, not mandatory naming conventions.

## Motion and performance

- Prefer `transform` and `opacity` for animation.
- Avoid animating layout-triggering properties such as `width`, `height`, `top`,
  and `left` unless there is a documented reason.
- Use `filter`, `backdrop-filter`, large blurs, and animated shadows cautiously.
- Avoid continuous animation unless it communicates active system state.
- Do not add `will-change` permanently without a measured need.
- Keep mobile and low-power devices in mind.
- Respect `prefers-reduced-motion` and provide a meaningful non-motion state.

## Accessibility

Interactive patterns must:

- use semantic elements where possible;
- work with keyboard input;
- expose a visible `:focus-visible` state;
- not rely on hover alone to communicate meaning or state;
- preserve sufficient text and control contrast;
- maintain usable touch targets;
- avoid motion that can cause discomfort;
- retain content and functionality when animation is disabled.

Decorative patterns must not interfere with reading order, pointer input, focus,
or assistive technology.

## Responsive behavior

- Start from the smallest supported viewport.
- Avoid fixed dimensions unless intrinsic to the pattern.
- Prevent horizontal overflow at common mobile widths.
- Ensure hover enhancements have touch-safe fallbacks.
- Document container-query or viewport-query assumptions.

## Verification checklist

Before considering a pattern complete:

1. Open the standalone demo and verify its default state.
2. Test keyboard navigation and focus visibility.
3. Test reduced-motion behavior.
4. Test narrow mobile and wide desktop layouts.
5. Check for overflow and unintended global style leakage.
6. Confirm source attribution and license metadata.
7. Confirm `catalog.json` remains valid JSON and matches the documentation.

## Repository hygiene

- Keep source files readable and minimally formatted.
- Do not commit generated build output, dependency directories, or downloaded
  upstream repositories.
- Keep changes focused on one category or curation batch where practical.
- Explain adaptations that materially differ from the upstream pattern.
