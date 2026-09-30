# Backgrounds

Framework-neutral decorative surfaces including grids, dots, gradients, textures,
and hero backgrounds.

Backgrounds must not reduce content contrast or intercept interaction. Document
fallbacks for unsupported CSS features.

## Current collection

The directory contains 20 static Pattern Craft adaptations:

- `grids/`: five structural line and circuit patterns
- `dots/`: one combined grid and dot field
- `gradients/`: five ambient light and dark gradients
- `surfaces/`: five decorative section and hero surfaces
- `overlays/`: four masked utilities for bounded decoration

Every package includes `README.md`, `demo.html`, and `style.css`. Decorative
pseudo-elements ignore pointer input, text sits on a separate content surface,
and mask-based packages retain a solid-color fallback.
