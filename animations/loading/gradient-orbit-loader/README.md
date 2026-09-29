# Gradient Orbit Loader

## Category

animation / loading / gradient orbit

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/loaders/gharsh11032000_slimy-donkey-39.html

Original creator credit: gharsh11032000.

## License

MIT, copyright (c) 2023 Uiverse.io. See [UPSTREAM-LICENSE.md](../../../UPSTREAM-LICENSE.md). This implementation is adapted from the linked file.

## Purpose

Communicates an indeterminate pending state with CSS-only motion.

## Recommended use

Short pending states with an accessible status message.

## Avoid / use with caution

Use a progress bar when measured progress is available.

## Techniques

- gradient
- transform

## Performance

medium. Decorative paint work warrants testing on low-power devices.

## Mobile

safe. Touch users can access the control or content without hover.

## Accessibility

Decorative markup is hidden from assistive technology and a live status label reports loading.

## Reduced motion

required. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-accent`, `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `conditional`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
