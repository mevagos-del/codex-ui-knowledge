# Typography Scale

## Category

tokens / typography / scale

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.fonts.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

A curated type-size scale with supporting line-height, letter-spacing, and fluid-size references.

## Recommended use

Use the fixed scale for predictable interface hierarchy and fluid sizes selectively for prominent display text.

## Avoid / use with caution

Avoid binding semantic heading levels directly to token numbers or using fluid display sizes for dense product UI.

## Token groups

- `--font-size-00` through `--font-size-8`: fixed type sizes.
- `--font-size-fluid-0` through `--font-size-fluid-3`: bounded responsive sizes.
- `--font-lineheight-*` and `--font-letterspacing-*`: supporting rhythm and tracking.

## Adaptation guidance

Map sizes to project roles such as `--text-body`, `--text-title`, and `--text-display`, then pair them with suitable line height. Retain semantic HTML and project-local names.

## Performance

The tokens have negligible runtime cost. Fluid sizing can cause more reflow during viewport changes but is inexpensive in normal use.

## Accessibility

Keep rem-based values so browser zoom and user font settings remain effective. Maintain readable line height and avoid tiny text for essential content.

## Browser notes

Fixed rem and unitless values work broadly. Fluid sizes require CSS `clamp()` in current evergreen browsers.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-typography-scale)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
