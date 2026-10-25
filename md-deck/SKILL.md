---
name: md-deck
description: >-
  Use when creating or revising slide decks with md-deck (Markdown → PDF):
  workflow, style vs content split, spacing density, review before tag/release,
  and common failure modes. Do not put customer names or proposal content here.
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
3. Run `md-deck check`, then build the PDF with the **same pinned md-deck version** locally and in CI.
4. Open a PR and wait for CI green (`check` / build PDF).
5. On the PR branch, rebuild the PDF and attach the PDF plus comparison images for review **before** merge.
6. Merge and tag **only after** the owner has OK’d the PDF. Agents must not merge or cut tags on their own.

## Releases and tags

- Deck repos do **not** use semver for decks. Prefer tags like `YYYYMMDD-HHMM-marker` (example: `20261024-2315-lunch`).
- Legacy tags such as `deck-v1.0.0` may remain; new tags should use timestamp + marker.
- If several decks ship for the same lunch or pack, put **both PDFs on one Release** from one tag (shape CI accordingly).
- Attach PDFs to the **deck** repository’s Release, never to the md-deck generator repo.

## Visual goals

- Aim for a clean NotebookLM-like look when the deck style calls for it: white cards, navy titles, teal question boxes for discussion prompts (tokens live in the deck’s style file).
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
- Prefer column / flow / card / table structures that match the approved prototype or previous lunch deck.

## Pre-merge review checklist

- Slide count, order, and information density vs the reference PDF or previous version
- CI: check decks / build PDF succeeded
- Layout: not overly sparse; cover and diagrams not crushed
- Forbidden premises from the brief are not still on the slides
- Local and CI md-deck versions match

## Common failures

- Generator or style “fixes” make premises correct but add whitespace so the deck feels emptier
- Replacing a figure with a thin table leaves large empty regions
- Local md-deck version differs from CI
- Comparing sources only and skipping the Release / review PDF
- Cutting a tag before the owner reviews the PDF
- Adding a deck `CHANGELOG.md` (skip; use PR description and Release notes)

## Verification notes

- If GitHub Actions artifacts are unavailable, rebuild on a box with the PR head and the pinned md-deck, and say so in the report.
- Page rasters and side-by-side PNGs work well for visual diffs.

## Success criteria

- Brief (count, goals, forbids) honored
- Style and content split respected; wording unchanged when the ask was visual-only
- Same pinned md-deck in check/build locally and in CI
- PDF attached for review before merge/tag; owner OK before release
