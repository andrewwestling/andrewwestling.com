# Research: Music Library project-page story beats

**Ticket:** [AW-5](https://linear.app/mcwestling/issue/AW-5) (map [AW-1](https://linear.app/mcwestling/issue/AW-1))  
**Question:** What narrative beats, dates, and primary-source evidence should feed a Tidbyt-style project write-up about the Music Library?  
**Researched:** 2026-07-16  
**Scope:** Primary sources (this site repo git/PR history + code/docs) plus human-confirmed vault workflow (see § Vault).

---

## Verdict (for drafting AW-4 / AW-9)

Ship a Tidbyt-shaped page that leads with **personal performance archive**, then **Obsidian → generate-database → `/music`**, then **early Cursor-assisted build** (evidenced). Do **not** name Claude Sonnet / 3.5 on the public page unless another primary source confirms it — this repo does **not**.

---

## Vault (source of truth + authoring workflow)

Human-confirmed (AW-12): the standalone `~/Obsidian/Music Library` vault is **canonical**. Megavault holds a copy only. Authoring is Concert-first.

| Step | Workflow |
| ---- | -------- |
| 1 | Start from a **Concert** (or create its **Group** first if the Concert template selector needs an existing group) |
| 2 | Create the Concert shell from the template |
| 3 | Create any missing referenced entities before completing the note (Composer before Work) |
| 4 | Return to the Concert in the same session; populate Obsidian Properties and wiki-links |
| 5 | Add per-work soloists, conductors, or movements under `## Program Details` |
| 6 | Dataview reverse views in the vault and the public site both follow the same link graph |

**Public-safe walkthrough / screenshot target:** [February 23, 2025 Brooklyn Symphony Orchestra concert](/music/concerts/202502231400) — slug `202502231400` in `next-js/app/music/data/json/concerts.json` (Saint-Georges, Fauré, Sankey Carmen Fantasy with double-bass soloist, Bloch, Dvořák 7; venue Brooklyn Museum; conductor Nico Olarte-Hayes).

### Vault shape inferable from **public** site code (not vault note bodies)

From `next-js/app/music/scripts/generate-database.ts` (`generateDatabase`):

| Vault path | Object type |
| ---------- | ----------- |
| `Works/` | work |
| `Concerts/` | concert |
| `Composers/` | composer |
| `Conductors/` | conductor |
| `Groups/` | group |
| `Rehearsals/` | rehearsal |
| `Sheet Music/` | sheet-music |
| `Venues/` | venue |
| `Seasons/` | season |
| `Bucket List.md` (root) | bucket-list processing |

Authoring model (code-level): Markdown + gray-matter frontmatter; Obsidian wiki-links `[[...]]`; concert filenames carry `YYYYMMDDHHmm`; optional `slug:` frontmatter override; concert body may include `## Program Details`; works may include `## Movements`; DNP via `didNotPlay` frontmatter (filtered unless `--include-dnp`).

Local vault is gitignored: `next-js/.gitignore` → `/app/music/data/vault` (“Obsidian vault for music”).

**“Megavault” naming** appears in this repo only in `next-js/docs/slugifier-diacritics.md` (coordination notes for GVO 2026–27 / Pärt slugs), not in the founding PR.

---

## Pattern page (Tidbyt)

Mirror structure from `next-js/app/projects/tidbyt/page.mdx`:

- `posted` / `modified` exports + `PostedModified`
- Opening `<Message>` with short “what / why”
- `## Table of Contents`
- Explanatory sections, images, outbound GitHub links
- Live product link should be prominent (AW-1: top link into `/music`)

Projects list today points Music Library at the **live product**, not a write-up:

```24:26:next-js/app/projects/ProjectsList.tsx
          🎻 <a href="/music">Music Library</a>, my archive of all the concerts
          and works I&apos;ve ever performed
```

---

## Recommended narrative beats (with citations)

### 1. Lead: personal archive of a performing life

**Public framing already on the site:**

- Projects blurb (same wording since #54): “my archive of all the concerts and works I've ever performed” — `ProjectsList.tsx` / homepage Projects list.
- `/music` metadata/description: “Andrew's archive of concerts and works performed”; tagline italic: “Probably every concert and work I've ever performed” — `next-js/app/music/page.tsx`.
- Homepage Music section: violin hobby, BSO + GVO, links to anti-performances Instagram + music library — `next-js/app/page.mdx`.

**Write-up implication:** Open with archive / career-of-performances, not with tooling. Multi-prong “why” (see the archive + turn it into queryable data) is supported by product surface (indexes, filters, concert counts, upcoming calendar) more than by a single manifesto sentence in git.

### 2. Origin name: anti-performances → Music Library

**Date:** 2025-01-26 (America/New_York)  
**Commit / PR:** `def96ae9d5bafeb793051dda4384ba018dc9bb2e` — **Add "Music Library" (#54)**

PR body beats:

1. Started as a **base clone of the next-js app for “anti-performances”**.
2. Built Obsidian parse script + routes (composers, concerts, conductors, groups, works…).
3. Folded “anti-performances” content **into** andrewwestling.com so it could ship on a deployment (“Maybe it'll stay here”).
4. Mid-stack **rename to Music Library**: “Feels better actually because it has more than just archived content…”

Also: Instagram brand **anti-performances** remains separate (homepage / ProjectsList).

### 3. Pipeline: Obsidian notes → `generate-music-db` → JSON → Next routes

| Piece | Evidence |
| ----- | -------- |
| Script | `next-js/app/music/scripts/generate-database.ts` (requires `<vault-path>` argument) |
| npm script | `generate-music-db` in `next-js/package.json` — run as `npm run generate-music-db -- <vault-path>` |
| Output | Originally monolithic `vault-data.json` in #54; split per entity in **#65** (`e8b3a5f`, 2025-03-06) → `next-js/app/music/data/json/*.json` |
| Queries | `next-js/app/music/data/queries/*` + `database.ts` |
| Routes | `/music`, `/music/upcoming`, concerts/works/composers/…, bucket-list, ICS |

**Privacy / publication filter (founding PR):** omit concert markdown `content` until scrubbed; omit DNP concerts by default (`--include-dnp`).

### 4. Cursor as pivotal co-author (evidenced); model name unknown

**Strongest primary quotes — all in #54 (`def96ae`) commit message / squashed PR body:**

| Claim | Quote (PR #54) |
| ----- | ---------------- |
| Cursor used to scaffold | “I used Cursor to basically clone my next-js app structure” |
| Cursor for types from vault Templates | “told Cursor to look at the Templates for this and create something that matches” |
| Cursor workflow / vault path | “Moving vault back to ~ and using a symlink in repo for Cursor stuff” |
| Cost aside on Spotify embed | “$0.22 with Cursor; compared to the Maps feature, this was a lot more expensive per line of code” |
| Other agent tried | “Testing Cline for this one, let's see if it worked” (Stadia Maps → abandoned for OpenStreetMap) |

**Repo-wide Cursor timeline:**

- **First** commit message mentioning “Cursor” in this repository: **#54 / `def96ae` (2025-01-26)**.
- No earlier `--grep=Cursor` hits before that date.
- Follow-up: **#59 / `da25aa6` (2025-02-09)** — “Ope, Cursor knocked this out in the refactor” (badge styles).
- **#65 / `e8b3a5f` (2025-03-06)** — PR body includes full Cursor-style **prompts** for the JSON split refactor.

**Claude Sonnet / “3.5”:**

| Check | Result |
| ----- | ------ |
| `git log` for Sonnet / “3.5 Sonnet” / “Claude 3” | **No matches** in this repo’s history |
| First `Co-Authored-By: Claude…` on Music-adjacent work | ~2026-02 (`40491aa` Railway, Opus 4.6; later Opus 4.7 on #141) — **~13 months after** Music Library founding |
| Founding tool named in #54 | **Cursor** (and a Cline experiment), not a Claude model string |

**Conclusion for AW-1 “first time using Sonnet/3.5” locked narrative:** **Not evidenced in this site repo.** Safe public phrasing from primary sources: *first time Cursor shows up in this repo’s history is the Music Library build; heavy Cursor co-authorship in #54/#59/#65*. Treat Sonnet/3.5 as **unknown here** pending vault chat export or other first-party source.

Later AI color (optional epilogue, not founding story):

- **#141 / `decf41b` (2026-05-05)** — Co-authored-by Claude Opus 4.7; diacritic slugifier + GVO season (see `next-js/docs/slugifier-diacritics.md`).
- **`6e7b7b6` (2026-05-06)** — “Fun fact, Claude Cowork made these playlists…”

### 5. Product evolution beats (post-ship)

Use sparingly on the write-up; good for TOC subsections or a short timeline.

| Date | SHA | PR | Beat |
| ---- | --- | -- | ---- |
| 2025-01-26 | `def96ae` | #54 | Ship: vault→JSON, entity pages, filters, upcoming, ICS, bucket list, venues/maps, Spotify embeds, rename |
| 2025-02-01 | `2b5719b` | #55 | Filters bugs |
| 2025-02-09 | `da25aa6`–`7085164` | #59–#60 | Upcoming badges; Cursor side-effect note |
| 2025-02-22 | `5ccc681` | #61 | Program Details (movements / soloists / conductors per work on a concert) |
| 2025-03-06 | `e8b3a5f` | #65 | Split JSON DB; prompt-documented refactor |
| 2025-06-16 | `30baf9e` | #80 | Homepage / Upcoming layout fixes |
| 2025-10-19 | `b781c4b` | #88 | Composer/work accent linkage (“Paganini”) |
| 2026-02–03 | various | #102–#126 | Today badge, calendar URL, deploy/analytics churn touching `/music` |
| 2026-05-05 | `decf41b` | #141 | GVO 2026–27 + NFD slugify (Megavault coordination doc) |

### 6. Day-to-day use of `/music` (for “how I use it” section)

Supported by code/UI, not vault:

- **Upcoming** + ICS subscribe (`upcoming.ics`, calendar helpers)
- **Bucket List**
- Faceted **Concerts** filters (season / group / conductor / venue / composer)
- Entity indexes sorted by **concertCount**
- Concert pages: venue map, AttendActions (tickets / calendar / later live stream), optional Spotify

---

## Suggested write-up TOC (evidence-backed)

Aligned with Tidbyt’s explanatory arc; titles provisional for AW-3 grilling:

1. **What it is** — personal Music Library / archive (cite `/music` tagline + ProjectsList)
2. **Why** — see a performing history; make it data (concert counts, filters, upcoming)
3. **Where the data lives** — standalone `~/Obsidian/Music Library` vault (canonical); Megavault copy; Concert-first authoring workflow
4. **How it becomes the site** — `generate-database.ts <vault-path>` / `npm run generate-music-db -- <vault-path>` → JSON → routes
5. **Building it with Cursor** — #54 quotes; first Cursor mention in this repo; cost/Cline asides optional color
6. **Growing the product** — Program Details (#61), JSON split (#65), seasons/upcoming polish
7. **Links** — live `/music`; GitHub paths for script + app (`next-js/app/music/…`); anti-performances Instagram if desired

**Omit until sourced:** Claude Sonnet / 3.5 model claim; vault changelog anecdotes; private note quotes.

---

## Starter assets called out by AW-1 (availability)

| Asset | Status in this research |
| ----- | ----------------------- |
| Obsidian note (completed) | Use **202502231400** BSO concert as public-safe example; generated JSON in repo |
| Cursor chat | Not in repo; only PR-embedded prompts (#54 Filters prompt, #65 refactor prompts) |
| `/music` browse | Live product in tree |
| Script GitHub links | `next-js/app/music/scripts/generate-database.ts` |

---

## Source index

| ID | Source |
| -- | ------ |
| S1 | `def96ae` / PR **#54** — Add "Music Library" (2025-01-26) |
| S2 | `da25aa6` / PR **#59** — Cursor badge regression note |
| S3 | `e8b3a5f` / PR **#65** — JSON split + prompts |
| S4 | `5ccc681` / PR **#61** — Program Details |
| S5 | `next-js/app/music/scripts/generate-database.ts` — vault dirs + pipeline |
| S6 | `next-js/docs/slugifier-diacritics.md` — Megavault naming + diacritics |
| S7 | `next-js/app/projects/tidbyt/page.mdx` — write-up pattern |
| S8 | `next-js/app/projects/ProjectsList.tsx`, `next-js/app/page.mdx`, `next-js/app/music/page.tsx` — public archive wording |
| S9 | `next-js/.gitignore` — vault path ignored |
| S10 | AW-12 human-confirmed workflow + `concerts.json` slug `202502231400` — public-safe authoring example |
