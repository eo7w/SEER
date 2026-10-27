# Animations

All motion lives in `src/styles/animations.css` as keyframes applied through
utility classes. No JS animation libraries.

## Principles

1. **Enter, don't exit.** Removal is instant; entrance carries the motion.
   Users read exit animation as lag.
2. **200–360ms is the budget.** Nothing exceeds 400ms except ambient loops.
3. **Transforms + opacity only.** No layout-triggering properties, so all
   animation is compositor-friendly at 60fps.
4. **Staggered lists.** Message stacks fade up with a tiny index-based
   `animation-delay` for a cascade feel.
5. **Reduced motion respected.** A single media query gates every keyframe.

## Interaction micro-motion

- Buttons: lift on hover, scale-down on press.
- Nav items: background fade to the brand soft fill on hover.
- Cards: shadow step-up on hover (no scale — hover-scale in dashboards feels
  unstable).
- Theme switch: short global `transition` on colors.

See `animations.css` for the authoritative keyframe catalog.
