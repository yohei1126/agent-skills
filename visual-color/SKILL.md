---
name: visual-color
description: >-
  Use when any visual needs a professional palette: md-deck theme selection,
  article cover images, inline diagrams, or generated images (Zenn, LinkedIn,
  Dev.to, and slide decks). Canonical palette is dark-blue. Eyebrows use the
  secondary accent. Ordinary dashes use the arrow colour. Gap emphasis
  (style=gap) uses the accent. Dashed card outlines use
  color_dashed_outline. Plain white and black
  is for eval and regression only. Do not put customer names or subject
  claims here.
---
# Visual color

Shared palette for professional visuals. The same tokens apply to slide decks and to article covers, diagrams, and generated images. This skill names the colours and when to use them. It does not ship CSS. It is independent of any one deck, article, or subject.

Process and structure rules for those figures: [visual-diagram](https://github.com/yohei1126/agent-skills/blob/main/visual-diagram/SKILL.md). Slide markup: [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md).

## When to use

Load this skill for any visual that needs a professional palette:

- An md-deck theme, or a `deck_style` theme selection
- An article cover (Zenn, LinkedIn, Dev.to)
- An inline diagram
- A generated image

## Palette `dark-blue`

Canonical tokens. Background is off-white, not pure white.

| Role | HEX | Use |
| :--- | :--- | :--- |
| Background / off-white | `#EDE8E4` | Page and image ground |
| Text | `#333333` | Body text |
| Main / navy | `#073365` | Titles, structure, diagram strokes, and ordinary dashed edges (`--color-flow-arrow`) |
| Accent | `#F7581D` | Highlights, calls to action, caution, and gap emphasis (`[style=gap]`, `--color-edge-gap`) |
| Secondary accent | `#1A6B7A` | Eyebrows and other quiet labels (`--color-accent-2`). On this theme, also the `{.dashed}` card outline (`--color-dashed-outline`) |

Area split: about 60% background, about 30% text and structure, about 10% accent. The secondary accent colours eyebrows and, on `dark-blue`, the dashed card outline. The accent share stays the highlights, including gap emphasis.

## Ops rules

- Customer-facing decks, and public article covers and diagrams, use `dark-blue`.
- Plain white and black is for evaluation and visual regression only. Do not use it for a customer-facing or public visual.
- An eyebrow uses the secondary accent (`--color-accent-2`, `#1A6B7A` on `dark-blue`).
- An ordinary dashed edge (`..>`, `-.[label].->`) uses the arrow colour (`--color-flow-arrow`, navy `#073365` on `dark-blue`).
- Gap emphasis uses the accent (`--color-edge-gap`, `#F7581D` on `dark-blue`) only when that dashed edge has `[style=gap]`. The shaft is `0.5px` thicker than the arrow shaft, and the dash is tighter. Markup: [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md).
- A `{.dashed}` card outline uses `--color-dashed-outline` and `--dashed-outline-width`. On `dark-blue` the colour is the secondary accent `#1A6B7A` and the width is `2.5px` when the token is omitted. Plain is `#333333` at `2px`. Those defaults are darker and thicker than the earlier card-border dash. A deck overrides `color_dashed_outline` and `dashed_outline_width`. Markup: [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md).

## How consumers apply

- **md-deck.** Select theme `dark-blue` in `deck_style`. The theme CSS lives in md-deck. This skill does not ship that CSS. Authoring rules: [md-deck](https://github.com/yohei1126/agent-skills/blob/main/md-deck/SKILL.md).
- **Articles and image generation.** Pass these HEX values and roles into the image prompt for a cover or a diagram. Keep the ground off-white, the structure navy (including an ordinary dash), the accent for a gap emphasis or a highlight, and the secondary accent for a section label and for a dashed card outline.

## Sources

- [Theme color samples](https://ppt.design4u.jp/theme-color-samples/) — dark-blue HEX roles. The site is closed; use the [Wayback snapshot](https://web.archive.org/web/2024/https://ppt.design4u.jp/theme-color-samples/).
- [PowerPoint color schemes](https://deckary.com/blog/powerpoint-color-schemes) — navy, gray, and one accent (60-30-10).
- [Slide accessibility guidance](https://www.cctl.cam.ac.uk/slide-accessibility-guidance) — avoid a pure white background; prefer navy on off-white.
- [Digital Agency design system: color](https://design.digital.go.jp/dads/foundations/color/) — token roles.
