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
├── confluence-operations/
│   ├── SKILL.md                       # Skill definition (frontmatter + agent instructions)
│   └── scripts/
│       ├── upload.ts                 # Confluence REST API uploader
│       └── download.ts              # Confluence REST API downloader (page → Markdown)
├── sales-agent/
│   └── SKILL.md                       # Skill definition (frontmatter + agent instructions)
└── pdf-to-markdown/
    ├── SKILL.md                       # Skill definition (frontmatter + agent instructions)
    └── scripts/
        └── convert.ts                # pdftotext-based PDF converter
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

Upload or download Confluence pages as local Markdown files.
Full reference: [docs/confluence-operations.md](docs/confluence-operations.md)

```bash
cd agent_skills
npx tsx confluence-operations/scripts/upload.ts <file.md> [--title "..."] [--parent-id <id>] [--page-id <id>]
npx tsx confluence-operations/scripts/download.ts <page-id> [output]
```

### sales-agent

Sales intelligence skill — query deals, pipeline, rep performance, and conversation transcripts via Cortex Agent and Cortex Analyst.
Uses built-in Cortex Code tools only (no custom scripts required).

### pdf-to-markdown

Converts a PDF file to Markdown using `pdftotext` (poppler). Outputs clean Markdown with YAML front matter and heading detection heuristics. Requires `brew install poppler`.

```bash
cd agent_skills
npx tsx pdf-to-markdown/scripts/convert.ts <input.pdf> [output.md]
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

Follow the [Agent Skills open specification](https://agentskills.io/specification). Key rules:

- Each skill lives in its own directory. The directory name must exactly match the `name` field in `SKILL.md`.
- `SKILL.md` must have YAML frontmatter with at minimum `name` and `description`, followed by Markdown instructions.
- `name`: lowercase letters, numbers, and hyphens only; no consecutive hyphens; max 64 characters.
- `description`: describes what the skill does and when to use it; max 1024 characters.
- Optional frontmatter fields: `license`, `compatibility`, `metadata`, `allowed-tools`.

### Validating a skill

Use `npx skills-ref validate` to check a skill against the spec before committing:

```bash
cd agent-skills
npx skills-ref validate ./<skill-name>
```

Validate all skills at once:

```bash
for d in */; do npx skills-ref validate "./${d%/}" 2>&1; done
```
