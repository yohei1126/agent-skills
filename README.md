# Agent Skills

A collection of reusable agent skills following the [Agent Skills open standard](https://agentskills.io/specification).

## Skills

### [download-website-to-markdown](download-website-to-markdown/)

Downloads a website and saves it as a local Markdown file.

- Uses a headless Chromium browser (Playwright) to handle JS-rendered pages
- Strips navigation, footers, and boilerplate automatically
- Prepends YAML front matter (`source`, `fetched`)
- Appends a numeric suffix instead of overwriting existing files

```bash
npx tsx download-website-to-markdown/scripts/download.ts <url> [output]
```

### [upload-markdown-to-confluence](upload-markdown-to-confluence/)

Uploads a local Markdown file to a Confluence page.

- Extracts the first `#` heading as the page title (stripped from body)
- Automatically inserts a Table of Contents macro
- Creates a new page or updates an existing one by title
- `--page-id` for direct update by page ID (safe for title renames)
- `--parent-id` to nest under a parent page

```bash
npx tsx upload-markdown-to-confluence/scripts/upload.ts <file.md> [--title "..."] [--parent-id 12345] [--page-id 99999]
```

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and fill in your Confluence credentials:

```
CONFLUENCE_BASE_URL=https://yourorg.atlassian.net
CONFLUENCE_EMAIL=you@example.com
CONFLUENCE_API_TOKEN=your_api_token
CONFLUENCE_SPACE_KEY=MYSPACE
```

## License

MIT
