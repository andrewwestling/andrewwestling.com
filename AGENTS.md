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
