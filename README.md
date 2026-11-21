# skynette/skills

Agent skills for Claude Code (and other agents that read `SKILL.md`).

## Skills

### frontend-design-demon

Designs a web page from references through to code, stopping for you at every step that needs your taste.

```
references → PRD → canvas → design → iterate → code
```

- **References:** bring your own (screenshots, links, a folder) or answer a few taste questions. It then gathers
  candidates from Awwwards, Lapa Ninja, Mobbin and Pinterest, and you pick.
- **PRD:** GPT writes it through the Codex CLI (Markdown only, no mockups), and you approve it. If Codex isn't
  installed, Claude writes it.
- **Canvas:** Claude Design (default), Pencil or Figma. Your picks go on a References board. With no references of
  your own, you first pick from three directions. Then desktop (1440) and mobile (390) designs are built with real
  copy and critiqued before you see them.
- **Iterate** until you say "approved". Nothing is coded before that.
- **Code:** it asks for the stack (plain HTML/CSS/JS by default), then builds with the taste, polish and motion skills
  below.

Every page lives in `design/<page>/` with a `STATUS.md`, so you can stop and pick up again in a new session.

**Install**

```bash
npx skills add skynette/skills@frontend-design-demon
```

Then run `/frontend-design-demon` in your project folder.

**Works best with** (optional; it falls back without them):

```bash
npx skills add leonxlnx/taste-skill@design-taste-frontend
npx skills add anthropics/skills@frontend-design
npx skills add emilkowalski/skills@emil-design-eng
npx skills add greensock/gsap-skills@gsap-core
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
npx skills add oil-oil/oil-ui@oil-ui
npx skills add pbakaus/impeccable@impeccable
npx skills add emilkowalski/skills@review-animations
npx skills add emilkowalski/skills@animation-vocabulary
npx skills add emilkowalski/skills@choreograph
npx skills add emilkowalski/skills@break-ui
npx skills add emilkowalski/skills@pick-ui-library
npx skills add emilkowalski/skills@learn-taste
```

What each one does in the flow:
- **ui-ux-pro-max:** palette, font pairing and UX rules before drawing.
- **oil-ui:** three directions to pick from when you bring no references.
- **impeccable:** critique before each round you see; audit and polish before handoff.
- **Emil's set:** motion review, naming the motion you describe, group motion, worst-case data, library choice, and
  saving your corrections as rules for next time.

When they disagree: your brief and picks win, then the approved design, then the taste rules, then the rest.

It also uses the following, if available: the Codex CLI (for the GPT-written PRD), Claude in Chrome or Playwright (for
gathering references), and Pencil or Figma through their MCP servers.

## License

MIT
