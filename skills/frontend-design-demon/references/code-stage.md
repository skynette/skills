# Stage 6: Code

Only start this stage once `design-notes.md` has an `## Approved` block covering both desktop (1440) and mobile (390)
frames.

## 1. Ask for the stack (always)

Propose a stack, then ask:

- **Inside an existing project** (it has a `package.json` with a framework, or similar): "This project uses <stack>.
  Build it there?"
- **A single page or small site:** "Plain HTML/CSS/JS with GSAP? (my default for a page this size)"
- **A large multi-page site:** propose a framework (Astro for content-heavy sites, Next.js if it needs app behaviour)
  and say why in one line.

Record the answer in `STATUS.md` as `stack: …`, and ask where the code should go if it isn't obvious.

## 2. Which skill governs what

Load these skills before writing code (any that aren't installed: follow the same rule from your own judgement):

| Concern | Skill | Rule |
|---|---|---|
| The build: layout, copy and imagery rules, the checker, the finish gate | `design-taste-frontend` | Runs the build. **The approved design wins over its house rules.** List every house rule you bent and why. |
| Aesthetic direction | `frontend-design` | Only where the approved design leaves something open (a state that wasn't drawn, a breakpoint between frames). |
| Interaction polish: hover and press states, transitions, popovers, focus | `emil-design-eng` | Apply to every interactive element. |
| Choosing libraries (framework stacks only) | `pick-ui-library` | Toasts, drawers, menus, primitives: use what it picks rather than hand-rolling. |
| Group motion (entrances, staggers) | `choreograph` | One entrance per container, non-uniform delays. |
| Motion | `gsap-core`, plus `gsap-scrolltrigger` / `gsap-timeline` when the PRD calls for scroll or sequenced motion | Implements the motion from the PRD's "Interactions & motion" section. Wrap it in `gsap.matchMedia()` with a `prefers-reduced-motion` branch. |

**If the canvas was Claude Design,** start from its artboards, because they are already HTML and CSS:
- Read `<page>/canvas/project/Desktop.dc.html` and `Mobile.dc.html`, and rebuild them as one responsive page.
- Take what's inside `<x-dc>` as the markup and `<helmet><style>` as base CSS.
- Turn `{{holes}}` into their literal values from `renderVals()`, and drop the `support.js` and `data-dc-script` parts.
- Download each `/_blob/<id>` image (`Artifact` `read` with the id as `path`) into the site's assets folder.
- The mobile artboard sets the breakpoint styles.

Build section by section in PRD order. Use the real copy from the PRD and the design. Don't add sections the design
doesn't have.

## 3. Done check

1. Serve the page and screenshot it at 1440 and 390. Put each screenshot beside the matching canvas frame (a Pencil
   screenshot, or for Claude Design, ask the user to compare against the artboard link) and list the differences. Fix anything that wasn't intended.
2. Run the review passes, in order, and fix what doesn't conflict with the approved design:
   - `impeccable audit`: accessibility, performance and responsive checks.
   - `review-animations`: every transition and animation, against Emil's bar.
   - `break-ui`: worst-case data (long names, empty states, huge numbers, non-Latin text) on every component that
     shows data.
   - `impeccable polish`: the final pass.
3. Run the `design-taste-frontend` checker or finish gate, as that skill describes. Report what it flags. Fix what
   doesn't conflict with the approved design, and list the rest as "kept because the design calls for it".
4. **Stop.** Show the user the screenshots, the bent-rules list and how to open the page. When they're happy, set
   `STATUS.md` to `stage: done`.

## 4. After the user signs off

Offer once: "Want me to save the corrections you made on this page as rules for next time?" If yes, run `learn-taste`
on this page's round log (`design-notes.md`) so the next page starts with them.
