# Design System

Script's visual language is defined by CSS custom properties in
`src/styles/tokens.css`. Nothing else may hard-code a color, radius, or shadow.

## Color

Light theme (default) tokens: `--bg`, `--surface`, `--surface-2`,
`--text`, `--muted`, `--line`, `--brand`, `--brand-2`, `--sh-brand`, and a
family of derived soft fills and shadows. Dark theme mirrors the same token
set — every color in one theme has a counterpart in the other.

## Accents

`src/data/accents.js` ships six palettes. Each defines `from`, `to`, `solid`,
and `ring` values plus computed `soft`/`soft2` tints that `core/theme.js`
writes onto `#app` as custom properties — so an accent switch is O(1) with
no stylesheet swap.

## Typography

- Stack: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Scale: 12 / 13 / 14 / 16 / 18 / 24 / 30 px steps.
- Font scaling is applied to the root, driven by the settings slider, so the
  entire layout scales proportionally.

## Radius & elevation

Layered shadows per theme (`--sh-1`, `--sh-2`, `--sh-brand`) and a small
radius ramp applied per component scale.

## Spacing & layout

- 8pt base grid; sidebar with collapsed rail variant; right panel column.
- Breakpoints: ≤900px (mobile: drawer sidebar), ≤1180px (right panel hides).
- Touch targets ≥40px.

## Iconography

All UI icons are inline SVG paths in `src/core/icons.js` (stroke-based, 24px
viewbox) with standalone equivalents in `assets/icons/`. Inline wins for the
app (no extra requests); the files serve reuse elsewhere.
