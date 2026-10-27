# Contributing to Script

Thanks for considering a contribution!

## Ground rules

1. **No runtime dependencies. No build step.** PRs adding a bundler,
   framework, or npm runtime dependency will be declined — this is the
   project's core identity.
2. **Match the architecture.** Logic goes in `src/core`, rendering in
   `src/components`, pure data in `src/data`. Components are
   `(state) → HTML string` functions with no DOM access.
3. **Tokens only.** Any color/spacing/radius/shadow must come from the CSS
   custom properties in `src/styles/tokens.css`.
4. **Locale parity.** If you add or change a UI string key, update all 11
   files in `locales/`. `npm run check:locales` fails otherwise.
5. **Tests stay green.** New behavior gets coverage in `tests/` using
   `node:test` only.

## Workflow

```bash
git clone https://github.com/eo7w/SEER.git
cd SEER
npm run verify     # lint + locales + tests — this is what CI runs
```

1. Fork / branch: `feat/my-feature` or `fix/my-bug`.
2. Make your change.
3. `npm run verify` passes locally.
4. Open a PR against `main` (template: `.github/PULL_REQUEST_TEMPLATE.md`).

## Style

- Vanilla JS, ES2020+. No TypeScript, no JSX.
- 2-space indent, LF endings, trailing newline (see `.editorconfig`).
- Prefer explicit `data-act` delegation over binding listeners.

## Reporting bugs

Open an issue with the bug template (`.github/ISSUE_TEMPLATE/bug_report.md`) —
browser, OS, steps, and console output. Security issues: see
[SECURITY.md](SECURITY.md), do not open a public issue.
