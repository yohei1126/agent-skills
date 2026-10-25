---
name: visual-diagram
description: >-
  Use when a figure shows a process or a structure: an md-deck flow or
  columns, or an article diagram or cover. Reading order, short labels,
  a corner index outside the name, one dashed gap, a dashed quieter card,
  content-height compare cards, split complex branches, and a text
  equivalent. Palette lives in visual-color. Markup lives in md-deck. Do
  not put customer names or subject claims here.
---
# Visual diagram

Authoring rules for a process or structure figure, on a slide or in an article. This skill does not ship CSS. It is independent of any one deck, article, or subject.

Palette: [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). Slide markup: [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md).

## When to use

- An md-deck `::: flow` or `::: columns` that shows a process or a comparison
- An article diagram or cover that shows steps, a branch, or a structure

## Principles

- Read left to right, then top to bottom. Show a clear start.
- Use few shape types. Keep lines from crossing or overlapping.
- Do not carry meaning by colour alone. Pair a colour with a label or a shape.
- Prefer a short node label on a new diagram. When a branch gets hard to follow, split it into more than one diagram.
- When rebuilding a figure from a transcript or other source, the source wording wins over a length cap. Wrap with a newline. Do not cut a sentence, and do not drop a note or a side arrow, only to meet a cap such as ≤12. On an md-deck label the newline is `\n`.
- Centre the figure as one group. Put a box that relates to one other box directly under or beside it.
- Draw an arrow straight when its two ends line up. Every arrow needs a visible shaft; an arrowhead alone reads as a triangle.
- Keep each label next to what it names. Do not repeat the same words as a group label and an arrow label.
- Put a step number outside the name. On a slide that is a leading circled digit with a real title (`① Intake`), or `{1}` / `{①}`. A word badge such as `{draft}` or `{v1}` stays with the name. A title that is only the circled digit stays the name. ASCII digits inside the title are not an index. One index per box.
- Put a gap on the connection where it happens: one dashed link between the two parties, with the annotation on that link. That link is the emphasis and uses the gap colour from [visual-color](https://github.com/yohei1126/agent-skills/blob/main/visual-color/SKILL.md). Other connections stay solid. Do not draw the gap as another box.
- A quieter compare card uses a dashed outline on that card, and may also be muted. The dashed outline is not the missing-step link.
- In a compare, keep each card at content height. Stretch the row only when the layout asks to fill. Do not thin the body copy to make the row look dense.
- When a box stands for something that lives somewhere (evidence, data, documents), say where.
- Put important information in the text as well as in the figure. The diagram is not the only copy of a fact.
- In an article, add a linear equivalent in reading order: a list or headings.

## How consumers apply

- **md-deck.** Keep the generator recipes in [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md): `::: columns panel` for a 2-box compare, `::: flow wide` for a 3-step row, a branch as separate edges into a stack, a corner index (`① Name` or `{1}` / `{①}`) or `steps`, one dashed link (`-.[label].->` or `link: a ..>`) for a gap, and `## Quiet {.dashed}` for a quieter card. Markup: [DIAGRAMS.md](https://github.com/yohei1126/md-deck/blob/main/docs/DIAGRAMS.md). Do not invent a new diagram language.
- **Articles.** Draw the same reading order, the same short labels, one index outside the name, one dashed gap in the gap colour, and a dashed outline on a quieter card. Keep compare cards at content height. Follow the figure with the list or headings that restate it.

## Sources

- [Diagram design (ONS Service Manual)](https://service-manual.ons.gov.uk/brand-guidelines/application/diagram-design) — primary: reading order, a clear start, few shapes, lines that do not overlap.
- [Digital Agency design system: images](https://design.digital.go.jp/dads/components/image/) — do not convey critical information by the image alone.
- [Charts and flowcharts (UMass Dartmouth)](https://www.umassd.edu/accessibility/digital-accessibility/charts/) — give a flowchart a text equivalent.
- [Flowchart accessibility (MNIT)](https://mn.gov/mnit/about-mnit/accessibility/news/?id=38-436349) — split a complex flow; provide an alt or text version.

## Related

Not part of the source list above.

- [IEICE WIT presentation guidelines](https://www.ieice.org/~wit/guidelines/index02.html) — delivery checklist for a spoken presentation.
