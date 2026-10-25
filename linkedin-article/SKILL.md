---
name: linkedin-article
description: Draft or revise English LinkedIn technical articles (Pulse) and feed posts. Do not include repo names, model names, or bot-specific ops.
---
# LinkedIn articles and posts

Generic workflow for drafting and revising English technical LinkedIn articles (long-form / Pulse) and feed posts. Put environment-specific ops—repo paths, which model to use, which worker writes the body—in each assistant's shared rules, not here.

## When to use

- Write or polish a LinkedIn long-form article
- Write a feed post that announces the same topic
- Adapt an article from another channel (for example Zenn) into LinkedIn English

## English writing rules

1. Default the body to English (Japanese only when the owner explicitly asks for Japanese).
2. Before drafting or revising, read both of these:
   - `english-tech-blog-structure` — structure, headings, titles, closings, technical honesty
   - `humanizer` — strip sentence-level AI tells
3. Before asking for review, apply both to any new or substantially revised draft.

## File shape

Naming guide:

```text
YYYY-MM-DD-slug-{article|post}.en.md
```

| Suffix | Role |
| :--- | :--- |
| `-article.en.md` | Long-form article body |
| `-post.en.md` | Feed post (pair with the same date and slug as the article) |

- Do not add Zenn-style front matter (`title` / `emoji` / `type` / `topics`, and so on)
- Keep Markdown only; do not turn the draft into a Google Doc
- Do not rewrite existing body text unless the owner explicitly asked for edits

## LinkedIn editor constraints

Write the draft so it can be pasted into LinkedIn's editor as Markdown.

- Do not use tables, HTML, or Mermaid (they break after paste)
- Fenced ``` code blocks in the article body are not auto-converted. When handing the draft to the owner, note that code must be entered with LinkedIn's Code button
- Feed posts have no code formatting. Keep code in the article; in the post, omit it or use one plain-language line
- Images can be added in the UI after publish. In the draft, keep diagrams to a minimum as ASCII or plain text
- Covers and diagrams: load `visual-color`

## Long-form article shape

Follow `english-tech-blog-structure`. LinkedIn-specific extras:

### Opening

State the problem or conclusion in the first 2–3 sentences. Do not open with "In this post we will explore…".

### Series

- For a series, put a short series overview near the top (for example a blockquote): part titles, focus, links to earlier/later parts, and links to the main repo or docs
- Links to unpublished later parts stay as placeholders (for example `[LINK TO PART 3]`) until those parts ship
- For a general audience, prefer Releases, docs, and the main repository over links to individual PRs

### Headings and closing

- Headings should name the question the section answers or the object it covers. Avoid bare labels like "Background" or "Conclusion"
- Close with docs / source / how to try it / a concrete ask for feedback. Do not end by restating the previous summary
- Do not add consulting-style CTAs

## Feed post shape

- 3–8 short paragraphs. Lead with the article's point, then send readers to the article link for detail
- Do not assume readers know proper nouns (for example Ontographia). Add a one-line explanation for newcomers
- End with the article URL (or a placeholder) and the repository URL
- Put a few hashtags at the end only (for example `#Neo4j #KnowledgeGraph`). Do not scatter them through the body
- Avoid heavy emoji use, hype, and promises of unconfirmed publish dates

## Titles and slugs

- Titles should state a concrete claim, story, or payoff. Avoid vague launch phrasing ("Introducing X")
- Do not put version numbers in the title or slug (mention versions in the body if needed)
- For a series, Part N in the title is fine

## Honesty

- Do not exaggerate. State limits, prototype status, and beta where they apply
- Use numbers only from measurement logs or public sources. If it was a single run, say one-run
- Do not promise unconfirmed publish dates
- Do not write as if you verified something you did not verify

## Typical human publish steps

1. Review and lock the Markdown
2. Paste the body into LinkedIn's article editor and fix code blocks by hand
3. Publish
4. Post the feed update with the article URL
5. For a series, update "Upcoming" sections or placeholder links on earlier articles

Agents stop at draft and revision. The owner presses publish.

## Success criteria

- Passed `english-tech-blog-structure` structure and `humanizer` checks
- Filenames match the article / post pattern
- No tables, HTML, or Mermaid
- Includes at least one of: trade-offs, measured results, a failure story, or reproduction steps
