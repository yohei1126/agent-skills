---
name: presentation-color
description: >-
  Use when any visual needs a professional palette: md-deck theme selection,
  article cover images, inline diagrams, or generated images (Zenn, LinkedIn,
  Dev.to, and slide decks). Canonical palette is dark-blue. Plain white and
  black is for eval and regression only. Do not put customer names or subject
  claims here.
---
# Presentation color

Shared palette for professional visuals. The same tokens apply to slide decks and to article covers, diagrams, and generated images. This skill names the colours and when to use them. It does not ship CSS. It is independent of any one deck, article, or subject.

Process and structure rules for those figures: [presentation-diagram](../presentation-diagram/SKILL.md).

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
| Main / navy | `#073365` | Titles, structure, diagram strokes |
| Accent | `#F7581D` | Highlights, calls to action, caution |

Area split: about 60% background, about 30% text and structure, about 10% accent.

## Ops rules

- Customer-facing decks, and public article covers and diagrams, use `dark-blue`.
- Plain white and black is for evaluation and visual regression only. Do not use it for a customer-facing or public visual.

## How consumers apply

- **md-deck.** Select theme `dark-blue` in `deck_style`. The theme CSS lives in md-deck. This skill does not ship that CSS.
- **Articles and image generation.** Pass these HEX values and roles into the image prompt for a cover or a diagram. Keep the ground off-white, the structure navy, and a single accent.

## Sources / 参考

- [Theme color samples](https://ppt.design4u.jp/theme-color-samples/) — dark-blue HEX roles. The site is closed; use the [Wayback snapshot](https://web.archive.org/web/2024/https://ppt.design4u.jp/theme-color-samples/).
- [PowerPoint color schemes](https://deckary.com/blog/powerpoint-color-schemes) — navy, gray, and one accent (60-30-10).
- [Slide accessibility guidance](https://www.cctl.cam.ac.uk/slide-accessibility-guidance) — avoid a pure white background; prefer navy on off-white.
- [デジタル庁｜カラー](https://design.digital.go.jp/dads/foundations/color/) — token roles.
