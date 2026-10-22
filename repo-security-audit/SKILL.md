---
name: repo-security-audit
description: >-
  When auditing a code repository for security vulnerabilities (full audit,
  pen-test style review, or a quick security pass), or triaging whether a
  reported vulnerability really matters. Uses Cloudflare's open-source
  security-audit skill.
---
# Repo security audit (Cloudflare security-audit skill)

Source: https://github.com/cloudflare/security-audit-skill (MIT). The skill lives in `skills/security-audit/` (SKILL.md plus companion files RECONNAISSANCE.md, HUNTING.md, ATTACK-CLASSES.md, VALIDATION-AND-REPORTING.md, domain companions, report-schema.json and the two validators).

## Two modes
- **Guidance mode** (default): for triaging one alert, a dependency advisory, or a focused question. Read only SKILL.md's core principles and the relevant companion file. No output directory, no artifacts. Apply its rules: a finding needs a lower-trust principal, a crossed boundary and a concrete result; missing best practices are hardening notes, not vulnerabilities; severity follows the critical/high/medium/low anchors in SKILL.md.
- **Full audit mode**: only when an audit, pen test, or report is explicitly requested. Run all six phases.

## Running a full audit
1. Do repository work in a cloud coding agent on the target repo, not on the user's computer.
2. In the agent's prompt, tell it to:
   - `git clone --depth 1 https://github.com/cloudflare/security-audit-skill` outside the target repo and follow `skills/security-audit/SKILL.md` in full audit mode;
   - use the profile asked for (default `quick` for a first look, `standard` otherwise) and state it in the report;
   - write the output directory outside the target (or in a git-ignored path), run `validate-findings.cjs` and `validate-coverage-ledger.cjs` with Node;
   - not modify target source, not open a fix PR, not probe deployed endpoints or live services; if an OS-enforced sandbox is unavailable, do not execute target code and keep those leads as `needs_validation`;
   - save `REPORT.md`, `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md` and `findings.json` as artifacts and return a short summary: confirmed findings by severity, needs-validation items, and coverage gaps.
3. Relay the result to the user in their language: confirmed findings first with severity and the smallest fix, then items needing validation. Offer fix PRs separately; never make them as part of the audit.
4. Repeated runs are additive (a single run finds roughly half of what repeated runs find), so keep prior run outputs and pass them to later runs.
