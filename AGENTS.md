# AGENTS.md

This repository is a collection of reusable agent skills following the [Agent Skills open standard](https://agentskills.io/specification).

## Repository structure

```
agent_skills/
├── AGENTS.md                          # This file — agent index
├── README.md                          # Human-readable overview
├── package.json                       # Shared Node.js dependencies for all skills
├── .env                               # Credentials (git-ignored, not readable by Claude)
├── .env.example                       # Credential template
├── .gitignore                         # Ignores: outputs/, reports/, node_modules/, .env
├── .claudeignore                      # Prevents Claude from reading .env
├── docs/                              # Detailed reference documentation
│   ├── setup.md                       # Installation and credential setup
│   ├── download-website-to-markdown.md
│   └── confluence-operations.md
├── outputs/                           # Downloaded pages and generated content (git-ignored)
│   └── reference-docs/               # Fetched reference documentation
├── reports/                           # Markdown files uploaded to Confluence (git-ignored)
├── download-website-to-markdown/
│   ├── SKILL.md                       # Skill definition (frontmatter + agent instructions)
│   └── scripts/
│       └── download.ts               # Playwright-based downloader
└── confluence-operations/
    ├── SKILL.md                       # Skill definition (frontmatter + agent instructions)
    └── scripts/
        ├── upload.ts                 # Confluence REST API uploader
        └── download.ts              # Confluence REST API downloader (page → Markdown)
```

## Available skills

### download-website-to-markdown

Downloads a URL to a local Markdown file using a headless Chromium browser.
Full reference: [docs/download-website-to-markdown.md](docs/download-website-to-markdown.md)

```bash
cd agent_skills
npx tsx download-website-to-markdown/scripts/download.ts <url> [output]
```

### confluence-operations

Uploads a local Markdown file to a Confluence page (create or update).
Full reference: [docs/confluence-operations.md](docs/confluence-operations.md)

```bash
cd agent_skills
npx tsx confluence-operations/scripts/upload.ts <file.md> [--title "..."] [--parent-id <id>] [--page-id <id>]
```

## Setup

See [docs/setup.md](docs/setup.md) for full installation and credential setup.

**Quick setup:**

```bash
cd agent_skills
npm install
npx playwright install chromium
cp .env.example .env   # then fill in Confluence credentials
```

## Creating or modifying skills

Follow the specification at https://agentskills.io/specification.

Each skill directory must contain a `SKILL.md` with YAML front matter (`name`, `description`, `allowed-tools`, etc.) followed by instructions for the agent.
