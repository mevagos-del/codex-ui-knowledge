# Sizes / Spacing

## Category

tokens / layout / spacing

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.sizes.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

A curated positive spacing scale plus a small fluid spacing range.

## Recommended use

Use lower values inside compact controls, middle values for component padding and gaps, and larger or fluid values for section rhythm.

## Avoid / use with caution

Avoid choosing tokens solely by their number. Validate density, text wrapping, touch targets, and the host layout at narrow widths.

## Token groups

- `--size-1` through `--size-10`: fixed rem-based spacing from 0.25rem to 5rem.
- `--size-fluid-1` through `--size-fluid-5`: viewport-aware spacing with bounded minimum and maximum values.

## Adaptation guidance

Map selected values to semantic project roles such as `--space-control`, `--space-card`, and `--space-section`. Preserve the host system's base rhythm and avoid wholesale replacement.

## Performance

Custom properties and `clamp()` have negligible layout overhead in typical interfaces.

## Accessibility

Spacing must preserve readable grouping and touch targets. Test text zoom and narrow viewports; do not compress controls below usable dimensions.

## Browser notes

Fixed values work broadly. Fluid tokens require CSS `clamp()`, supported in current evergreen browsers.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-sizes-spacing)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
