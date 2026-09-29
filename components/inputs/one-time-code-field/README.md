# One-Time Code Field

## Category

component / inputs / segmented code

## Source

Source repository: `Uiverse Galaxy`

Original source URL: https://github.com/uiverse-io/galaxy/blob/adbd2adde0a299a3956ea288fb444ec01891ca41/Inputs/barisdogansutcu_gentle-pig-32.html

Original creator credit: barisdogansutcu.

## License

MIT, copyright (c) 2023 Uiverse.io. See [UPSTREAM-LICENSE.md](../../../UPSTREAM-LICENSE.md). This implementation is adapted from the linked file.

## Purpose

Provides a labeled native form control with a distinct focus treatment.

## Recommended use

Forms with room for a visible label.

## Avoid / use with caution

Keep native validation and labels when integrating.

## Techniques

- flex
- border

## Performance

excellent. Small CSS-only example with no runtime dependency.

## Mobile

safe. Touch users can access the control or content without hover.

## Accessibility

Each field has a visible label or accessible name. Preserve keyboard operation, focus visibility, validation, and contrast.

## Reduced motion

recommended. The stylesheet stops decorative animation and transitions under `prefers-reduced-motion` while retaining content.

## Customization

Adjust `--ui-duration`, size, radius, colors, and contrast to match the host design system.

## Notes

Production status: `conditional`. Complexity: `low`. Framework-neutral HTML and CSS with no external assets or JavaScript. Selectors and keyframes are scoped. Test against the host design system and target browsers.
