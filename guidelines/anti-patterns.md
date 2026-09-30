# Production anti-patterns

Use catalog decision metadata and the selection rules to reject unsuitable
techniques before adapting code.

## Motion chosen for spectacle

Motion without state, hierarchy, direction, or feedback consumes attention and
can cause discomfort. Prefer a static state or one short transition. Treat
`visualIntensity: high`, `risk.accessibility: medium|high`, attention use cases,
and conditional production status as caution signals.

## Stacked decorative effects

Multiple gradients, masks, shadows, and animated layers increase paint cost and
make hierarchy unclear. Keep one primary decorative layer and simplify the rest.
Reject combinations where several packages have `performance: medium|expensive`
or `risk.performance: medium|high`.

## Hover as the only feedback

Hover does not cover keyboard or touch input. Use a component with a visible
focus state and a touch-safe base state. Treat `mobile: fallback|avoid`,
`hover-feedback`, and `risk.accessibility: medium|high` as caution signals.

## Replacing project tokens

Importing a complete token scale creates a second design system and weakens
semantic consistency. Map only needed values into existing project roles. Token
packages with high adaptability are references; they are not automatic project
defaults.

## Decoration behind long text

Grid, noise, and high-intensity gradients can reduce reading comfort even when
individual color pairs appear sufficient. Put body copy on a solid or translucent
surface. Treat background packages with `visualIntensity: medium|high`,
`contentDensity: low`, or `decorative-overlay` as unsuitable behind long text.

## High-intensity data screens

Dashboards need stable hierarchy and dense scanning. Prefer low-intensity
structural surfaces or no decoration. Reject high visual intensity for
`dashboard-shell` unless a bounded empty state or focal section requires it.

## Loader used instead of useful progress

Looping indicators do not explain duration or completed work. Prefer determinate
progress, a skeleton, or static status text when possible. Treat
`loading-feedback`, continuous animation, and medium performance risk as signals
to verify duration and reduced-motion behavior.

## Excessive elevation

Large or repeated shadows create visual noise and extra paint work, especially
over textured surfaces. Use borders, spacing, or one low-cost shadow. Treat
multiple shadow techniques and medium performance risk as a reason to simplify.

## Blur and backdrop filtering by default

Large blur regions are costly and may vary across browsers. Prefer opaque or
translucent surfaces without backdrop processing. Reject expensive performance
metadata or high compatibility risk unless the target environment is measured.

## Complexity as a selection goal

The most elaborate candidate often adds integration and maintenance cost without
improving the task. Rank production, accessibility, mobile safety, complexity,
performance, adaptability, and visual restraint before novelty. Adapt the
simplest passing package and create new code only when no existing technique fits.
