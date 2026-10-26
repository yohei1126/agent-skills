---
name: llm-evaluation
description: >-
  Use when drafting or revising a technical article that reports LLM or
  pipeline evaluation measurements: accuracy, latency, token counts, cost,
  or a comparison of models or configs. Cite only supplied logs or public
  sources, state sample size and the exact condition set, and keep
  deterministic runs separate from live model runs.
---

# Reporting LLM and eval measurements

Generic guidance for drafting or revising articles that cite LLM or pipeline evaluation numbers. This skill is not a product harness. Point at the scripts and logs in the product repository instead of copying a runbook here.

## When to use

- The draft reports accuracy, latency, token, or cost numbers from an evaluation
- The draft compares models, prompts, schemas, or other configs
- You are revising a post that already quotes those measurements

Skip this skill when the article cites no measured LLM or pipeline numbers.

## Rules

1. Never invent, round up, or fabricate a number. Use only measurement logs, scripts, or public sources the author supplies. If a figure is missing, leave it out or say it was not measured.
2. State the sample size. One run is a one-run or single run. Two or more runs get the mean and the min–max (or an equivalent range), plus how many runs.
3. Name the exact condition set, enough to reproduce: model id as measured, prompt or schema policy, dataset, track, or split, and package or version when it matters.
4. Keep deterministic or mechanical arms separate from live LLM arms. Do not remeasure one as the other, and do not blend them as if they were the same kind of run.
5. Do not treat one condition as proof about other models or versions. Say what held under the measured condition and what did not.
6. Prefer a pointer to the harness or scripts in the product repository. Do not embed a long runbook in the article or in this skill.
7. Keep the write-up reusable. Leave out assistant-specific operations, private marketing strategy, and paths that exist only for one assistant.

## What to write next to each number

- The quantity and its unit
- Where it came from (log, script output, or public source the author supplied)
- How many runs, and whether the figure is a single run or a mean with a range
- The condition set from rule 3
- Whether the arm was deterministic or mechanical, or a live model call

If the author did not supply a source, do not fill the gap with a plausible value.

## Pre-publish checklist

- [ ] Every number traces to a log, script, or public source the author supplied
- [ ] Nothing was invented, rounded up, or filled in because it looked reasonable
- [ ] Sample size is explicit (one-run, or mean plus min–max and the run count)
- [ ] Model id, prompt or schema policy, dataset or split, and relevant versions are named
- [ ] Deterministic arms and live LLM arms stay separate
- [ ] Claims stay inside the measured condition, including what failed or was not tried
- [ ] Reproduction detail points at the product harness or scripts
