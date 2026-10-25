---
name: md-deck
description: >-
  Use when creating or revising slide decks with md-deck (Markdown → PDF):
  workflow, style vs content split, spacing density, copy budgets, diagram
  recipes, cover-title breaks, corner indexes, dashed gap links, eyebrows,
  dashed layer outlines, content-sized column cards, review before tag/release,
  and common failure modes. Palette: visual-color. Diagram principles:
  visual-diagram. Independent of any
  one deck or subject. Do not put customer names, proposal content, or HEX
  colours here.
---
# md-deck slide decks

Reusable practice for building 16:9 PDF slide decks with [md-deck](https://github.com/yohei1126/md-deck). The rules below apply to any deck. Put environment-specific bot ops, customer names, and proposal claims elsewhere. Never invent unsupported Markdown directives.

## Roles

| Piece | Where it lives | Role |
| :--- | :--- | :--- |
| md-deck | `yohei1126/md-deck` | Generator + reusable GitHub Action. Pin a release tag / commit. |
| Deck repo | e.g. a project docs repo | Slides Markdown, `deck_style.md`, optional CSS, Release PDFs |
| `examples/` in md-deck | md-deck only | Samples. Do not treat as production deck sources |

Slide words live in the **deck repository**. The deck repo still supplies a style file. Palette and when to use it live in [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). Theme CSS is implemented in md-deck. This skill does not copy HEX values or a customer brand.

## Recommended workflow

1. Lock scope in a brief: slide count, goal of each slide, and any forbidden claims.
2. Write `deck/*.md` (or the deck’s paths). Front matter must name `style` (and optional CSS) per md-deck’s contract. Select the theme in `deck_style` as [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md) describes.
3. Run `md-deck check`, then build the PDF with the **same pinned md-deck version** locally and in CI. Check enforces the cover-title rules; it does not enforce the copy budget below.
4. Open a PR and wait for CI green (`check` / build PDF).
5. On the PR branch, rebuild with `md-deck build --png`. Attach the PDF plus the cover PNG and every flow slide for review **before** merge.
6. Merge and tag **only after** the owner has OK’d the PDF. Agents must not merge or cut tags on their own.

## Releases and tags

- Deck repos do **not** use semver for decks. Prefer tags like `YYYYMMDD-HHMM-marker` (example: `20261024-2315-topic`).
- Legacy tags such as `deck-v1.0.0` may remain; new tags should use timestamp + marker.
- If several decks ship together, put their PDFs on one Release from one tag (shape CI accordingly).
- Attach PDFs to the **deck** repository’s Release, never to the md-deck generator repo.

## Visual goals

- Aim for NotebookLM-like readability through density and short copy: quiet colour, structured information, and a visible bone of boxes and arrows. The palette is [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md).
- Leave decoration out of the style CSS: gradients, drop shadows, stickers, and icon collages. Limits and the phased plan: [VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md).
- Generation is deterministic: same inputs → same layout. Do not use NotebookLM slide generation for these PDFs.
- Decks that share a style guide keep that guide. Change the subject terms, not the visual system.

## Where style lives

- Spacing, fonts, and optional CSS: deck-side `deck_style.md` (YAML tokens + optional fenced `css` targeting [HOOKS.md](https://github.com/yohei1126/md-deck/blob/main/docs/HOOKS.md)). A deck style may add a cover frame. Select theme `dark-blue` there; the palette rules are [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). Theme CSS stays in md-deck.
- To fix a sparse layout **without** changing wording, prefer style / CSS / layout structure over rewriting prose.
- In Japanese prose about outputs, prefer the phrase for “slide materials” over “deck”; keep the product name `md-deck` and paths like `deck_style.md` / `deck/` unchanged.

## Spacing and density

Separate **page outer padding** from **gaps inside and between blocks**.

- Keep moderate outer page padding. Sparse slides are usually caused by **large gaps between blocks**, not by thin page margins.
- Pull cards closer, fill columns, and reduce empty space under headings.
- To raise density without adding copy: bump body font one step and/or tighten `line_height` slightly.
- Keep wording fixed when the ask is visual only; put premise corrections in a separate pass.

Useful style tokens (see md-deck style docs): `page_padding` / `page_padding_*`, `gap`, `card_padding`, `font_size_body`, `line_height`, and CSS on stable hooks (lists, cards, columns)—not `#slide-N :nth-child()` selectors.

A `::: flow wide` row grows toward `flow_preferred_height` (default `60%` of the slide). Stretching boxes to the full height left under the title is opt-in (`flow_fill_height: fill` or `::: flow fill`). The title stays at the top; the blocks under the title are centred in the space that remains. Layout token names: [VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md).

Once md-deck ships the denser defaults, rely on them instead of extra CSS: box text about 18px, cards aligned to the top, a bold Key Message, and lane spread only when the deck opts in. Until that generator is pinned, set those in the deck style.

`::: columns`, `::: columns panel`, and `::: columns plain` stay content height. Cards do not grow to the leftover slide. The `column_min_height` floor (default `160px`) still applies. Only `::: columns fill` stretches that row. Do not raise the floor, and do not add CSS, to make a short card match a taller neighbour. Do not lower `font_size_body` or `line_height`, and do not cut the body copy, so the row looks dense. Thin body copy is not density. The column budget below still applies at the normal body size.

## Theme

Palette and when to use `dark-blue` or plain: [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). In `deck_style`, select theme `dark-blue`. Theme CSS is implemented in md-deck. This skill does not repeat the HEX values. An eyebrow uses `--color-accent-2`. A dashed gap edge and its label use `--color-edge-gap`. Set those by the theme, or by the matching style tokens. Do not hard-code the colours in a deck CSS fence.

## Writing slides

- Keep the slide count fixed to the brief; do not add slides without an ask.
- Each slide: one goal, plus evidence / figure / question. Do not thin the deck into slogans only.
- For discussion decks, keep explicit discussion questions (`::: question` or the deck’s agreed pattern).
- Use only md-deck-supported constructs (`---` slides, one `#` title, one `eyebrow:` line, Key Message, `::: columns` / `::: flow` / `::: source`, tables, hard breaks, flow corner indexes, dashed links, `{.dashed}` on a column heading). See [INPUT_FORMAT.md](https://github.com/yohei1126/md-deck/blob/main/docs/INPUT_FORMAT.md). Forms that `md-deck check` rejects on the pinned generator are not supported yet: do not invent a second directive or a `#slide-N` CSS hook.
- Prefer the diagram recipes, copy budget, and cover-title rules below. Reading order and when to split a figure: [visual-diagram](https://github.com/yohei1126/agent-skills/blob/main/visual-diagram/SKILL.md). When a prototype or an earlier deck in the same series exists, match its column / flow / card / table structures.

## Section label (eyebrow)

One section label may sit on its own line immediately before the H1. It names the section. The H1 names the slide. It is not a class on the heading.

```markdown
eyebrow: Section label
# Where the record lives
```

- The directive is `eyebrow: Section label`. The keyword is case-insensitive (`Eyebrow`, `EYEBROW`). A full-width colon works (`eyebrow：Section label`).
- One top-level line per slide, immediately before the title. An empty body (`eyebrow:`) is an error. A second eyebrow on the same slide is an error.
- It renders as `<p class="eyebrow">` before the `h1`. Colour is `--color-accent-2`. The value is [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md).
- A line inside a fence or a `:::` block is left alone. It is not an eyebrow.
- Do not write `{.eyebrow}` on the H1. Do not fold the label into the title (`# Section label: Title` or `# Section label\nTitle`).
- A name, ≤14 full-width characters, no sentence-final ideographic full stop. Shorter than the title. It must not repeat the H1, and it is not a Key Message. Omit it when the title already names the section.
- Leave it out of the slide-body character count. Cover subtitle and date stay `.cover-meta`. An eyebrow does not replace them.
- The words in the fence are placeholders. Do not put a customer, event, or proposal name here.

## Copy budget

Authoring checklist. `md-deck check` still accepts a dense slide; the generator fails only when the slide overflows after scaling to 80% ([VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md)).

Count **full-width characters**: one CJK character is 1, one ASCII letter or digit is 0.5. That unit is separate from cover-title display width, where a wide character counts as 2.

| Piece | Budget |
| :--- | :--- |
| Key Message | 1 sentence, ≤40 full-width characters |
| Box / flow label | ≤12 full-width characters. A label is a name: no sentence-final ideographic full stop, and no choice packed into one label (an "A or B" label). This holds for each member of a `{ A / B }` branch stack too |
| Box caption (after `\|`) | 1 short line, ≤20 full-width characters. Move the detail into the speaker script, not into the box |
| Column heading | About 14 full-width characters. A `::: columns` heading is not a box / flow label, so the 12-character label rule does not apply |
| Eyebrow (`eyebrow:`) | One line immediately before the H1, ≤14 full-width characters. A section name. Empty is an error. Leave it out of the slide-body count |
| Corner index | A leading circled digit with a real title (`① Intake`), or `{1}` / `{①}`. Drawn as `.flow-node-index`, so it does not spend the ≤12 box-label budget. `{draft}` and `{v1}` stay inline. A title that is only `①` stays the title. ASCII digits inside a title are not an index |
| Gap label on a dashed link | ≤12 full-width characters. A name for the missing step, on that link only |
| `::: columns` items | 3 items per column, ≤15 full-width characters each. Same sentence pattern on the left and the right. Bullets inside panels; no paragraphs |
| Bullet body | ≤3 items per slide, 1 sentence each |
| `::: question` | 1 sentence, ≤40 full-width characters. Own budget: leave it out of the slide-body count |
| Slide body | Excluding the title, the `eyebrow:` line, `::: source`, and `::: question`, aim for ≤150 full-width characters. Split the slide when the body runs over |

When these budgets leave whitespace on a flow, enlarge the boxes or the type. Do not pad with more words. That sits with “Do not thin the deck into slogans only” under Writing slides. On `::: columns` / `panel` / `plain`, keep content height. Do not thin the body copy, and do not add `fill`, to fake density.

The caps guide a **new** diagram. When rebuilding an existing deck from a transcript or other source, the source wording wins. Wrap a long label with `\n`. Do not cut a sentence, and do not drop a note or a side arrow, only to meet the ≤12 label cap.

## Diagram recipes

Principles (reading order, short labels, split a complex branch, text equivalent): [visual-diagram](https://github.com/yohei1126/agent-skills/blob/main/visual-diagram/SKILL.md). The Markdown shapes stay here. Before/after markup: [DIAGRAMS.md](https://github.com/yohei1126/md-deck/blob/main/docs/DIAGRAMS.md). Buildable sample: [`examples/diagram_patterns.md`](https://github.com/yohei1126/md-deck/blob/main/examples/diagram_patterns.md).

- **2-box compare:** `::: columns panel` with parallel short bullets.
- **3-step row:** `::: flow wide` with name-length labels. The corner index is a leading circled digit or `{1}` / `{①}`, or use `steps` for an automatic counter. See below.
- **Branch:** a `{ A / B }` stack, plus a separate edge into each member. `Start -> { A / B }` draws a single arrow into the middle of the stack. Keep each branch label at the box-label budget; a long branch label stretches the whole stack across the slide.
- **Two rows of parties:** two `lane:` rows joined by `link:`. Leave `lane:` unlabelled when the boxes already name the parties. A lane label must not repeat an edge label.
- **A gap between two parties** (missing hand-off, broken information flow): one dashed link, `-.[label].->` or `link: a ..>`. That link is the emphasis and uses `--color-edge-gap`. Not a callout, and not a box added to the row. See below.
- **Quieter column:** `## Quiet {.dashed}` on that card’s heading, so the card is `.column.dashed`. Pair with `{.muted}` when the layer should read quieter. See below.
- **One box under a longer lane:** `lane: [align=end]` (or `center`) so the box sits under the box it relates to, instead of hugging the left edge. Markup: [INPUT_FORMAT.md](https://github.com/yohei1126/md-deck/blob/main/docs/INPUT_FORMAT.md).
- **Where something lives:** when the point of a box is a place (evidence, data, a document), name the place in the label or the caption.

Photos, logos, and maps may be images. Boxes and arrows stay in these recipes.

## Flow numbers, gaps, and dashed cards

Authoring forms. If `md-deck check` on the pinned generator rejects one, do not invent a second directive or a `#slide-N` CSS hook. Pin the generator that accepts it.

### Corner index

The index is `.flow-node-index`, outside the title. The title stays a name (≤12 full-width characters).

A leading circled digit with a real title is lifted into that corner:

```markdown
::: flow wide
① Collect -> ② Decide -> ③ Record
:::
```

The same corner index is a badge that is only a circled number or 1–3 digits:

```markdown
::: flow wide
Collect {1} -> Decide {2} -> Record {3}
:::
```

`{①}` is the same kind of index as `{1}`.

- One index per box. Do not write both `① Collect` and `{1}` on the same node.
- `{draft}` and `{v1}` stay inline (`.flow-node-badge`). They are not corner indexes.
- A title that is only `①` stays the title. ASCII digits inside a title (`Collect 1`) are not lifted.
- `::: flow steps` draws a separate muted counter, 1..n in reading order. Use it when you do not choose the digits. Do not also add a corner index:

```markdown
::: flow wide steps
Collect -> Decide -> Record
:::
```

### Gap (dashed-link emphasis)

A missing step is the connection. Draw one dashed link. The label is the annotation, and that link is the emphasis. Write the operator with no space: `-.[label].->`.

```markdown
::: flow
Intake -.[missing].-> Review
:::
```

Across lanes, the same stroke is `..>`:

```markdown
link: Intake ..> Review : missing
```

- Solid `->` means the step exists. Dashed `..>` or `-.[label].->` means the connection is the gap.
- Emphasise one gap. Leave the other edges solid.
- The dashed stroke and its label use `--color-edge-gap`. On `dark-blue` that token is the accent. The value is [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). The label hook is `.flow-label-gap`.
- The label is a short name, ≤12 full-width characters. It is not a callout, not a new box, and not a lane label. Do not repeat it on the boxes.

### Dashed column card

A quieter card takes a dashed outline from the column heading, not from a flow node.

```markdown
::: columns panel
## Quiet {.dashed}

- One owner

+++

## Active {.dashed .muted}

- One check
:::
```

- `## Quiet {.dashed}` copies `.dashed` onto the card (`.column.dashed`). The class stays on the heading as well.
- Combine with `{.muted}` (`## Quiet {.dashed .muted}`) when that layer should read quieter.
- `{.dashed}` on a flow node is a badge, not an outline. Put the class on the column heading.
- A dashed link is a missing step. A dashed card outline is a quieter column. Do not swap them.
- `::: columns` stays content height. Only `::: columns fill` stretches the row.

## Cover titles

Make the cover title clearly larger than a slide title (about 1.5× the slide-title size) and let the title block use the vertical space; a small title clustered in the middle of the cover fails review. Set the size in the deck's `deck_style.md` CSS on the cover hooks, not in md-deck.

Break a wrapping cover title only with `\n` in the H1 (`# First phrase\nSecond phrase`). A trailing `\` does not continue an ATX heading. Break on a phrase boundary, and keep the two lines balanced. `md-deck check` enforces the structural rules. Thresholds: [VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md).

The check’s width estimate is not Chromium. After check, render PNGs and read the cover:

```bash
md-deck build slides.md -o out/deck.pdf --png out/png
```

## Pre-merge review checklist

- Slide count, order, and information density vs the reference PDF or previous version
- Copy budget: Key Message, box / flow labels (12, including each branch box), captions (20, one line), column headings (about 14), eyebrow (≤14, excluded from the body), dashed-link gap labels (12), column items, bullets, `::: question` on its own ≤40 budget, and body length with the eyebrow and question excluded. A corner index does not spend the 12. On a rebuild from a transcript or other source, the source wording wins: wrap with `\n` instead of cutting to 12
- Palette follows [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md); the theme is selected in `deck_style`.
- Diagram principles follow [visual-diagram](https://github.com/yohei1126/agent-skills/blob/main/visual-diagram/SKILL.md).
- Flow index: one corner index per box (`① Name`, `{1}`, or `{①}`) or `steps`, not both. `{draft}` and `{v1}` stay inline. A title that is only `①` stays the title
- One dashed link carries the gap label and `--color-edge-gap`; the other edges stay solid. The operator is `-.[label].->` or `link: a ..>`
- Eyebrow, when present: one `eyebrow:` line immediately before the H1, non-empty, ≤14 full-width characters, not a repeat of the title. Not `{.eyebrow}` on the H1
- A quieter card is `## Quiet {.dashed}` (`.column.dashed`), optionally `{.muted}`. `{.dashed}` is not a flow-node badge
- `::: columns` / `panel` / `plain` stay content height. Only `::: columns fill` stretches. Body copy is not thinned to fake density
- CI: check decks / build PDF succeeded
- Layout: not overly sparse; cover and diagrams not crushed
- Cover PNG: title about 1.5× a slide title and using the vertical space; phrase-boundary breaks only; lines balanced (`md-deck build --png`)
- Every flow slide PNG: arrows meet an edge of the box. An arrow into a corner fails review
- Every flow slide PNG: the diagram is centred as a group, not pushed to one side; vertical arrows between boxes that line up are straight, not bent; every arrow shows a shaft, not only a head (a lone triangle fails review); each label sits next to the box or line it names
- Forbidden premises from the brief are not still on the slides
- Local and CI md-deck versions match

## Common failures

- Generator or style “fixes” make premises correct but add whitespace so the deck feels emptier
- Replacing a figure with a thin table leaves large empty regions
- Sentence-length node labels, a column heading held to the 12-character box-label cap, paragraphs inside a `::: columns panel`, or a branch written as one "A or B" label
- A corner index together with `steps`, or both `① Collect` and `{1}` on the same node
- A missing step drawn as a callout, an extra box, or a solid arrow, or every edge dashed
- `{.eyebrow}` on the H1, an empty `eyebrow:`, a second eyebrow, or an eyebrow that repeats the H1
- `{.dashed}` written on a flow node, where it is a badge, instead of on the column heading
- `::: columns fill`, a raised `column_min_height`, or a smaller body size used so a short card row looks dense
- Filling budget whitespace with extra words instead of enlarging the boxes or the type
- Cover title wrapped mid-phrase, or split with a trailing backslash instead of `\n`
- Shipping a flow slide whose arrows run into corners
- Shipping a flow slide with a lone arrowhead (no shaft), a bent arrow between aligned boxes, a diagram hugging the left edge, or a lane label floating away from its boxes
- Long branch labels in a `{ A / B }` stack, or a cover title no larger than a slide title
- Cutting source sentences, or dropping notes and side arrows, so a rebuilt diagram meets the 12-character cap
- A customer-facing deck left on the plain eval theme (see [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md))
- Local md-deck version differs from CI
- Comparing sources only and skipping the Release / review PDF and the cover / flow PNGs
- Cutting a tag before the owner reviews the PDF
- Adding a deck `CHANGELOG.md` (skip; use PR description and Release notes)

## Verification notes

- If GitHub Actions artifacts are unavailable, rebuild on a box with the PR head and the pinned md-deck, and say so in the report. Include the cover PNG and every flow slide (`md-deck build --png`).
- Page rasters and side-by-side PNGs work well for visual diffs.

## Success criteria

- Brief (count, goals, forbids) honored
- Copy budget, diagram recipes, cover-title breaks, corner indexes, dashed gap links, `eyebrow:` lines, `{.dashed}` cards, and content-height columns followed
- Palette follows [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md)
- Diagram principles follow [visual-diagram](https://github.com/yohei1126/agent-skills/blob/main/visual-diagram/SKILL.md)
- Style and content split respected; wording unchanged when the ask was visual-only
- Same pinned md-deck in check/build locally and in CI
- Cover PNG and every flow slide reviewed (`md-deck build --png`); an arrow into a corner is a failed review
- PDF attached for review before merge/tag; owner OK before release
