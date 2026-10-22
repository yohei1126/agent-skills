# Agent Skills

A collection of reusable agent skills following the [Agent Skills open standard](https://agentskills.io/specification).

## Skills

| Skill | Description |
|---|---|
| [download-website-to-markdown](download-website-to-markdown/) | Download a URL and save it as a local Markdown file |
| [confluence-operations](confluence-operations/) | Upload a local Markdown file to Confluence, or download a Confluence page to Markdown |
| [sales-agent](sales-agent/) | Sales intelligence skill — query deals, pipeline, rep performance, and conversation transcripts via Cortex Agent/Analyst |
| [english-tech-blog-structure](english-tech-blog-structure/) | Structure guide for English technical blog posts; pairs with [blader/humanizer](https://github.com/blader/humanizer) for sentence-level AI tells |
| [repo-security-audit](repo-security-audit/) | Audit a repository for security vulnerabilities using Cloudflare's open-source security-audit skill |
| [threat-model-attack-review](threat-model-attack-review/) | Periodic attacker-perspective review: STRIDE threat model plus executable attack scenarios |

## Quick start

```bash
npm install
npx playwright install chromium
cp .env.example .env  # fill in your Confluence credentials
```

## Documentation

- [Setup guide](docs/setup.md) — installation, environment variables
- [download-website-to-markdown](docs/download-website-to-markdown.md) — full CLI reference
- [confluence-operations](confluence-operations/SKILL.md) — upload and download CLI reference

## License

MIT. The `english-tech-blog-structure` skill includes material adapted from [getsentry/skills](https://github.com/getsentry/skills) (`blog-writing-guide`) under Apache-2.0; see [english-tech-blog-structure/NOTICE](english-tech-blog-structure/NOTICE). The `repo-security-audit` skill uses Cloudflare's MIT-licensed [security-audit-skill](https://github.com/cloudflare/security-audit-skill), which it clones at run time (nothing vendored); see [repo-security-audit/NOTICE](repo-security-audit/NOTICE).
