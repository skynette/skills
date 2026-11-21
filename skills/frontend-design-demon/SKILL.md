---
name: frontend-design-demon
description: Runs the user's page-design process from references to code, stage by stage, stopping at each checkpoint for them. The stages are references (theirs, or sourced after a taste interview), PRD by GPT, a first design on a Pencil or Figma canvas, revisions until approved, then code. Use when the user runs /frontend-design-demon, says "design demon", or wants to design a web page or section from references through to code.
---

# frontend-design-demon

The user's process for designing a page: **references → PRD → canvas → design → iterate → code.** Claude does the
legwork. The user keeps the steps that need their taste: picking references, approving the PRD, giving design
feedback, and approving the design. You never move past a checkpoint without their explicit go-ahead in this session.

## 1. Find the page

- **Root:** if the current directory is inside a project (a `.git`, `package.json` or similar above it), use that
  project's root. Otherwise use the current directory.
- Pages live in `<root>/design/<page-slug>/`.
  - **No `design/*/` folders:** this is a new page. Go to stage 0.
  - **One folder:** ask "Continue `<slug>`, or start a new page?"
  - **More than one:** list them with their stage (from each `STATUS.md`) and ask which. Never guess.
  - If the user's message names the page or says "new", follow that.

## 2. Read the stage

Read `<page>/STATUS.md`:

```
stage: brief | references | prd | canvas | design | iterate | code | done
waiting_on: user | claude
next: <one line>
canvas: claude-design | pencil | figma | none
canvas_file: <path or url>
stack: <none until stage 6>
```

**If `STATUS.md` is missing, or doesn't match the files,** infer the stage from what exists:

| Latest file present | Stage |
|---|---|
| none | brief |
| `brief.md` only | references (ask "Got references?") |
| `taste.md` but no `refs/candidates.json` | references (sourcing; don't re-interview) |
| `refs/shortlist.html` but no `picks.md` | references (ask for the picks; don't re-ask "Got references?") |
| `picks.md` | prd |
| `prd.md` | canvas |
| `design-notes.md` with `## Directions` but no `## Direction picked` | design (ask which direction) |
| `design-notes.md` with no `## Round` block | design (first design not drawn yet) |
| `design-notes.md` with a `## Round` block but no `## Approved` | iterate |
| `design-notes.md` with `## Approved` | code |

Say what you inferred (label it "inferred") and ask before continuing. Write `STATUS.md` only after the user
confirms. An inferred stage never counts as an approval: if the inference skips a checkpoint (for example, `prd.md`
exists but was never approved), ask that checkpoint's question first. Update `STATUS.md` at every stop.

## 3. Stages

| # | Stage | You do | Load | Stop for the user |
|---|---|---|---|---|
| 0 | brief | Ask for whatever is missing: what the page is, product or brand, the vibe in their words, and the audience. Write `brief.md` (3–6 lines). Make the slug from the page name. | n/a | Only if something is missing |
| 1 | references | Ask "Got references?", then take the user's references or run the taste interview, then source | `references/sources.md` | **They confirm the picks** |
| 2 | prd | GPT writes `prd.md` through Codex (or you write it as the fallback) | `references/prd-prompt.md` | **They approve the PRD** |
| 3 | canvas | Ask Claude Design (default), Pencil or Figma, then set up the References board | `references/design-stage.md` | Only if Pencil has no document open, or a design-system choice is needed |
| 4 | design | If the user had no references: three directions first. Then the first design: desktop 1440 and mobile 390 frames, real copy, self-critiqued | `references/design-stage.md` | **They pick a direction** (no-reference pages only), then **they give feedback** |
| 5 | iterate | Apply a round, log it, screenshot, repeat | `references/design-stage.md` | **They approve** |
| 6 | code | Ask for the stack, build, run the checker | `references/code-stage.md` | **Final review** |

Read the reference file for a stage before you do that stage, every time.

## 4. Checkpoint messages

Every stop is a short message with three parts:

1. **Done:** what you did, in 1–3 lines.
2. **Look:** the exact file path or canvas frame to check.
3. **Need:** the one thing you need from the user, as a question.

Then stop and wait. "Looks fine to me" from you is never approval; only the user's word is.

## 5. Approval rules

- **The design is approved** only when the user says so *and* both a desktop (1440) and a mobile (390) frame exist for
  every PRD section. If they approve while the mobile frames are missing, say so, build them, and show them first.
- **No code** before `## Approved` is written in `design-notes.md`.
- **The approved design wins** over the house rules of `design-taste-frontend` at code stage. List each rule you bent.

## 6. Jumps

The user can redirect at any time. Rewrite `STATUS.md` and go:

- "skip refs, here are mine": take their references (stage 1, path 2a), then go to the PRD.
- "I have a PRD" or a pasted `.md`: save it as `prd.md` with `<!-- prd-source: user -->` and go to stage 3. If there
  is no `picks.md`, ask once whether they have references for the board; if not, skip the References board.
- "back to design" or "change X": go to stage 5 with that as the feedback.
- "just code it": only allowed if the design is approved; otherwise say what's missing.

## 7. Page folder

```
design/<slug>/
  STATUS.md        current stage, the only thing that decides what's next
  brief.md         the ask
  taste.md         taste interview (only if the user had no references)
  refs/            u01… (user's refs), r01… (sourced candidates), candidates.json, skipped.json, shortlist.html
  picks.md         chosen references and what to take from each
  prd.md           PRD, first line <!-- prd-source: gpt | claude (…) | user -->
  design-notes.md  canvas file or url, References board, Round N logs, Approved block
  canvas/          Claude Design only: the canvas's files (project/canvas.json, project/*.dc.html), kept here so a new session can edit them
```

## What it needs (and what happens without it)

Check once at the start of a page and say in one line what's missing. Never block on an optional piece.

| Piece | Used for | Without it |
|---|---|---|
| Artifact tool with the Design type (Claude Code signed in to claude.ai) | Claude Design canvas (default) | Offer Pencil as the default instead |
| Pencil app + its MCP | Pencil canvas | Not offered |
| Figma MCP | Figma canvas | Not offered |
| Codex CLI (`codex`), signed in | GPT writes the PRD | Claude writes it (prd-prompt.md fallback) |
| Claude in Chrome, or Playwright MCP | Sourcing references, screenshotting links | Ask the user for screenshots instead |
| Node 18+ | The shortlist page | List the candidates in chat with their files |
| Skills `design-taste-frontend`, `frontend-design`, `emil-design-eng`, `gsap-core` | Taste rules, polish, motion | Apply the same intent from your own judgement, and mention `npx skills add` for the missing ones once |
| Skill `ui-ux-pro-max` | Palette, font pairing and UX rules before drawing | Choose them from the picks yourself |
| Skill `oil-ui` | Three directions when the user has no references | Draw three directions yourself, same rules |
| Skill `impeccable` | Critique before each round; audit and polish at code | Self-review against the brief and the taste rules |
| Emil's `review-animations`, `animation-vocabulary`, `choreograph`, `break-ui`, `pick-ui-library`, `learn-taste` | Motion review, naming motion, group motion, worst-case data, library choice, saving the user's corrections as rules | Do the same checks by hand, or skip `learn-taste` |

**When the skills disagree**, the order is:
1. The user's brief and picks.
2. The approved design.
3. `design-taste-frontend` house rules.
4. Suggestions from `impeccable`, `oil-ui` and `ui-ux-pro-max`.

Say in one line which rule lost when it matters.

## Running in Codex

The same skill works in Codex (invoke it as `$frontend-design-demon`). Codex has no Claude-only tools, so:

- **Stage 2 (PRD):** you are already GPT. Write `prd.md` yourself from the prompt template in
  `references/prd-prompt.md`, run its heading check, and use the first line `<!-- prd-source: gpt (codex session) -->`.
  Don't shell out to `codex exec`.
- **Stage 3 (canvas):** Claude Design isn't available. Ask "Pencil (default) or Figma?" and skip every Claude Design
  step. The Pencil tools are the same, minus the `mcp__pencil__` prefix.
- **Browser work:** wherever a step says Claude in Chrome, use the Playwright or browser-use MCP. Mobbin and Pinterest
  need a signed-in browser, so put them in `skipped.json` if neither is signed in.
- **Checkpoints and approvals** work exactly as above: stop and wait for the user's words.

## Never

- Make the final reference picks for the user.
- Ask GPT for visuals, or accept mockups from it. The PRD is Markdown only.
- Draw before loading `design-taste-frontend` and `frontend-design` when they're installed.
- Skip a checkpoint, or batch two stages past one stop.
