# Issue tracker: Linear

Issues and PRDs for this repo live in **Linear**, not GitHub Issues.

| Field | Value |
| ----- | ----- |
| Workspace | `mcwestling` |
| Team | **Andrew Westling** |
| Issue prefix | `AW-` |
| Team ID | `b7af4928-1227-4e25-a437-922bce720659` |

Use the **Linear MCP** tools for all issue operations. Do not use `gh issue` for this repo's agent workflows.

## Conventions

- **Create an issue**: `save_issue` with `team: "Andrew Westling"`, `title`, and markdown `description`. Apply triage labels via the `labels` array (e.g. `["ready-for-agent"]`).
- **Read an issue**: `get_issue` with the identifier (e.g. `AW-12`) or ID. Use `list_comments` with `issueId` for discussion.
- **List issues**: `list_issues` with `team: "Andrew Westling"` and filters (`label`, `state`, `assignee`, etc.).
- **Comment on an issue**: `save_comment` with `issueId` and markdown `body`.
- **Apply / replace labels**: `save_issue` with `id` set to the issue identifier and a full `labels` array (this replaces the label set — include every label that should remain).
- **Close / change state**: `save_issue` with `id` and `state` (e.g. `Done`, `Canceled`, or the workflow state name).
- **Assign**: `save_issue` with `assignee: "me"` (or a user name/email).

Prefer issue identifiers (`AW-n`) in skill output and cross-links.

## Pull requests as a triage surface

**PRs as a request surface: no.** GitHub PRs for this repo are code review, not the triage queue. Work items live in Linear.

## When a skill says "publish to the issue tracker"

Create a Linear issue on team **Andrew Westling** via `save_issue`.

## When a skill says "fetch the relevant ticket"

Run `get_issue` for `AW-<n>` (or the given identifier), plus `list_comments` when discussion context matters.

## Blocking edges and parent/child

Linear supports native relations via `save_issue`:

- **`blockedBy`**: issue IDs/identifiers that block this issue (append-only).
- **`blocks`**: issue IDs/identifiers this issue blocks (append-only).
- **`parentId`**: parent issue ID/identifier for sub-issues (use for wayfinder map → child tickets).

When publishing tickets with `/to-tickets`, create blockers first, then set `blockedBy` on dependents. Prefer native `blockedBy` / `blocks` over prose "Blocked by" lines.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single Linear issue with **child** issues as tickets.

- **Map**: create an issue labelled `wayfinder:map`, body holding Notes / Decisions-so-far / Fog. `save_issue` with `labels: ["wayfinder:map"]`.
- **Child ticket**: create with `parentId` set to the map issue, plus a type label `wayfinder:research` / `wayfinder:prototype` / `wayfinder:grilling` / `wayfinder:task`. Once claimed, assign to the driving session (`assignee: "me"`).
- **Blocking**: use Linear's native `blockedBy` / `blocks` on `save_issue`. A ticket is unblocked when every blocker is in a completed state.
- **Frontier query**: `list_issues` for open children of the map (`parentId` of the map), drop any with open blockers or an assignee; first in map order wins.
- **Claim**: `save_issue` with `assignee: "me"` — the session's first write.
- **Resolve**: `save_comment` with the answer, then `save_issue` with `state: "Done"`, then append a context pointer (gist + link) to the map's Decisions-so-far.
