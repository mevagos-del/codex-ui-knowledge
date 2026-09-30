# Warm Beige Surface

## Category

background / surface / decorative

## Source

- Source name: Pattern Craft
- Source ID: `pattern-craft`
- Upstream repository: https://github.com/megh-bari/pattern-craft
- Exact pinned source URL: https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/src/data/patterns.ts#L3809-L3834
- Pinned revision: `1550af7903f50b4f19a1b44786f27ca01f3ef6ab`
- Original upstream identifier: Warm Beige

## License

MIT, copyright (c) 2025 Megh Bari. See the [local license](../../../licenses/pattern-craft-MIT.md) and [immutable upstream license](https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/LICENSE). This package is an adapted, framework-neutral excerpt from the licensed source file.

## Purpose

This pattern creates a restrained editorial surface for feature bands and knowledge-base headers.

## Recommended use

Landing-page heroes, dashboard shells, knowledge-base headers, empty states, feature bands, and other bounded surfaces where decoration supports hierarchy.

## Avoid / use with caution

Avoid dense tables, long body-copy regions, print layouts, and continuously scrolling surfaces. Keep the effect out of regions that require maximum contrast.

## Techniques

- layered radial gradients
- scoped pseudo-element
- CSS custom properties
- isolation and pointer-safe decoration

## Contrast guidance

Dark foreground text may work over quiet areas, but use a separate content surface for body copy or variable content. The demo card isolates text from the decoration. Visual inspection alone does not establish WCAG compliance.

## Performance

good. The static gradients require no script or continuous compositing; keep surface dimensions reasonable.

## Mobile

safe. The pattern scales with its container; the demo verifies a 360px viewport. Reduce density or remove masks when a simpler small-screen surface reads better.

## Customization

Adapt `--surface`, `--line`, `--line-soft`, `--dot`, `--accent`, pattern size, opacity, mask position, and intensity to the host design system.

## Browser notes

Uses broadly supported CSS gradients and custom properties.

## Notes

The React, Next.js, and Tailwind wrapper is removed. The visual technique is normalized to standalone HTML/CSS with local selectors, no animation, no remote asset, and no runtime dependency. Production status: `recommended`.
