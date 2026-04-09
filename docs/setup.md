# Setup

## Prerequisites

- Node.js 18+
- npm

## Installation

Run once from the `agent_skills/` root. All skills share a single `package.json`.

```bash
cd agent_skills
npm install
npx playwright install chromium
```

### Key dependencies

| Package | Purpose |
|---|---|
| `playwright` | Headless Chromium for JS-rendered pages |
| `turndown` | HTML → Markdown conversion |
| `marked` | Markdown → HTML conversion (Confluence upload) |
| `dotenv` | Loads `.env` from `agent_skills/` root |
| `tsx` | Runs TypeScript scripts directly without compilation |

## Environment variables

Copy `.env.example` to `.env` and fill in your Confluence credentials.

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `CONFLUENCE_BASE_URL` | Your Atlassian base URL, e.g. `https://yourorg.atlassian.net` |
| `CONFLUENCE_EMAIL` | Atlassian account email |
| `CONFLUENCE_API_TOKEN` | API token from [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `CONFLUENCE_SPACE_KEY` | Target Confluence space key, e.g. `MYSPACE` |

`.env` is git-ignored and excluded from Claude's context via `.claudeignore`.
Only `upload-markdown-to-confluence` requires Confluence credentials.
`download-website-to-markdown` requires no credentials — only internet access.
