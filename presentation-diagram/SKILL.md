---
name: presentation-diagram
description: >-
  Use when a figure shows a process or a structure: an md-deck flow or
  columns, or an article diagram or cover. Reading order, short labels,
  split complex branches, and a text equivalent. Palette lives in
  presentation-color. Do not put customer names or subject claims here.
---
# Presentation diagram

Authoring rules for a process or structure figure, on a slide or in an article. This skill does not ship CSS. It is independent of any one deck, article, or subject.

Palette: [presentation-color](../presentation-color/SKILL.md).

## When to use

- An md-deck `::: flow` or `::: columns` that shows a process or a comparison
- An article diagram or cover that shows steps, a branch, or a structure

## Principles

- Read left to right, then top to bottom. Show a clear start.
- Use few shape types. Keep lines from crossing or overlapping.
- Do not carry meaning by colour alone. Pair a colour with a label or a shape.
- Prefer a short node label. When a branch gets hard to follow, split it into more than one diagram.
- Put important information in the text as well as in the figure. The diagram is not the only copy of a fact.
- In an article, add a linear equivalent in reading order: a list or headings.

## How consumers apply

- **md-deck.** Keep the generator recipes in [md-deck](../md-deck/SKILL.md): `::: columns panel` for a 2-box compare, `::: flow wide` for a 3-step row, and a branch as separate edges into a stack. Markup: [DIAGRAMS.md](https://github.com/yohei1126/md-deck/blob/main/docs/DIAGRAMS.md). Do not invent a new diagram language.
- **Articles.** Draw the same reading order and the same short labels. Follow the figure with the list or headings that restate it.

## Sources / 参考

- [Diagram design (ONS Service Manual)](https://service-manual.ons.gov.uk/brand-guidelines/application/diagram-design) — primary: reading order, a clear start, few shapes, lines that do not overlap.
- [デジタル庁｜画像](https://design.digital.go.jp/dads/components/image/) — do not convey critical information by the image alone.
- [Charts and flowcharts (UMass Dartmouth)](https://www.umassd.edu/accessibility/digital-accessibility/charts/) — give a flowchart a text equivalent.
- [Flowchart accessibility (MNIT)](https://mn.gov/mnit/about-mnit/accessibility/news/?id=38-436349) — split a complex flow; provide an alt or text version.

## Related

Not part of the source list above.

- [プレゼンテーション指導指針 (IEICE WIT)](https://www.ieice.org/~wit/guidelines/index02.html) — delivery checklist for a spoken presentation.
