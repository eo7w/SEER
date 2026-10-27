# Architecture

This document describes how Script is organized, how data flows, and why.

## Topology

The app is a native ES Module graph with a single entry point:

```
index.html
  ├─ <link> src/styles/index.css   (17 CSS files via @import)
  └─ <script type="module"> src/main.js
       └─ src/app.js        # boot(): state load → render → listeners
            ├─ core/*       (12 modules: primitives, no rendering)
            ├─ components/* (10 modules: state → HTML strings)
            └─ data/*       (9 modules: pure data)
```

**Dependency direction is strictly downward:** `components` may import `core`
and `data`; `core` never imports `components` (the one exception — the `dom`
and event/action modules — is deliberate and cycle-safe: all cross-calls
happen at event time, never at module-evaluation time).

## Render pipeline

1. An event fires (`click`, `input`, `keydown`).
2. `core/events.js` delegates to the nearest `[data-act]` / `[data-inp]`
   ancestor and dispatches to an action.
3. The action mutates `core/state.js` state (and persists via `storage.js`).
4. The action calls a region render — `renderSidebar()`, `renderTopbar()`,
   `renderMain()`, `renderRight()`, `renderAll()` — or a component render.
5. Region renders call component functions that produce HTML strings and
   assign them to stable region elements.

Because region elements are stable, delegated listeners survive every render.
`renderMain()` accepts a `preserveScroll` flag to keep chat scroll position
across re-renders during streaming.

## State

`core/state.js` owns two mutable trees:

- `state` — conversations, active id, settings.
- `ui` — interface flags: view, menus, streaming, drafts, palette, modal.

`data/settings.js` defines the persisted defaults; `storage.js` namespaces
everything under `nova-chat-*-v1` keys.

## Event delegation contract

- `data-act="name"` → dispatched by `onClick` in `events.js`.
- `data-inp="name"` → dispatched by `onInput`.
- Data travels via `data-*` attributes (`data-id`, `data-model`, …).
  No inline `onclick` handlers anywhere in the codebase.

## Why no framework?

The UI is small enough that (state → string) components plus delegated events
outperform any diffing layer, keep the payload tiny, and make the module graph
inspectable. ES Modules give us code splitting, scoping, and a clean tree
for free.
