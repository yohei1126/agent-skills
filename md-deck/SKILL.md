---
name: md-deck
description: >-
  Use when creating or revising slide decks with md-deck (Markdown → PDF):
  workflow, style vs content split, spacing density, copy budgets, diagram
  recipes, cover-title breaks, review before tag/release, and common failure
  modes. Do not put customer names or proposal content here.
---
# md-deck slide decks

Reusable practice for building 16:9 PDF slide decks with [md-deck](https://github.com/yohei1126/md-deck). Put environment-specific bot ops elsewhere. Never invent unsupported Markdown directives.

## Roles

| Piece | Where it lives | Role |
| :--- | :--- | :--- |
| md-deck | `yohei1126/md-deck` | Generator + reusable GitHub Action. Pin a release tag / commit. |
| Deck repo | e.g. a project docs repo | Slides Markdown, `deck_style.md`, optional CSS, Release PDFs |
| `examples/` in md-deck | md-deck only | Samples. Do not treat as production deck sources |

Content and visual style live in the **deck repository**, not in md-deck. md-deck does not ship a brand theme; a style file is required.

## Recommended workflow

1. Lock scope in a brief (for example `deck_inputs/` or hearing notes): slide count, goal of each slide, and any forbidden claims.
2. Write `deck/*.md` (or the deck’s paths). Front matter must name `style` (and optional CSS) per md-deck’s contract.
3. Run `md-deck check`, then build the PDF with the **same pinned md-deck version** locally and in CI. Check enforces the cover-title rules; it does not enforce the copy budget below.
4. Open a PR and wait for CI green (`check` / build PDF).
5. On the PR branch, rebuild with `md-deck build --png`. Attach the PDF plus the cover PNG and every flow slide for review **before** merge.
6. Merge and tag **only after** the owner has OK’d the PDF. Agents must not merge or cut tags on their own.

## Releases and tags

- Deck repos do **not** use semver for decks. Prefer tags like `YYYYMMDD-HHMM-marker` (example: `20261024-2315-lunch`).
- Legacy tags such as `deck-v1.0.0` may remain; new tags should use timestamp + marker.
- If several decks ship for the same lunch or pack, put **both PDFs on one Release** from one tag (shape CI accordingly).
- Attach PDFs to the **deck** repository’s Release, never to the md-deck generator repo.

## Visual goals

- Aim for NotebookLM-like readability through density and short copy: quiet colour, structured information, and a visible bone of boxes and arrows. Tokens stay in the deck’s style file (white cards, navy titles, teal question boxes when that deck calls for them).
- Leave decoration out of the style CSS: gradients, drop shadows, stickers, and icon collages. Limits and the phased plan: [VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md).
- Generation is deterministic: same inputs → same layout. Do not use NotebookLM slide generation for these PDFs.
- Within one venture family, keep design and style guides aligned; only domain terms change.

## Where style lives

- Colours, spacing, fonts: deck-side `deck_style.md` (YAML tokens + optional fenced `css` targeting [HOOKS.md](https://github.com/yohei1126/md-deck/blob/main/docs/HOOKS.md)).
- To fix a sparse layout **without** changing wording, prefer style / CSS / layout structure over rewriting prose.
- In Japanese prose about outputs, prefer the phrase for “slide materials” over “deck”; keep the product name `md-deck` and paths like `deck_style.md` / `deck/` unchanged.

## Spacing and density

Separate **page outer padding** from **gaps inside and between blocks**.

- Keep moderate outer page padding. Sparse slides are usually caused by **large gaps between blocks**, not by thin page margins.
- Pull cards closer, fill columns, and reduce empty space under headings.
- To raise density without adding copy: bump body font one step and/or tighten `line_height` slightly.
- Keep wording fixed when the ask is visual only; put premise corrections in a separate pass.

Useful style tokens (see md-deck style docs): `page_padding` / `page_padding_*`, `gap`, `card_padding`, `font_size_body`, `line_height`, and CSS on stable hooks (lists, cards, columns)—not `#slide-N :nth-child()` selectors.

## Writing slides

- Keep the slide count fixed to the brief; do not add slides without an ask.
- Each slide: one goal, plus evidence / figure / question. Do not thin the deck into slogans only.
- For discussion decks, keep explicit discussion questions (`::: question` or the deck’s agreed pattern).
- Use only md-deck-supported constructs (`---` slides, one `#` title, Key Message, `::: columns` / `::: flow` / `::: source`, tables, hard breaks). See [INPUT_FORMAT.md](https://github.com/yohei1126/md-deck/blob/main/docs/INPUT_FORMAT.md).
- Prefer the diagram recipes, copy budget, and cover-title rules below. Match column / flow / card / table structures to the approved prototype or previous lunch deck when one exists.

## Copy budget

Authoring checklist. `md-deck check` still accepts a dense slide; the generator fails only when the slide overflows after scaling to 80% ([VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md)).

Count **full-width characters**: one CJK character is 1, one ASCII letter or digit is 0.5. That unit is separate from cover-title display width, where a wide character counts as 2.

| Piece | Budget |
| :--- | :--- |
| Key Message | 1 sentence, ≤40 full-width characters |
| Box / flow label | ≤12 full-width characters. A label is a name: no sentence-final `。`, and no choice packed into one label (`AまたはB`) |
| Column heading | About 14 full-width characters. A `::: columns` heading is not a box / flow label, so the 12-character label rule does not apply |
| `::: columns` items | 3 items per column, ≤15 full-width characters each. Same sentence pattern on the left and the right. Bullets inside panels; no paragraphs |
| Bullet body | ≤3 items per slide, 1 sentence each |
| `::: question` | 1 sentence, ≤40 full-width characters. Own budget: leave it out of the slide-body count |
| Slide body | Excluding the title, `::: source`, and `::: question`, aim for ≤150 full-width characters. Split the slide when the body runs over |

When these budgets leave whitespace, enlarge the boxes or the type. Do not pad with more words. That sits with “Do not thin the deck into slogans only” under Writing slides.

## Diagram recipes

Use the Markdown recipes. Before/after markup: [DIAGRAMS.md](https://github.com/yohei1126/md-deck/blob/main/docs/DIAGRAMS.md). Buildable sample: [`examples/diagram_patterns.md`](https://github.com/yohei1126/md-deck/blob/main/examples/diagram_patterns.md).

- **2-box compare:** `::: columns panel` with parallel short bullets.
- **3-step row:** `::: flow wide` with name-length labels.
- **Branch:** a `{ A / B }` stack, plus a separate edge into each member. `Start -> { A / B }` draws a single arrow into the middle of the stack.

Photos, logos, and maps may be images. Boxes and arrows stay in these recipes.

## Cover titles

Break a wrapping cover title only with `\n` in the H1 (`# First phrase\nSecond phrase`). A trailing `\` does not continue an ATX heading. Break on a phrase boundary, and keep the two lines balanced. `md-deck check` enforces the structural rules. Thresholds: [VISUAL_POLICY.md](https://github.com/yohei1126/md-deck/blob/main/docs/VISUAL_POLICY.md).

The check’s width estimate is not Chromium. After check, render PNGs and read the cover:

```bash
md-deck build slides.md -o out/deck.pdf --png out/png
```

## Pre-merge review checklist

- Slide count, order, and information density vs the reference PDF or previous version
- Copy budget: Key Message, box / flow labels (12), column headings (about 14), column items, bullets, `::: question` on its own ≤40 budget, and body length with the question excluded
- CI: check decks / build PDF succeeded
- Layout: not overly sparse; cover and diagrams not crushed
- Cover PNG: phrase-boundary breaks only, lines balanced (`md-deck build --png`)
- Every flow slide PNG: arrows meet an edge of the box. An arrow into a corner fails review
- Forbidden premises from the brief are not still on the slides
- Local and CI md-deck versions match

## Common failures

- Generator or style “fixes” make premises correct but add whitespace so the deck feels emptier
- Replacing a figure with a thin table leaves large empty regions
- Sentence-length node labels, a column heading held to the 12-character box-label cap, paragraphs inside a `::: columns panel`, or a branch written as one `AまたはB` label
- Filling budget whitespace with extra words instead of enlarging the boxes or the type
- Cover title wrapped mid-phrase, or split with a trailing backslash instead of `\n`
- Shipping a flow slide whose arrows run into corners
- Local md-deck version differs from CI
- Comparing sources only and skipping the Release / review PDF and the cover / flow PNGs
- Cutting a tag before the owner reviews the PDF
- Adding a deck `CHANGELOG.md` (skip; use PR description and Release notes)

## Verification notes

- If GitHub Actions artifacts are unavailable, rebuild on a box with the PR head and the pinned md-deck, and say so in the report. Include the cover PNG and every flow slide (`md-deck build --png`).
- Page rasters and side-by-side PNGs work well for visual diffs.

## Success criteria

- Brief (count, goals, forbids) honored
- Copy budget, diagram recipes, and cover-title breaks followed
- Style and content split respected; wording unchanged when the ask was visual-only
- Same pinned md-deck in check/build locally and in CI
- Cover PNG and every flow slide reviewed (`md-deck build --png`); an arrow into a corner is a failed review
- PDF attached for review before merge/tag; owner OK before release
