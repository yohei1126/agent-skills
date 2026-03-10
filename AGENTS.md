# AGENTS.md

This repository is a collection of reusable agent skills following the [Agent Skills open standard](https://agentskills.io/specification).

## Repository structure

```
agent_skills/
├── AGENTS.md                          # This file
├── package.json                       # Shared Node.js dependencies for all skills
├── .env                               # Credentials (git-ignored, not readable by Claude)
├── .env.example                       # Credential template
├── .gitignore                         # Ignores: outputs/, reports/, node_modules/, .env
├── .claudeignore                      # Prevents Claude from reading .env
├── outputs/                           # Downloaded pages and generated content (git-ignored)
│   └── reference-docs/               # Fetched reference documentation
├── reports/                           # Markdown files uploaded to Confluence (git-ignored)
├── download-website-to-markdown/
│   ├── SKILL.md
│   └── scripts/
│       └── download.ts               # Playwright-based downloader
└── upload-markdown-to-confluence/
    ├── SKILL.md
    └── scripts/
        └── upload.ts                 # Confluence REST API uploader
```

## Shared dependencies

All scripts share a single `package.json` at the `agent_skills/` root. Install once:

```bash
cd agent_skills
npm install
npx playwright install chromium
```

Key dependencies:
- `playwright` — headless Chromium for JS-rendered pages
- `turndown` — HTML → Markdown conversion
- `marked` — Markdown → HTML conversion (for Confluence upload)
- `dotenv` — loads `.env` from `agent_skills/` root
- `tsx` — runs TypeScript scripts directly

## Environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```
CONFLUENCE_BASE_URL=https://yourorg.atlassian.net
CONFLUENCE_EMAIL=you@example.com
CONFLUENCE_API_TOKEN=your_api_token
CONFLUENCE_SPACE_KEY=MYSPACE
```

## Creating or modifying skills

Follow the specification at https://agentskills.io/specification.

Each skill directory must contain a `SKILL.md` with YAML frontmatter (`name`, `description`, `allowed-tools`, etc.) followed by instructions for the agent.
