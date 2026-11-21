# Stages 3–5: Canvas, first design, iterate

## Stage 3: Canvas

1. **Ask:** "Claude Design (default), Pencil or Figma?" Claude Design is the default: there's no app to open, and its
   artboards are already web code, so the code stage is shorter. Pencil gives full drag-and-drop editing. Figma needs
   the Figma MCP and a Figma plan that allows it. Record the answer in `STATUS.md` as `canvas:`.
2. **Existing project:** if the root is a project with a framework, component library or design tokens (Tailwind
   config, CSS variables, a `tokens`/`theme` file, a component folder), read them now. The design is drawn within
   them: the same type scale, colours and spacing, and the existing components where they fit. Note what you're
   reusing in `design-notes.md`.
3. **Open the canvas.**
   - **Claude Design:** see "Claude Design" at the end of this file. It replaces steps 3 and 4 below.
   - **Pencil:** call `mcp__pencil__get_app_state`.
     - If no document is open, ask the user to open or create `<page>/design.pen` in Pencil, then wait.
     - Once a document is open, call `mcp__pencil__read_skill` and read what it points to for the page type (web).
       Do this every time; don't work from memory.
   - **Figma:** this needs the Figma MCP to be authenticated (the user may need to log in). Load the `figma:figma-use`
     skill before any `use_figma` call, and `figma:figma-generate-design` for building the page.
4. **References board.** Put the pick images (from `picks.md`, in order) on a frame named "References" to the left of
   the design area, each labelled with its pick id and its "Take:" line.
   - **Pencil** (verified 2026-11-21): images are **image fills on rectangles**, with the `url` relative to the
     `.pen` file. There is no image node type.
     - If the `.pen` file isn't in `<page>/`, copy the pick images into a folder named `refs/` next to it first, so the `./refs/` paths below resolve.
     - `execute` snippets must not use `return`. To persist an id across calls, assign a global (`boardId = Insert(…)`).
     - One call builds the board:

     ```js
     const pos=FindEmptySpace({width:1400,height:900,direction:"left",padding:120})
     boardId=Insert(document,{type:"frame",name:"References",layout:"vertical",gap:32,padding:40,fill:"#FFFFFF",x:pos.x,y:pos.y,placeholder:true})
     for (const p of PICKS) {
       const card=Insert(boardId,{type:"frame",name:p.id,layout:"vertical",gap:10})
       Insert(card,{type:"rectangle",name:p.id+" image",width:640,height:400,fill:{type:"image",url:"./refs/"+p.file,mode:"cover"}})
       Insert(card,{type:"text",name:p.id+" label",content:p.id+" · Take: "+p.take,fontFamily:"Inter",fontSize:14,fill:"#1A1A1A"})
     }
     Update(boardId,{placeholder:false})
     TakeScreenshot([boardId])
     ```

     Fill `PICKS` inline (`[{id:"u01",file:"u01.png",take:"layout, 50/50 split"}, …]`). Check the screenshot shows
     the images. For a link reference, `mcp__pencil__browser` with `load-page` then `screenshot-to-canvas` places a
     live-page screenshot directly.
   - If placing images fails, don't burn time on it. Tell the user: "The reference images are in `<page>/refs/`. Drag
     them onto the canvas if you want them there." Then carry on. The design stage doesn't depend on it.
5. Write `design-notes.md` with `canvas_file: <path or url>` and a `## References board` line (`placed` or
   `manual: in refs/`).

## Stage 4: First design

**Before drawing anything,** load `design-taste-frontend` and `frontend-design` (if installed; see "What it needs" in
SKILL.md). Their rules apply to what you draw:
- no template look
- one system
- real copy
- equal edges
- one section per screen at desktop

**Plan the system first** (only if the project has no styles of its own and no design system was chosen): use
`ui-ux-pro-max` to look up a palette, a font pairing and the UX rules for this product type, guided by `picks.md` and
`taste.md`. Write the result to `design-notes.md` under `## System` (colours, type, spacing, in a few lines). The picks
outrank its suggestions.

**Three directions first, only when the user brought no references** (`taste.md` exists, or the picks all came from
sourcing):
- Use `oil-ui`'s 3-direction comparison. Each direction is the hero plus one more key section, desktop only, all
  three genuinely different (not three shades of one idea), each traceable to `taste.md` and the picks.
- On Claude Design, these are three artboards (`DirA`, `DirB`, `DirC`). On Pencil, they're three frames. Otherwise,
  use oil-ui's HTML comparison page.
- Never use image generation that spends paid credits (oil-ui's Oil credits) without asking the user first.
- Log `## Directions` in `design-notes.md` (one line on each), then **stop**: "Which direction: A, B or C? Or mix,
  e.g. A's type with C's layout."
- Record the answer as `## Direction picked`, then build the full design below in that direction.

If the user brought their own references, skip the directions: their picks already set the look.

Then:

1. Make a desktop frame at 1440 wide, building each PRD section in order inside it. Use the PRD's real copy word for
   word; never lorem ipsum. Use the imagery the PRD asks for, or a clearly marked placeholder ("PHOTO: <what>").
2. Make a mobile frame at 390 wide, following the PRD's "Responsive notes". This is required, not optional.
3. Next to each section, add a small note saying which pick it borrows from and what (from `picks.md`).
4. **Self-critique before showing:** run `impeccable critique` on the frames. Fix what it finds that doesn't
   conflict with the brief or the picks, and list what you fixed in one line.
5. Screenshot both frames.
6. Log `## Round 0` in `design-notes.md` (frames created, picks used for each section).
7. **Stop.** Show the screenshots and ask for feedback: what to keep, what to change, what feels off.

## Stage 5: Iterate

Each round:

1. Apply the user's feedback. Change only what they asked for, plus whatever that change forces elsewhere (say what
   that was).
   - Vague feedback maps to `impeccable` commands: "bland, play it up" → `bolder`; "too loud, busy" → `quieter`;
     "too much going on" → `distill`; "colours feel off" → `colorize`; "type feels off" → `typeset`; "layout feels
     off" → `layout`.
   - Motion described vaguely ("the bouncy thing", "slides in smooth") → use `animation-vocabulary` to name it
     exactly, and confirm the term with the user in one line.
   - Before showing the round, run `impeccable critique` on the changed frames and fix what it finds, within the
     feedback's scope.
2. Keep desktop and mobile in step. A change on one frame is carried to the other unless the user says it's for one
   only.
3. Append to `design-notes.md`:

   ```markdown
   ## Round N
   - Feedback: <their words, short>
   - Changed: <what you did>
   - Frames: <desktop | mobile | both>
   ```

4. Screenshot the changed frames, show them, and **stop**.

**Approval:** when the user approves, first check that every PRD section exists in both the desktop and the mobile
frame. If one is missing, build it, show it, and ask again. Then append:

```markdown
## Approved
- Date: YYYY-MM-DD
- Frames: desktop 1440, mobile 390
- Canvas: <file or url>
```

Set `STATUS.md` to `stage: code`.

## Claude Design (canvas: claude-design)

Claude Design is the **Design artifact type**: a claude.ai canvas of artboards, each one a live `.dc.html` web page.
It's private to the user until they share it. The type's own instructions come back when the canvas is created.
**Follow them exactly** for file shapes and calls; this section only says how they fit this process.

**Create (once per page):**
1. `Artifact` `action: "quickstart"`, `intent: "design"`. This returns the Design `type_url` and the user's design
   systems.
2. **Design system:** if the root project has its own styles (step 2 above), use those and no system. Otherwise, if
   the user has design systems and none is the default, ask once, in the same message as the canvas question: "Use
   one of your design systems (<names>), or a fresh look from the picks?" The default for this process is a **fresh
   look**, because the picks and the PRD set the look. Record the answer in `design-notes.md`.
3. Publish with that `type_url`, `title` = the page name, and `auto_open: "after_first_write"`. Save the returned `url`
   as `canvas_file:` in `STATUS.md` and `design-notes.md`.

**Where the files live:** `root` = `<page>/canvas/`, so the canvas's `project/canvas.json` and `project/*.dc.html` sit in
the page folder and survive across sessions. Never use the session scratchpad for these, because it gets cleared. In a
new session, if a file is missing, `read` it from the artifact with its `path` and copy it into `<page>/canvas/project/`.

**References board** (verified 2026-11-21: the uploaded image rendered on the artboard, confirmed by the user):
- Upload each pick image with `publish`, `url`, `file_path: <page>/refs/<file>` and `asset: true`. Keep a note of each
  returned `/_blob/<id>` in `design-notes.md`; a re-upload makes a new id.
- The board is its own artboard, `References.dc.html`, placed to the left of the design. Each pick is an `<img src="/_blob/<id>">`
  with a caption of its id and its "Take:" line.

**First design (stage 4):**
- One PAGE artboard for desktop: `Desktop.dc.html`, `w` 1440, `"expand": "fill"`, fluid root.
- One artboard for mobile: `Mobile.dc.html`, `w` 390, with the height its content needs.
- Both are built section by section from the PRD with real copy. Make `Desktop.dc.html` the entry (`launch` focused
  on it, or first in `order`).
- Section-to-pick notes go in the canvas's `notes` as stickies beside each artboard, not inside the artboards.

**Checkpoints on this canvas:** the type says not to screenshot or re-check its pages yourself unless asked. So instead
of screenshots, each stop links the artboards (`<url>#artboard-Desktop`, `<url>#artboard-Mobile`) and asks the user to
look.
- The user can leave comments on the canvas. When they say they've commented, read them with `ArtifactComments`
  (`action: "read"`) and treat them as that round's feedback.
- Iterating means editing the files under `<page>/canvas/project/` and republishing only the changed files, as the
  type's "Revising" rules say.
