# Easings

## Category

tokens / motion / easing

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.easing.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

A curated set of timing functions for standard, entrance, exit, emphasized, and spring-like transitions.

## Recommended use

Use the standard curves for routine state changes, ease-out curves for entrances, ease-in curves for exits, and elastic or spring curves only for brief expressive feedback.

## Avoid / use with caution

Avoid applying expressive curves to large or frequent motion, and do not use easing as a substitute for a reduced-motion state.

## Token groups

- `--ease-1`, `--ease-3`, `--ease-5`: progressively stronger standard curves.
- `--ease-in-*`: accelerating exit curves.
- `--ease-out-*`: decelerating entrance curves.
- `--ease-in-out-*`: emphasized two-sided curves.
- `--ease-elastic-out-*` and `--ease-spring-1`: expressive overshoot and spring-like timing.

## Adaptation guidance

Map a small subset to project roles such as `--motion-standard`, `--motion-enter`, and `--motion-exit`. Keep project-local names in production and preserve reduced-motion overrides. Do not replace an established motion system automatically.

## Performance

The variables themselves are effectively free. Runtime cost depends on the transitioned property; prefer transform and opacity.

## Accessibility

The demo uses short hover and focus transitions and removes transition duration under `prefers-reduced-motion`. Product code must provide the same preference handling.

## Browser notes

Cubic Bézier values work broadly. The `linear()` spring token requires browsers with CSS linear easing support; use a cubic Bézier fallback where older browsers matter.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-easings)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
