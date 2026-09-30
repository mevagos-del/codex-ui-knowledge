# Sources and provenance

This repository uses third-party projects as discovery and learning sources. It
does not automatically grant permission to copy every asset or code sample.

## Source registry

[`source-registry.json`](source-registry.json) is authoritative for stable source
IDs, repository ownership, license verification, provenance URL rules, revision
requirements, and source status. Its shape is governed by
[`source-registry.schema.json`](source-registry.schema.json).

| Source ID | Source | Repository | Status | License status |
| --- | --- | --- | --- | --- |
| `uiverse-galaxy` | Uiverse Galaxy | https://github.com/uiverse-io/galaxy | Active | MIT verified |
| `open-props` | Open Props | https://github.com/argyleink/open-props | Active | MIT verified |
| `hover-css` | Hover.css | https://github.com/IanLunn/Hover | Active | MIT personal/open source terms verified |
| `animate-css` | Animate.css | https://github.com/animate-css/animate.css | Active | Hippocratic License 2.1 verified |
| `pattern-craft` | Pattern Craft | https://github.com/megh-bari/pattern-craft | Planned | Unverified |

Planned means the project is approved for a future verification and curation
phase. It does not authorize an import. The validator rejects catalog entries
from planned, retired, or license-unverified sources.

## Import requirements

For every imported or adapted pattern:

1. Record the exact upstream file, page, or commit URL.
2. Verify the license at the time of import.
3. Retain notices or attribution required by that license.
4. State whether the implementation is copied, adapted, or independently
   reimplemented from a general idea.
5. Do not import images, fonts, icons, trademarks, or other assets unless their
   reuse terms are independently verified.
6. Prefer documenting or linking to a pattern when redistribution terms are
   unclear.

Licenses and source contents can change. Re-check them for each curation batch.
Follow [the source registration and import protocol](guidelines/import-protocol.md)
for the complete sequence.

## Completed imports

### Uiverse Galaxy pilot

- Upstream commit: [adbd2adde0a299a3956ea288fb444ec01891ca41](https://github.com/uiverse-io/galaxy/tree/adbd2adde0a299a3956ea288fb444ec01891ca41)
- License verified: MIT, copyright (c) 2023 Uiverse.io
- Registry ID: `uiverse-galaxy`
- Local license: [licenses/uiverse-galaxy-MIT.md](licenses/uiverse-galaxy-MIT.md)
- Scope: 50 adapted HTML/CSS patterns (10 each for buttons, cards, inputs, loaders, and hover effects)
- Asset policy: no upstream images, fonts, logos, dependencies, or JavaScript imported
- Per-pattern provenance: exact upstream file URL and creator credit in every pattern README

### Open Props token foundation

- Upstream commit: [530682d04327f842f56bb1ec33cf84a3cadb3876](https://github.com/argyleink/open-props/tree/530682d04327f842f56bb1ec33cf84a3cadb3876)
- License verified: MIT, copyright (c) 2021 Adam Argyle
- Registry ID: `open-props`
- Local license: [licenses/open-props-MIT.md](licenses/open-props-MIT.md)
- Scope: six curated CSS token families: easings, shadows, radii, sizes and spacing, typography scale, and aspect ratios
- Exclusions: colors, gradients, resets, components, JavaScript, assets, fonts, themes, animations, and unrelated utilities
- Normalization: upstream variable names and values are retained while `:where(html)` is replaced with a package-local `:where(.op-*)` scope

### Motion and microinteractions

- Hover.css commit: [eb8629df13850d78bbcccd4fed68d231aec0c535](https://github.com/IanLunn/Hover/tree/eb8629df13850d78bbcccd4fed68d231aec0c535)
- Hover.css license: upstream personal/open source terms identify MIT and add open-source-use conditions; the exact immutable notice is preserved locally
- Animate.css commit: [3f8ab233dbbd9d2fe577528d2296382954be3d1a](https://github.com/animate-css/animate.css/tree/3f8ab233dbbd9d2fe577528d2296382954be3d1a)
- Animate.css license: Hippocratic License 2.1, verified from both `LICENSE` and `package.json`
- Scope: 12 interaction patterns and 12 one-shot animation patterns
- Normalization: local selectors and keyframes, semantic controls, focus parity, shorter production durations, Open Props-compatible easing fallbacks, and reduced-motion handling
- Asset policy: no upstream images, fonts, JavaScript, global utility classes, or bundled stylesheets imported

#### Duplicate review

The Hover.css selection excludes `Float Shadow`, `Grow Shadow`, and `Shadow`
because the existing Uiverse button and hover packages already cover raised
shadow feedback. `Push` was excluded because existing press controls already
combine displacement with depth feedback. `Sweep To Right` and `Bounce To
Right` were excluded because `wave-fill-hover` and `sliding-surface-hover`
already teach a directional surface fill. `Grow` was excluded because scaling
is already common across existing buttons; the smaller `Shrink` pattern adds a
different compact-state cue. Loader-like continuous effects such as `Bob`,
`Hang`, and `Buzz` were excluded because this phase favors event-driven motion.

## Adding another source

1. Add or complete its registry record while keeping it `planned`.
2. Verify the license at the proposed immutable revision and record the evidence.
3. Add a local license file only from verified upstream text.
4. Test the configured URL pattern and revision capture.
5. Change the source to `active` in the same reviewed change that completes its
   license and provenance record.
6. Import a separately scoped, curated batch whose catalog entries reference the
   stable source ID.

Core validator changes should not be necessary for a normal source addition.
