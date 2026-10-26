---
name: english-tech-blog-structure
description: >-
  Use when writing, adapting, or reviewing an English technical blog post or
  long-form article for engineers (LinkedIn articles, dev blogs, guest posts).
  Covers structure, openings, headings, technical quality, titles, and closings;
  pair with the humanizer skill for sentence-level AI tells.
---
# English technical blog structure

Adapted from the structural sections of getsentry/skills `blog-writing-guide` (Apache-2.0, https://github.com/getsentry/skills/blob/main/skills/blog-writing-guide/SKILL.md), with company voice, branding, and SEO advice removed. Use together with the `humanizer` skill, which handles sentence-level AI-writing patterns.

**The bar:** a post a senior engineer would share with their team or cite in a technical decision.

## Opening (first 2-3 sentences)
State the problem or state the conclusion. Never open with background, company history, or hype, and never with "In this post we will explore...".

## Structure: follow the reader's questions
1. What problem does this solve? (1-2 paragraphs)
2. How does it actually work? The underlying mechanism, not button clicks. This is the bulk of the post; be specific.
3. What were the trade-offs and alternatives, and why weren't they chosen?
4. How do I use, try, or implement this? Concrete next steps.

For deep dives, also cover:
5. What did we try that didn't work?
6. What are the known limitations?

## Paragraphs and formatting
- One idea per paragraph. Short paragraphs keep people reading.
- Break the paragraph at a contrast point ("but", "however", a shift in perspective) so the turn isn't buried.
- Avoid em dashes; use commas, periods, or line breaks.

## Headings carry information
Weak: "Background", "Architecture", "Results", "Conclusion".
Strong: a heading that names the specific topic or claim, e.g. "Why pre-aggregation destroys debugging context", "Where this breaks down: the cardinality wall".

## Technical quality
- Numbers over adjectives: every performance claim carries its number and source. Never invent or round up numbers. When the post cites LLM or pipeline evaluation numbers, read and apply `llm-evaluation`.
- Code must work: tested, with imports, configuration, and context. Comments explain why, not what.
- Describe a system with more than two interacting components with a diagram labeled with real component names.
- Honesty over hype: don't overstate what something does, say when something is a prototype or beta, acknowledge limitations, and credit alternatives that do something well.

## Titles
Make a specific claim, tell a story, or promise a specific payoff. Avoid vague announcements ("Introducing X", "Improvements to Y").

## Closing
End with something useful: a link to docs or source, a way to try it, or a request for specific feedback. Connect back to the opening problem. No generic hype, no recap of what was just said.

## "Would I share this?" test
A shareable post contains at least one of: a technical decision explained with trade-offs; original data not found elsewhere; a real debugging story with specifics; an honest account of what went wrong; a how-to that saves real time.

## Review checklist
Technical: claims accurate, code works, architecture descriptions match the real system, numbers correct (LLM and eval figures follow `llm-evaluation`), no oversimplification an expert would wince at.
Editorial: opening hooks within 2 sentences, passes the share test, no corporate filler, headings informative, length fits (not padded, not thin), title specific.
When giving feedback, quote the weak passage, say why it is weak, and rewrite it.
