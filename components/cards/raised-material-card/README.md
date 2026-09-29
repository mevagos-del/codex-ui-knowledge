# Raised Material Card

## Category

component / cards / raised shadow

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/Cards/SachinKumar666_spicy-tiger-75.html

Original creator credit: SachinKumar666.

## License

MIT, copyright (c) 2023 Uiverse.io. See [UPSTREAM-LICENSE.md](../../../UPSTREAM-LICENSE.md). This implementation is adapted from the linked file.

## Purpose

Provides a reusable content surface with a distinct visual hierarchy.

## Recommended use

Feature panels, summaries, and dashboards.

## Avoid / use with caution

Avoid dense lists and essential hover-only details.

## Techniques

- box-shadow
- transition

## Performance

good. Small CSS-only example with no runtime dependency.

## Mobile

safe. Touch users can access the control or content without hover.

## Accessibility

Reading order follows the HTML. Use native links or buttons for actions; reveal behavior is keyboard available where used.

## Reduced motion

required. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `recommended`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
