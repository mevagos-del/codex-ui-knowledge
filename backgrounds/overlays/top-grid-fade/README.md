# Top Grid Fade Overlay

## Category

background / overlay / overlay

## Source

- Source name: Pattern Craft
- Source ID: `pattern-craft`
- Upstream repository: https://github.com/megh-bari/pattern-craft
- Exact pinned source URL: https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/src/data/patterns.ts#L944-L977
- Pinned revision: `1550af7903f50b4f19a1b44786f27ca01f3ef6ab`
- Original upstream identifier: Top Fade Grid

## License

MIT, copyright (c) 2025 Megh Bari. See the [local license](../../../licenses/pattern-craft-MIT.md) and [immutable upstream license](https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/LICENSE). This package is an adapted, framework-neutral excerpt from the licensed source file.

## Purpose

This pattern confines structural detail to the top of a section so body content stays quiet.

## Recommended use

Landing-page heroes, dashboard shells, knowledge-base headers, empty states, feature bands, and other bounded surfaces where decoration supports hierarchy.

## Avoid / use with caution

Avoid dense tables, long body-copy regions, print layouts, and continuously scrolling surfaces. Keep the effect out of regions that require maximum contrast.

## Techniques

- radial mask
- scoped pseudo-element
- CSS custom properties
- isolation and pointer-safe decoration

## Contrast guidance

Keep primary text on a separate solid or translucent content surface. The mask deliberately clears part of the region, but contrast still depends on host colors.

## Performance

medium. Multiple full-surface layers or mask compositing increase paint work; keep the decorated area bounded.

## Mobile

fallback. The pattern scales with its container; the demo verifies a 360px viewport. Reduce density or remove masks when a simpler small-screen surface reads better.

## Customization

Adapt `--surface`, `--line`, `--line-soft`, `--dot`, `--accent`, pattern size, opacity, mask position, and intensity to the host design system.

## Browser notes

CSS masks need current Safari, Chromium, or Firefox; the solid surface remains when masks are unavailable.

## Notes

The React, Next.js, and Tailwind wrapper is removed. The visual technique is normalized to standalone HTML/CSS with local selectors, no animation, no remote asset, and no runtime dependency. Production status: `conditional`.
