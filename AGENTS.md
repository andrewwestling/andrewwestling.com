# Agent instructions

Project guidance for Cursor cloud agents and other coding agents working in this repo.

## Agent skills

Matt Pocock engineering + productivity skills are vendored under `.agents/skills/` (from [mattpocock/skills](https://github.com/mattpocock/skills)). Invoke them with `/skill-name` (e.g. `/grill-me`, `/to-tickets`, `/wayfinder`).

### Issue tracker

Linear team **Andrew Westling** in workspace `mcwestling` (issue prefix `AW-`). Use Linear MCP — not GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Default roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Useful entry points

| Goal | Skill |
| ---- | ----- |
| Not sure which flow to use | `/ask-matt` |
| Align before building | `/grill-me` or `/grill-with-docs` |
| Turn discussion into a Linear spec | `/to-spec` |
| Break a plan into Linear tickets | `/to-tickets` |
| Implement from a spec/tickets | `/implement` |
| Large multi-session planning | `/wayfinder` |
| Test-first feature/fix | `/tdd` |
| Hard bug diagnosis | `/diagnosing-bugs` |

## Cursor Cloud specific instructions

This repo is a small multi-package layout for the static site `andrewwestling.com`:

- `next-js/` — the main product (Next.js 15 + TypeScript + MDX + Tailwind). This is what you run and test.
- `tailwind/` — shared Tailwind config, consumed by `next-js` as a local `file:../tailwind` dependency. It must have its deps installed before/alongside `next-js`, otherwise `next-js` installs/builds can't resolve `@andrewwestling/tailwind-config`. `next-js`'s `prebuild` script also runs `npm install` in `tailwind` automatically.
- `resume/` — a standalone JSON Resume → HTML/PDF generator (uses Puppeteer/Chromium). Not part of the website runtime; only touch it when working on the resume artifact.

Running / testing the site (all commands run inside `next-js/`, see `next-js/README.md` and its `package.json` scripts):

- Dev server: `npm run dev` → http://localhost:3000 (no build step needed; MDX content is static, no DB/external services required).
- Lint: `npm run lint` (`next lint` prints a deprecation notice — that is expected noise, not a failure).
- Build: `npm run build` (statically prerenders ~59 pages).

Non-obvious notes:

- No env vars are required to run locally. PostHog analytics (`NEXT_PUBLIC_POSTHOG_KEY`) is optional and only initializes in production; the app runs fine without it.
- Ignore `scripts/conductor-setup.sh` / `vercel env pull` for local setup — they require Vercel auth and are not needed to run or test the site.
- Venue pages render an interactive Leaflet/OpenStreetMap map and concert pages embed Spotify; both need outbound network access to display fully.
