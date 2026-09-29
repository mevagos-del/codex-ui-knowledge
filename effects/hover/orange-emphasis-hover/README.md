# Orange Emphasis Hover

## Category

effect / hover / color emphasis

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/Buttons/Progee45_lucky-turkey-67.html

Original creator credit: Progee45.

## License

MIT, copyright (c) 2023 Uiverse.io. See [Uiverse Galaxy MIT license](../../../licenses/uiverse-galaxy-MIT.md). This implementation is adapted from the linked file.

## Purpose

Adds optional visual feedback to a native button without hiding its meaning.

## Recommended use

Stand-alone actions, onboarding, and sparse controls.

## Avoid / use with caution

Do not rely on hover for essential meaning.

## Techniques

- transition
- background-color

## Performance

excellent. Small CSS-only example with no runtime dependency.

## Mobile

safe with fallback. Touch users can access the control or content without hover.

## Accessibility

A native button preserves keyboard operation. Focus is visible and receives the same enhancement as hover. Keep text contrast sufficient.

## Reduced motion

required. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-accent`, `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `recommended`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
