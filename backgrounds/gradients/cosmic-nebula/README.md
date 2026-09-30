# Cosmic Nebula

## Category

background / gradient / gradient

## Source

- Source name: Pattern Craft
- Source ID: `pattern-craft`
- Upstream repository: https://github.com/megh-bari/pattern-craft
- Exact pinned source URL: https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/src/data/patterns.ts#L8281-L8310
- Pinned revision: `1550af7903f50b4f19a1b44786f27ca01f3ef6ab`
- Original upstream identifier: Cosmic Nebula

## License

MIT, copyright (c) 2025 Megh Bari. See the [local license](../../../licenses/pattern-craft-MIT.md) and [immutable upstream license](https://github.com/megh-bari/pattern-craft/blob/1550af7903f50b4f19a1b44786f27ca01f3ef6ab/LICENSE). This package is an adapted, framework-neutral excerpt from the licensed source file.

## Purpose

This pattern adds controlled multizone depth to a sparse dark hero or feature band.

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

Use light foreground text or a separate content card. The demo uses an opaque light card so the decorative glow cannot lower text contrast. Verify final colors in the host design system.

## Performance

medium. Multiple full-surface layers or mask compositing increase paint work; keep the decorated area bounded.

## Mobile

safe. The pattern scales with its container; the demo verifies a 360px viewport. Reduce density or remove masks when a simpler small-screen surface reads better.

## Customization

Adapt `--surface`, `--line`, `--line-soft`, `--dot`, `--accent`, pattern size, opacity, mask position, and intensity to the host design system.

## Browser notes

Uses broadly supported CSS gradients and custom properties.

## Notes

The React, Next.js, and Tailwind wrapper is removed. The visual technique is normalized to standalone HTML/CSS with local selectors, no animation, no remote asset, and no runtime dependency. Production status: `conditional`.
