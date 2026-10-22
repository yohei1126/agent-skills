---
name: threat-model-attack-review
description: >-
  When doing a periodic (e.g. quarterly) attacker-perspective security review of
  a repository: build a STRIDE threat model, then try concrete attack scenarios
  against the code with executable tests, and report only what actually
  reproduces. Complements a code-reading audit such as repo-security-audit; also
  has a lighter release-diff mode.
---
# Threat model + attack scenario review

The point is a different angle from a code-reading audit: start from what an attacker wants, work back to the code, and prove each issue with a runnable test. Run it in a cloud coding agent on the target repo, never on the user's computer. If possible use a different model than the one used for the regular code-reading audit, so the blind spots overlap less.

## Modes
- **Full (quarterly):** steps 1-6 on the whole repo.
- **Release diff:** only the changes since the last release tag. Do step 1 briefly (reuse the previous threat model if one is saved), then check the diff against the threat model and OWASP ASVS L2 (or the closest relevant section for a CLI or library) and run steps 4-6 just for what the diff touches.

## Steps for the cloud agent
1. **System map.** Read README, docs and entry points. List the assets (keys, signed records, user data, the credibility of outputs), the actors (anonymous user, authenticated user, other tenant, operator, CI or supply chain, malicious input file), the entry points (HTTP/MCP/CLI args/env/files/network/IPC) and the trust boundaries between them. Draw a mermaid data-flow diagram.
2. **STRIDE threat model.** For each boundary, list threats under Spoofing, Tampering, Repudiation, Information disclosure, Denial of service and Elevation of privilege. Each threat names the actor, the target asset and the concrete bad outcome. Rate likelihood and impact (H/M/L).
3. **Map controls.** For each threat, find the code that is meant to stop it (file:line). Mark each one as covered, partial, missing, or not applicable. The partial and missing ones become attack candidates.
4. **Attack scenarios.** For each candidate (highest risk first, up to about 15), write an attack scenario: the precondition, the attacker's steps, and the expected bad result. Then turn it into an executable test or PoC in the repo's own test framework (unit, integration, fuzz/property test, or a crafted input file). Run it locally in the agent's sandbox only. Never probe deployed services, real endpoints or third-party systems.
5. **Classify.** A test that shows the bad result is **confirmed**. One that is blocked is **refuted**: keep it as a regression test if cheap, and record which control stopped it. One that couldn't be run is **needs validation**. Severity uses the critical/high/medium/low anchors of the repo-security-audit skill. A missing best practice with no concrete attack is a hardening note, not a finding.
6. **Report.** Save `THREAT-MODEL.md` (map, diagram, STRIDE table with control mapping) and `ATTACK-REPORT.md` (confirmed findings with repro test, smallest fix and severity; then needs validation; refuted scenarios; hardening notes; what wasn't covered) as artifacts. Don't modify target source on the default branch and don't open a fix PR as part of the review. Repro tests may live on a review branch or in the artifacts.

## Afterwards
- Relay the result to the user in their language, confirmed findings first. Offer fix PRs separately (test first, then fix).
- Keep THREAT-MODEL.md from each run and hand it to the next run so the model evolves instead of starting over.
- When something is confirmed, also search for the same pattern elsewhere (variant analysis) and suggest human review if it touches a core trust guarantee.
