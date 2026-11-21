# Stage 2: PRD

GPT writes the PRD (through the Codex CLI) from the brief, the taste notes and the picks. It is Markdown only, with
no designs. The user approves it before anything is drawn.

## 1. Build the prompt

Write `<page>/.prd-prompt.txt` from the template below, filling `{…}` from `brief.md`, `taste.md` (if it exists) and
`picks.md`.

```text
You are a senior product designer writing a PRD for ONE web page. Write Markdown only.
No mockups, no images, no ASCII layouts, no code. Describe; don't draw.

The page: {brief.md, verbatim}
Taste notes from the client: {taste.md verbatim, or "none"}
References the client picked (images attached in the same order), and what to take from each:
{picks.md, verbatim}

Use exactly these sections, as level-2 headings, in this order:
## Goal
## Audience
## Sections
(one ### per section, top to bottom; for each: purpose, real copy (headline, sub-copy, CTA labels), content and
imagery it needs, and which reference it borrows from and what)
## Interactions & motion
## Responsive notes
(desktop 1440 and mobile 390: what changes per section)
## Copy
(the voice in 2 lines, plus any copy not already in Sections; real words, never lorem ipsum)
## Out of scope

Keep it tight: a builder should be able to design the page from this alone.
```

## 2. Call GPT

```bash
cd <page> && codex exec --skip-git-repo-check -s read-only \
  -i refs/<pick1> -i refs/<pick2> … \
  -o prd.raw.md "$(cat .prd-prompt.txt)" < /dev/null > .codex.log 2>&1
```

- `< /dev/null` is required. When stdin is piped, Codex appends it to the prompt.
- MCP auth errors in `.codex.log` come from Codex's own MCP config and don't matter.
- Pass the pick images in the order they appear in `picks.md`.

## 3. Check what came back

All of these must hold:
- `prd.raw.md` exists and is not empty.
- It contains every heading: `## Goal`, `## Audience`, `## Sections`, `## Interactions & motion`,
  `## Responsive notes`, `## Copy`, `## Out of scope`.
- It has no image embeds (`![`) and no code fences with layout drawings.

```bash
for h in "## Goal" "## Audience" "## Sections" "## Interactions & motion" "## Responsive notes" "## Copy" "## Out of scope"; do
  grep -qF "$h" prd.raw.md || echo "missing: $h"; done
```

If it passes, write `prd.md` as `<!-- prd-source: gpt -->` followed by the contents of `prd.raw.md`.

## 4. Fallback: Claude writes it

Use this if `codex` is not installed, the command fails, it asks for a login, the output is empty, or a heading is
missing after **one** retry. Then:

- Claude fills the same template itself, from the same inputs.
- The first line is `<!-- prd-source: claude (codex unavailable: <short reason>) -->`.
- Tell the user plainly: "GPT wasn't reachable (<reason>), so I wrote this PRD myself." If it was a login problem, add
  "Run `! codex login` if you want GPT next time."

## 5. Checkpoint

Show a 5-line summary of the PRD (sections in order, plus anything surprising) and the path to `prd.md`. **Stop.**
Ask the user to approve or edit it. Apply their edits to `prd.md` directly. When they approve, set `STATUS.md` to
`stage: canvas`.
