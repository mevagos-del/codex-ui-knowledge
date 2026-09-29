# Article Contents Card

## Category

component / cards / active item

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/Cards/Javierrocadev_fast-panther-65.html

Original creator credit: Javierrocadev.

## License

MIT, copyright (c) 2023 Uiverse.io. See [Uiverse Galaxy MIT license](../../../licenses/uiverse-galaxy-MIT.md). This implementation is adapted from the linked file.

## Purpose

Provides a reusable content surface with a distinct visual hierarchy.

## Recommended use

Feature panels, summaries, and dashboards.

## Avoid / use with caution

Avoid dense lists and essential hover-only details.

## Techniques

- border
- background-color

## Performance

good. Small CSS-only example with no runtime dependency.

## Mobile

safe. Touch users can access the control or content without hover.

## Accessibility

Reading order follows the HTML. Use native links or buttons for actions; reveal behavior is keyboard available where used.

## Reduced motion

recommended. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-accent`, `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `recommended`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
