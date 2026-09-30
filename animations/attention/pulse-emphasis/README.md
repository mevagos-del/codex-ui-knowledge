# Pulse Emphasis

## Category

animation / attention

## Source

- Source name: Animate.css
- Source ID: `animate-css`
- Source repository: https://github.com/animate-css/animate.css
- Exact immutable source URL: https://github.com/animate-css/animate.css/blob/3f8ab233dbbd9d2fe577528d2296382954be3d1a/source/attention_seekers/pulse.css
- Revision: `3f8ab233dbbd9d2fe577528d2296382954be3d1a`
- Original upstream name: pulse

## License

Verified license: Hippocratic License 2.1. See [local license](../../../licenses/animate-css-Hippocratic-2.1.md) and the [immutable upstream license](https://github.com/animate-css/animate.css/blob/3f8ab233dbbd9d2fe577528d2296382954be3d1a/LICENSE). This package is an adapted, scoped excerpt.

## Purpose

Provides emphasis feedback as a small, framework-neutral animation pattern.

## Recommended use

Use for a single meaningful state change where the motion helps users understand feedback, hierarchy, or direction.

## Avoid / use with caution

Avoid dense control groups, repeated automatic playback, and any use where motion hides essential content or delays a task.

## Motion intent

emphasis. The motion communicates emphasis feedback; it is not continuous decoration.

## Techniques

- locally scoped CSS
- transform and/or opacity where the source concept allows
- semantic button demo with hover and keyboard focus parity
- one-shot, state-driven playback

## Duration guidance

Start within 350-650ms. Map the timing to Open Props easing tokens such as `var(--ease-out-3, ease-out)` or `var(--ease-in-3, ease-in)`; the fallback keeps the package standalone.

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
