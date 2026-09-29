# Bubble Row Loader

## Category

animation / loading / bubble row

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/loaders/LeonKohli_ordinary-rat-31.html

Original creator credit: LeonKohli.

## License

MIT, copyright (c) 2023 Uiverse.io. See [Uiverse Galaxy MIT license](../../../licenses/uiverse-galaxy-MIT.md). This implementation is adapted from the linked file.

## Purpose

Communicates an indeterminate pending state with CSS-only motion.

## Recommended use

Short pending states with an accessible status message.

## Avoid / use with caution

Use a progress bar when measured progress is available.

## Techniques

- transform
- keyframes

## Performance

good. Small CSS-only example with no runtime dependency.

## Mobile

safe. Touch users can access the control or content without hover.

## Accessibility

Decorative markup is hidden from assistive technology and a live status label reports loading.

## Reduced motion

required. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-accent`, `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `recommended`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
