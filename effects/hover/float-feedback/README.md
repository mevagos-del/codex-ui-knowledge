# Float Feedback

## Category

effect / hover / microinteraction

## Source

- Source name: Hover.css
- Source ID: `hover-css`
- Source repository: https://github.com/IanLunn/Hover
- Exact immutable source URL: https://github.com/IanLunn/Hover/blob/eb8629df13850d78bbcccd4fed68d231aec0c535/scss/effects/2d-transitions/_float.scss
- Revision: `eb8629df13850d78bbcccd4fed68d231aec0c535`
- Original upstream name: Float

## License

Verified license: MIT (personal/open source terms). See [local license](../../../licenses/hover-css-MIT-personal-open-source.md) and the [immutable upstream license](https://github.com/IanLunn/Hover/blob/eb8629df13850d78bbcccd4fed68d231aec0c535/license.txt). This package is an adapted, scoped excerpt.

## Purpose

Provides lift feedback as a small, framework-neutral interaction pattern.

## Recommended use

Use for a single meaningful state change where the motion helps users understand feedback, hierarchy, or direction.

## Avoid / use with caution

Avoid dense control groups, repeated automatic playback, and any use where motion hides essential content or delays a task.

## Motion intent

feedback. The motion communicates lift feedback; it is not continuous decoration.

## Techniques

- locally scoped CSS
- transform and/or opacity where the source concept allows
- semantic button demo with hover and keyboard focus parity
- one-shot, state-driven playback

## Duration guidance

Start within 160-260ms. Map the timing to Open Props easing tokens such as `var(--ease-out-3, ease-out)` or `var(--ease-in-3, ease-in)`; the fallback keeps the package standalone.

## Performance

excellent. The package is CSS-only and isolated; effects involving shadows or large pseudo-elements may require extra paint.

## Mobile

safe with fallback. The control remains usable without hover, and touch activation preserves the native button behavior.

## Accessibility

The demo uses a native button, visible focus, and the same enhancement for keyboard focus. Motion carries no unique meaning. Use attention motion sparingly and never loop it for routine status.

## Reduced motion

Under `prefers-reduced-motion: reduce`, animation and transition durations collapse to a single near-instant state change while content and focus styling remain available.

## Customization

Adjust duration, easing, distance, scale, direction, and accent color through the local declarations. Keep movement proportional to the control and preserve contrast.

## Notes

The core upstream motion is preserved while selectors, names, duration, easing, focus behavior, and reduced-motion handling are normalized. No upstream utility bundle, JavaScript, font, image, or external asset is included.
