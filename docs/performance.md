# Performance

Script's performance budget: first render under 100ms on a mid-range laptop,
60fps during streaming, zero third-party bytes.

## Techniques used

**1. Region rendering, not diffing.**
Only the changed region re-renders. Typing in the composer does not
re-render the message list.

**2. Streaming bypasses rendering.**
During token streaming, the bubble's text node is updated directly — no
string building, no `innerHTML`, no layout thrash. A full re-render happens
once at completion.

**3. Delegated events, attached once.**
A handful of listeners on `document` handle everything. Re-renders cannot
leak listeners, and there is no listener-per-button cost.

**4. Pure strings.**
Components produce strings; assigning `innerHTML` once per region is far
cheaper than N node operations.

**5. Zero dependencies.**
The entire script payload is a few tens of KB uncompressed. No framework
runtime, no hydration, no polyfills.

**6. Compositor-only animation.**
Keyframes animate `transform` and `opacity` exclusively (see
[animations.md](animations.md)).

**7. Storage writes are event-driven, not interval-driven.**
`localStorage` is written on mutation, and only for the affected key.

## Numbers (guideline, not gospel)

| Metric | Target |
| --- | --- |
| First contentful paint (local, warm) | < 100 ms |
| Streaming frame rate | 60 fps sustained |
| Re-render cost per region | < 8 ms |
| Third-party requests | 0 |
