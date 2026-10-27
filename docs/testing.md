# Testing

The suite runs on Node's built-in test runner — zero external dependencies,
matching the project philosophy.

```bash
npm test           # node --test tests/
npm run verify     # lint + locales + tests (what CI runs)
```

## Suites

| File | Covers |
| --- | --- |
| `utils.test.js` | `esc`, `uid`, `clamp`, `hashString`, `estimateTokens` |
| `markdown.test.js` | Blocks, code fences, headings, lists, escaping |
| `highlight.test.js` | Keyword spans, language fallback, code block shell |
| `engine.test.js` | Intent matching, determinism, Arabic prompts, chunking |
| `storage.test.js` | Namespacing, JSON round-trip, corrupt-data guards |
| `data.test.js` | Model/accent/suggestion/icon/seed/response integrity |
| `render.test.js` | Component output with `document`/`window` stubs |
| `locales.test.js` | 11 locale files parse and match key parity |

## Conventions

- `node:test` `test()` + `assert` from `node:assert/strict` only.
- Each suite sets up its own state; no cross-suite fixtures.
- DOM-dependent renders use minimal stubs, keeping the suite fast and
  CI-cheap.

## Adding a test

1. Copy the closest existing suite as a template.
2. Cover behavior, not implementation: call the public export, assert the
   observable output.
3. Run `npm run verify` before committing.
