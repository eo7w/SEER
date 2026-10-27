# Roadmap

## v1.1 — Polish & reach

- [ ] Full UI string extraction into the locale system (scaffold → complete coverage)
- [ ] Message search across conversations
- [ ] Conversation folders / project assignment
- [ ] Keyboard shortcut for every top action (audit + docs)

## v1.2 — Capability

- [ ] Export conversations as PDF (print-pipeline based, zero-dep)
- [ ] Message-level custom instructions inheritance
- [ ] Attachments preview modal
- [ ] Voice input via Web Speech API (progressive enhancement)

## v1.3 — Intelligence

- [ ] Response engine 2.0: richer context carry, better intent scoring
- [ ] Conversation summarization ("title this chat")
- [ ] Prompt variable templates in the template gallery

## v2.0 — Real backend (optional path)

- [ ] Adapter layer for a live LLM provider — the engine interface is
      already a pure function, so a network-backed implementation is a
      drop-in module
- [ ] Sync layer for cross-device conversations
- [ ] Optional auth module (passkey-first)

## Non-goals

- A build step. A framework. A runtime dependency. These are permanent
  constraints, not TODOs.
