# Shadows

## Category

tokens / elevation / shadows

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.shadows.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

A compact elevation scale with outer and inset shadow references.

## Recommended use

Use lower levels for subtle separation and higher levels for floating surfaces such as menus or dialogs, after mapping them to the project elevation model.

## Avoid / use with caution

Avoid high shadow levels on many simultaneous surfaces. Large blurred shadows increase paint cost and can weaken hierarchy when overused.

## Token groups

- `--shadow-1` through `--shadow-5`: increasing outer elevation.
- `--inner-shadow-0` through `--inner-shadow-2`: inset edges and pressed surfaces.
- Strength variables support the retained formulas.

## Adaptation guidance

Map representative levels to roles such as `--elevation-card`, `--elevation-popover`, and `--elevation-dialog`. Tune the shadow color for the host surface. Keep the project naming and do not replace an existing elevation system automatically.

## Performance

Static low-level shadows are usually inexpensive. Larger multi-layer shadows can increase paint work, especially on moving elements.

## Accessibility

Do not rely on shadow alone to communicate state or boundaries. Preserve sufficient border and foreground contrast where separation is essential.

## Browser notes

Uses broadly supported custom properties, `calc()`, and HSL alpha syntax. Very old browsers may need precomputed shadow values.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-shadows)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
