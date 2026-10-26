---
name: devto-article
description: Write, revise, or draft-register English technical articles for dev.to. Do not include API keys or bot-specific ops.
---
# dev.to articles

Generic workflow for writing and revising English technical articles for [dev.to](https://dev.to). Put environment-specific ops—API key storage, repo paths, which model to use—in each assistant's shared rules, not here.

## When to use

- Write a new dev.to article
- Adapt an English article from another channel (for example LinkedIn) for dev.to
- Check a draft before or after registering it as an unpublished draft via the API

## English writing rules

1. Body language is English.
2. Before drafting or revising, read:
   - `english-tech-blog-structure` — structure, headings, titles, closings, technical honesty
   - `humanizer` — strip sentence-level AI tells
   - `llm-evaluation` — when the draft cites eval or LLM measurement numbers
3. When the same piece also goes to LinkedIn, keep claims and numbers aligned; change only channel constraints (headings, cover image, series UI).

## DEV front matter

Example YAML at the top of the article, or in a separate meta file (see Cross-posting):

```yaml
---
title: Specific claim or payoff
published: false
tags: neo4j, knowledgegraph, llm, cypher
canonical_url: https://www.linkedin.com/pulse/...
series: Ontographia
---
```

- Drafts must keep `published: false`. Only the owner flips the flag or hits publish
- `tags` are lowercase English, following site conventions. Aim for up to 4 tags for API registration. Forem/Dev.to create accepts at most 4 tags. If a fifth is desired for humans, note it in the file only; it cannot be sent on create
- When the piece already published elsewhere, set `canonical_url` to that first URL (for a LinkedIn cross-post, the LinkedIn Pulse URL)
- For a series, use `series` so it appears in DEV's series feature

## Titles and slugs

- Titles should state a concrete claim or payoff. Avoid vague launch phrasing
- Do not put version numbers in the title or URL slug
- For a series, Part N in the title is fine

## Article shape

Follow `english-tech-blog-structure`. DEV-specific extras:

- Open with the problem or conclusion in 2–3 sentences. Do not start with meta foreshadowing
- For a series, place the series position (links to other parts) near the top
- For a general audience, prefer Releases, docs, and the main repository over individual PRs
- Markdown tables and fenced code are fine. Mermaid is environment-dependent, so also provide important diagrams as images or short text figures
- Use a cover image only when rights are clear
- Covers and diagrams: load `visual-color` and `visual-diagram`.

## Cross-posting (LinkedIn → DEV)

Common order:

1. Publish on LinkedIn
2. Wait a few days, then post on DEV
3. Set DEV `canonical_url` to the first-published LinkedIn Pulse URL
4. Keep claims, numbers, and how limits are stated aligned; change only channel greetings and series UI

Series TOC links for published parts may keep the LinkedIn Pulse URLs.

If DEV ships first, set `canonical_url` on the later channel to the URL that published first.

### Meta-only layout

For a LinkedIn → DEV cross-post, the LinkedIn article Markdown can remain the canonical body. Registration metadata may live separately (for example `devto/<series>/YYYY-MM-DD-….yml`) with `title`, `published: false`, `tags`, `canonical_url`, `series`, and `source` pointing at the LinkedIn path. Do not require a full copy of the article under `devto/`.

## Drafting via the API

- Do this only when the owner asks to register a draft on DEV
- Create unpublished (draft) only. Do not call a publish API. Keep `published: false`
- Send at most 4 tags. A fifth noted for humans stays out of the create payload
- A repo may provide a script (example name `scripts/devto_payload.py`) that prints API JSON from the meta file and the LinkedIn source. The script does not call the API. Registration is a separate step, still with `published: false`
- Before creating, check `GET /api/articles/me/unpublished` for an existing draft of the same piece
- After create, verify with `GET /api/articles/me/unpublished`, and confirm the article is not in published (`GET /api/articles/me/published`). A public `GET /api/articles/{id}` can 404 while the article is unpublished
- After registration, give the owner the draft URL or ID and leave publishing to them

## Honesty

- Do not exaggerate. State limits
- Use numbers only from measurement logs or public sources
- Do not promise unconfirmed publish dates
- Do not add consulting-style CTAs
- Do not write as if you verified something you did not verify

## Success criteria

- Passed `english-tech-blog-structure` and `humanizer`
- Front matter or separate meta matches the shape above (`published: false`; at most 4 tags on the API payload)
- For a cross-post, `canonical_url` points at the earlier URL
- Includes at least one of: trade-offs, measured results, a failure story, or reproduction steps
