# Stage 1: References

The goal is 4–5 references the user actually likes, plus a note on what to take from each. The user's eye picks;
Claude does the legwork.

## 1. Always ask first

> Got references? Send screenshots, links, a folder path, or point me at what's already on the Pencil canvas.
> Or say "none" and I'll ask you a few questions about what you want, then go find some.

Wait for the answer. Don't start searching before it.

## 2a. The user sends references

Accept any mix of these. Put everything in `<page>/refs/` and name files `u01`, `u02` and so on, **keeping each file's original extension**
(`u01.jpg`, `u02.webp`). Link screenshots are `.png`.

| They send | Do |
|---|---|
| Screenshots in chat | Save each to `refs/` (if they arrived only as pasted images and can't be saved, describe each in `picks.md` and ask the user for the file path). |
| Links | Open each in the browser (Claude in Chrome, or Playwright if that isn't connected) and screenshot it at 1440 wide, full page. If the user named a section, also screenshot just that section. |
| A folder path | Take every `.png`, `.jpg`, `.jpeg` and `.webp` at the top level only (no subfolders), and copy them into `refs/`. Say "took N images from <path>". If there are none, say so and ask again. |
| A Refero Styles link (styles.refero.design/style/…) | Screenshot the style page's hero as usual, then also save its design system: see "Refero Styles" below. |
| "It's on the canvas" | Read the References board (or the user's selection) in Pencil and screenshot it into `refs/`. |

Then look at every reference and draft `picks.md`:

```markdown
# Picks
## u01: <short name> (<url or source>)
- Take: <layout | type | colour | motion | imagery | copy tone>, specifically <what>
- Ignore: <what not to copy, if anything>
```

Show the draft and ask the user to correct it. **Stop here.** This draft is the checkpoint: the user's corrections
are the point, so keep it short and concrete.

There is no shortlist on this path. After the picks are confirmed, you may offer once: "Want me to find a few more
like these?" Only search if they say yes, and then use section 3 with their picks as the taste guide, showing only the
new candidates.

## 2b. The user has none: taste interview

Ask one question at a time, and build each question on the last answer. Cover:

1. The feeling: what should someone feel in the first 3 seconds?
2. Sites or apps they love, and what about them. Sites they hate, and why.
3. Colour leanings (dark or light, muted or loud, any brand colours).
4. Type leanings (editorial serif, clean grotesk, mono, expressive display).
5. Motion: still, subtle, or a showpiece?
6. Density: airy or packed? And any hard no's.

Stop after these six, or sooner if the answers are already clear. Write `taste.md` with their answers in their own
words, then play it back in 3–4 lines and go to section 3.

## 3. Sourcing (only after 2b, or a "yes, find more")

Target 12 candidates from at least 3 sources, chosen to fit `taste.md` (or the confirmed picks).

| Source | How | Capture |
|---|---|---|
| Awwwards (awwwards.com/websites, plus search) | Claude in Chrome, or Playwright | Hero, or the specific section that fits |
| Lapa Ninja (lapa.ninja) | Claude in Chrome, or Playwright | Full landing page, cropped to its best section |
| Mobbin (mobbin.com) | **Claude in Chrome only** (needs the user's signed-in Chrome) | The screen or flow that fits |
| Pinterest (pinterest.com) | **Claude in Chrome only** (signed in) | The pin image |
| Refero Styles (styles.refero.design) | Any browser; no login. Search box or category chips (e.g. "Cinematic dark", "Editorial magazine", "Dark devtool landing"), or "More like this" on a style that fits | The style page's hero screenshot, plus its DESIGN.md (see below) |

Rules:
- Load the Claude in Chrome skill before its first use, and work in a new tab.
- If any source is blocked (a login wall on Mobbin or Pinterest, a bot check or Cloudflare wall, a page that won't
  load), don't try to get around it or log in. Add `{"source":"<name>","reason":"<not signed in | blocked | down>"}` to
  `refs/skipped.json`, fill the 12 from the remaining sources, and name the skipped ones when you show the shortlist.
- Save each candidate as `refs/rNN.png` and append it to `refs/candidates.json`:
  `{"id":"r01","file":"r01.png","url":"https://…","source":"awwwards|mobbin|pinterest|lapa|refero","note":"what's good about it, 1 line"}`
- Mix it up: avoid 12 of the same kind. Make at least a third of them unexpected, not the most popular result.
- Build the page and open it:

```bash
node <this skill's folder>/scripts/shortlist.mjs <page>   # the folder holding this skill's SKILL.md
open <page>/refs/shortlist.html
```

**Stop.** Ask the user to reply with 4–5 numbers and what they like about each. Write `picks.md` (same format as
above, using `rNN` ids) from their answer, then set `STATUS.md` to `stage: prd`.

## Refero Styles

styles.refero.design is a free library of 2,000+ design systems pulled from real product sites. Each style page
(`styles.refero.design/style/<id>`) has a hero screenshot plus tabs for the system itself: palette with hex values and
roles, type scale, spacing, radius, shadows, components, and do/don't notes. It's the one source that gives tokens,
not just a picture, so it's the best place to look when the taste interview landed on a clear colour/type direction.

- **Capture:** screenshot the hero as `rNN.png` (or `uNN.png` for a link the user sent). Then open the style's
  **DESIGN.md** tab and save its text as `refs/rNN.design.md` next to the image. If the tab's text can't be copied,
  write the palette (hex + role), font families and type scale from the Preview tab into that file by hand.
- In `candidates.json`, use `"source":"refero"` and the style page URL. Don't save the `.design.md` for candidates
  that don't make the picks; delete those files once `picks.md` is confirmed.
- In `picks.md`, add a line under the pick: `- System: refs/rNN.design.md`.
- These systems are measured from real brands (Apple, Vercel, ElevenLabs…). Borrow how the system works (contrast,
  scale, spacing rhythm, how colour is rationed), never the brand itself: no copying a logo, signature colour as the
  hero colour, or product imagery.
