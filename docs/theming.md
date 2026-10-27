# Theming

Script supports two themes, six accents, and continuous font scaling — all
without stylesheet swaps.

## Mechanism

`core/theme.js` `applyTheme()`:

1. Reads `state.settings.theme` (`light` / `dark`) and toggles the theme
   attribute on the app root → tokens flip in `tokens.css`.
2. Looks up `state.settings.accent` in `data/accents.js` and writes the
   brand custom properties inline on `#app`.
3. Applies `state.settings.fontScale`.

## Token contract

Components consume semantic tokens only:

```css
.btn-primary { background: var(--brand); color: #fff; }
.card { background: var(--surface); box-shadow: var(--sh-1); }
```

Never hard-code a hex value — accents make any literal wrong five times
out of six, and dark mode makes it wrong every time.

## Dark mode rules

- Surfaces lighten toward the `--surface` family; text inverts via tokens.
- Shadows are heavier in dark mode (defined per theme in `tokens.css`).
- Charts read the same tokens — the analytics SVG uses `var(--brand)`
  strokes and `var(--line)` grid lines.

## Print

`src/styles/themes/print.css` strips panels, shadows, and backgrounds so
conversation exports print cleanly on white.

## Motion preference

`@media (prefers-reduced-motion)` is respected — theming includes motion.
