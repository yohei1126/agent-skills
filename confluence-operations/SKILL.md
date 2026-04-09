---
name: confluence-operations
description: Upload a local markdown file to a Confluence page, or download a Confluence page to a local markdown file. Use when the user wants to publish/sync a markdown file to Confluence, or fetch an existing Confluence page for offline editing.
license: MIT
compatibility: Designed for Claude Code. Requires network access to a Confluence instance and credentials in agent_skills/.env.
metadata:
  author: yohei1126
  version: "2.0"
---

## Prerequisites

Set the following environment variables in `agent_skills/.env`:

```
CONFLUENCE_BASE_URL=https://yourorg.atlassian.net
CONFLUENCE_EMAIL=you@example.com
CONFLUENCE_API_TOKEN=your_api_token   # from id.atlassian.com/manage-profile/security/api-tokens
CONFLUENCE_SPACE_KEY=MYSPACE
```

---

## Upload — `scripts/upload.ts`

Upload a local markdown file to Confluence as a page (create or update).

### Usage

```bash
cd agent_skills
npx tsx confluence-operations/scripts/upload.ts <markdown-file> [options]
```

### Arguments

| Argument | Required | Description |
|---|---|---|
| `markdown-file` | Yes | Path to the local `.md` file to upload |
| `--title "Title"` | No | Page title. Defaults to the first H1 heading in the file, or the filename if no H1 exists. |
| `--parent-id 12345` | No | Confluence page ID to nest the new page under |
| `--page-id 99999` | No | Update a specific existing page by ID (bypasses title search; also allows renaming the title) |

### Behavior

- The **first `#` heading** in the markdown file is extracted as the page title and stripped from the body (Confluence displays the title separately).
- A **Table of Contents** macro is automatically prepended to the page body.
- If `--page-id` is given, that page is updated directly — no title search is performed.
- Otherwise, if a page with the same title already exists in the space, it is **updated** (new version).
- If no matching page exists, a **new page** is created.
- Markdown is converted to HTML (Confluence storage format) before upload.

### Examples

```bash
# Create or update a page (title taken from first H1)
npx tsx confluence-operations/scripts/upload.ts reports/gpa-framework-guide-ja.md

# Nest under a parent page
npx tsx confluence-operations/scripts/upload.ts reports/overview-ja.md --parent-id 4890951685

# Update a specific page by ID (safe rename: avoids duplicate page on title change)
npx tsx confluence-operations/scripts/upload.ts reports/overview-ja.md --page-id 5940019259

# Override the title
npx tsx confluence-operations/scripts/upload.ts notes.md --title "Agent Eval Notes" --parent-id 98765
```

---

## Download — `scripts/download.ts`

Download a Confluence page and save it as a local markdown file.

### Usage

```bash
cd agent_skills
npx tsx confluence-operations/scripts/download.ts <page-id> [output]
```

### Arguments

| Argument | Required | Description |
|---|---|---|
| `page-id` | Yes | Confluence page ID (numeric, visible in the page URL) |
| `output` | No | Output `.md` path or directory. Derived from the page title if omitted. |

### Behavior

- Fetches the page body in Confluence storage format (HTML) via the REST API.
- Converts HTML to Markdown using Turndown (headings, tables, lists, code blocks preserved).
- Confluence macros (TOC, panels, etc.) are stripped.
- Prepends YAML front matter with `source`, `page_id`, and `fetched` fields.
- The page title is added as the first `# H1` heading in the file.
- If the output path already exists, a numeric suffix is appended (e.g. `page-2.md`).

### Examples

```bash
# Derive filename from page title → saves to: my-page-title.md
npx tsx confluence-operations/scripts/download.ts 5940019259

# Save to a specific path
npx tsx confluence-operations/scripts/download.ts 5940019259 outputs/snowflake/my-page.md

# Save into a directory (filename derived from page title)
npx tsx confluence-operations/scripts/download.ts 5940019259 outputs/snowflake/
```
