# Agent Skills

A collection of reusable agent skills following the [Agent Skills open standard](https://agentskills.io/specification).

## Skills

| Skill | Description |
|---|---|
| [download-website-to-markdown](download-website-to-markdown/) | Download a URL and save it as a local Markdown file |
| [confluence-operations](confluence-operations/) | Upload a local Markdown file to Confluence, or download a Confluence page to Markdown |
| [sales-agent](sales-agent/) | Sales intelligence skill — query deals, pipeline, rep performance, and conversation transcripts via Cortex Agent/Analyst |

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

MIT
