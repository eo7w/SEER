# Components

Each component module in `src/components/` exports functions that take state
and return HTML strings. They never touch the DOM directly.

| Module | Exports | Notes |
| --- | --- | --- |
| `shell.js` | `appHtml`, `isMobile`, `isNarrow`, `renderShell`, `onResize` | App skeleton, breakpoints, resize handling |
| `sidebar.js` | `sidebarHtml`, `groupConversations`, `navItem`, `renderSidebar` | Nav, recents, profile |
| `topbar.js` | `topbarHtml`, `renderTopbar` | Title rename, status chip, model/export menus, theme toggle |
| `chat.js` | `messageHtml`, `emptyHtml`, `chatViewHtml` | Message list, empty-state hero |
| `composer.js` | `composerHtml` | Attachments strip, autogrow textarea, mode chips, send/stop |
| `right-panel.js` | `rightHtml`, `projectIcon`, `renderRight` | Projects cards, AI tools grid, usage widget |
| `analytics.js` | `analyticsHtml`, `computeStats`, `areaChartSvg` | Stats grid + hand-rolled SVG area chart |
| `modals.js` | `modalShell`, settings/shortcuts/clear/templates modals, `renderModal`, `toggleRow` | One overlay, many bodies |
| `palette.js` | `paletteHtml`, `paletteCommands`, `renderPalette` | ⌘K launcher with groups |
| `toast.js` | `toast` | Floating feedback, auto-dismiss |

## Contracts

1. **Pure where possible.** Same arguments → same string.
2. **Escape everything user-authored.** Message content passes through
   `esc()` before embedding.
3. **Delegate, don't bind.** Interactive elements carry `data-act` /
   `data-inp` plus payload as `data-*` attributes.
4. **No layout CSS inline.** Classes reference tokens; nothing styles itself.
5. **Region renders live with their component.** `renderSidebar` lives in
   `sidebar.js`, so `core/actions.js` always re-renders exactly what changed.

## Adding a component

1. Create `src/components/thing.js` with pure render functions.
2. Import it where its region is dispatched (`core/dom.js` / `core/actions.js`).
3. Add `data-act` cases in `core/events.js` for its interactions.
4. Cover it in `tests/render.test.js` with DOM stubs.
