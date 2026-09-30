# Aspect Ratios

## Category

tokens / media / aspect ratios

## Source

- Source name: Open Props
- Exact source: https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/src/props.aspects.css
- Pinned commit SHA: `530682d04327f842f56bb1ec33cf84a3cadb3876`
- Upstream repository: https://github.com/argyleink/open-props
- Source ID: `open-props`

## License

MIT, copyright (c) 2021 Adam Argyle. See [local Open Props MIT license](../../licenses/open-props-MIT.md) and the [immutable upstream license](https://github.com/argyleink/open-props/blob/530682d04327f842f56bb1ec33cf84a3cadb3876/LICENSE).

## Purpose

Named aspect-ratio references for common media and card shapes.

## Recommended use

Use named ratios to reserve stable space for images, video, previews, and media cards before content loads.

## Avoid / use with caution

Avoid forcing content into a ratio that crops essential information. Let text-driven containers size naturally.

## Token groups

- Square, landscape, portrait, and widescreen cover common product media.
- Ultrawide supports banner-like surfaces.
- Golden provides an expressive proportional option.

## Adaptation guidance

Map only the ratios used by the product to semantic roles such as `--ratio-avatar`, `--ratio-card-media`, and `--ratio-video`. Preserve content-specific crop behavior.

## Performance

Native aspect-ratio reduces layout shift and has negligible runtime cost.

## Accessibility

A ratio does not replace meaningful alternative text. Ensure crops do not hide essential information and preserve media controls.

## Browser notes

Native `aspect-ratio` is supported in current evergreen browsers. Older browsers may need a padding-based fallback.

## Notes

The package is adapted from only the named upstream file. Values and Open Props variable names are preserved; the upstream `:where(html)` selector is normalized to `:where(.op-aspect-ratios)` so importing this reference does not create global tokens. Apply that class to an integration boundary or copy selected declarations into the host design-token layer. No JavaScript, external assets, resets, themes, fonts, components, color palettes, or gradients are included.
