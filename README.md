# Script — AI Chat Workspace

<p align="center">
  <img src="assets/icons/favicon.svg" width="72" alt="Script logo">
</p>

A production-grade AI chat workspace front end: multi-conversation chat,
streaming responses, analytics dashboard, command palette, projects panel,
settings, and a full design system — built as **zero-dependency native
ES Modules** with **no build step**.

> Clone it, serve it, ship it. `index.html` is the whole app.

---

## ✨ Features

- 💬 **Multi-conversation chat** — create, rename, delete, pin; responses stream in with a live caret.
- 📊 **Analytics view** — stats grid and a hand-rolled SVG area chart of usage.
- 🎨 **Design system** — dark/light themes, 6 accent palettes, continuous font scaling, full token layer (17 CSS files).
- 🌍 **11 locales** — EN, AR (RTL), FR, ES, DE, TR, PT, IT, RU, ZH, HI — key-parity enforced in CI.
- ⌨️ **Command palette** (⌘K / Ctrl+K) and a full keyboard shortcut layer.
- 🗂️ **Projects & AI tools panel**, template gallery, suggestions engine.
- 🧩 **Component architecture** — 32 ES modules across `core`, `components`, `data`.
- 🧪 **8 test suites** on Node's built-in runner — `npm test`, no install needed.
- 🚀 **CI + GitHub Pages** workflows included (`.github/workflows/`).

## 🚀 Quick start

```bash
git clone https://github.com/eo7w/SEER.git
cd SEER
npm run dev     # zero-dep static server → http://localhost:8080
```

No `npm install` — there are no dependencies. To run the checks:

```bash
npm run verify          # lint + locale parity + tests (what CI runs)
npm test                # tests only
npm run dev             # local server
```

Opening `index.html` directly works too, but a module server is the
recommended path for full fidelity.

## 📁 Project layout

```
├── index.html              # single entry, ESM + CSS links
├── src/
│   ├── main.js             # entry module → app.js boot()
│   ├── app.js              # boot: state → render → listeners
│   ├── core/               # 12 modules: utils, state, storage, markdown,
│   │                       # highlight, theme, engine, dom, icons, events…
│   ├── components/         # 10 modules: shell, sidebar, topbar, chat,
│   │                       # composer, right-panel, analytics, modals,
│   │                       # palette, toast
│   ├── data/               # 9 modules: models, accents, suggestions,
│   │                       # shortcuts, charts, settings, tools, seed…
│   └── styles/             # 17 CSS files: tokens → utilities → regions
├── locales/                # 11 JSON locale files (key-parity checked)
├── assets/icons/           # 60 standalone SVG icons
├── tests/                  # 8 suites (node:test)
├── scripts/                # zero-dep dev tooling: dev-server, lint, locales
├── docs/                   # 10 deep-dive documents
└── .github/                # CI, Pages, templates, dependabot
```

## 🧠 Architecture in one paragraph

`main.js` imports and calls `boot()` from `app.js`. Events are delegated from
`document` through `data-act` / `data-inp` attributes (`core/events.js`) into
actions (`core/actions.js`) that mutate state (`core/state.js`), persist it
(`core/storage.js`), and re-render only the affected region — sidebar, topbar,
main, right panel, or modal. Components are pure `(state) → HTML string`
functions. There is no framework, no virtual DOM, no diffing: strings in,
region assignment out, delegated listeners survive every render.

Deep dives: [docs/architecture.md](docs/architecture.md) ·
[design system](docs/design-system.md) · [data flow](docs/data-flow.md) ·
[performance](docs/performance.md).

## 🌐 Internationalization

All 11 locale files must keep identical key sets with `locales/en.json`.
`npm run check:locales` enforces parity locally and in CI. Arabic ships as
a first-class RTL locale: the flex-based three-panel shell mirrors via
`dir="rtl"` with no per-component work.

## 🧪 Testing

```bash
npm test
```

8 suites cover utilities, markdown rendering, syntax highlighting, the
response engine, storage, data integrity, component rendering (with DOM
stubs), and locale parity — using only `node:test` and `node:assert/strict`.

## 🤝 Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm run verify`
before committing; CI runs it on every push.

## 📄 License

MIT — see [LICENSE](LICENSE). Copyright © 2026 eo7w.
