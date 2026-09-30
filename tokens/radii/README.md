# Radii

## Category

tokens / shape / radii

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.borders.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

A representative shape scale covering conventional, fully rounded, hand-drawn, and organic radii.

## Recommended use

Use the numbered scale for product surfaces and controls; reserve drawn and blob values for deliberate expressive branding.

## Avoid / use with caution

Avoid mixing many radius families in one interface or using organic shapes where consistent hit areas and alignment matter.

## Token groups

- `--radius-1` through `--radius-6`: increasing conventional radii.
- `--radius-round`: pill and circular shapes.
- `--radius-drawn-*`: irregular hand-drawn corners.
- `--radius-blob-*`: organic percentage-based shapes.

## Adaptation guidance

Select a small subset and map it to project roles such as `--radius-sm`, `--radius-md`, and `--radius-lg`. Keep project-local names and existing component contracts.

## Performance

Static border radii have low cost. Extreme radii can increase clipping work when combined with large media or animation.

## Accessibility

Radius is decorative. Keep focus outlines visible and do not reduce the usable hit area of controls.

## Browser notes

Conventional and percentage border-radius values are broadly supported. Irregular slash syntax is also widely supported in modern browsers.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-radii)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
