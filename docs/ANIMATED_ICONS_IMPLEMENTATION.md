# Animated Icons Status

This document is intentionally short because the animated biology icon system is not present in the current code.

## Current Implementation

- There is no `js/bio-icons.js` file.
- `index.html` does not render a `.bio-background-icons` container.
- `css/animations.css` currently contains entrance/reveal animation rules, mobile menu animation, the hero trial pulse, and reduced-motion handling.
- Ambient decoration is handled by inline SVG `.bg-orb` elements in `index.html` plus base background styles in `css/main.css`.

## Source Of Truth

Use the current HTML/CSS/JS as the source of truth. Do not recreate the removed emoji icon system from this document unless the site design is intentionally changed again.
