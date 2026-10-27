# Data Flow

Script is a one-way data flow app without the framework: **event → action →
state → region render**.

## Conversation lifecycle

```
createConv()
  ├─ uid() id, title, createdAt
  ├─ unshift into state.conversations
  ├─ saveConvs() → localStorage["nova-chat-convs-v1"]
  └─ renderSidebar + renderMain (empty state)

actSend(text, attachments)
  ├─ push user message  → renderMain(preserveScroll)
  ├─ streaming: pickResponse() → chunkText() → timers
  ├─ each tick: updateStreamBubble() — direct DOM text update,
  │   NOT a full re-render (streaming stays 60fps)
  └─ finishStream(): commit message, save, renderMain

delete / clear
  ├─ mutate state, save
  └─ renderAll()
```

## Persistence

`core/storage.js` (`loadJSON` / `saveJSON`) wraps `localStorage` with
namespaced keys and try/catch guards (private-mode safe). Keys:

| Key | Contents |
| --- | --- |
| `nova-chat-convs-v1` | All conversations and messages |
| `nova-chat-settings-v1` | User settings (theme, accent, model, …) |
| `nova-chat-seeded-v1` | Whether demo conversations were seeded |

A one-time seed (`data/seed.js`) creates starter conversations on first run,
then marks itself.

## Settings flow

All settings changes follow: mutate `state.settings` → `saveSettings()` →
targeted render. Some (zoom, accent) apply directly via `theme.js` without
any re-render at all.
