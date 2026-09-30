# Shared UI knowledge integration

The shared UI/CSS reference repository is available at:

`<PATH_TO_CODEX_UI_KNOWLEDGE>`

Before implementing or replacing UI/CSS:

1. Inspect the project's existing implementation and reusable components.
2. Inspect the project's design tokens and interaction rules.
3. Query the shared repository with `npm run recommend -- --use-case <use-case>`.
4. Review the shortlisted package README files and demos.
5. Reject candidates that fail mobile, accessibility, performance, compatibility,
   or license suitability constraints.
6. Adapt the selected technique to project-local semantics, components, tokens,
   and supported browsers.
7. Create a new implementation only when no suitable existing technique remains.

Priority order:

1. Project-local component.
2. Project-local design system.
3. Existing shared knowledge package.
4. Adapt an existing shared package.
5. Create a new implementation.

Project instructions and the project design system override visual values from
the shared repository. The repository is a reference system, not a visual theme.
Never copy arbitrary upstream colors, spacing, typography, or aesthetics.

Before using a package, inspect its source usage suitability in
`intelligence/search-index.json`. Treat `conditional` as requiring review of the
linked verified license terms. Do not assume commercial suitability.
