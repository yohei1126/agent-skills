---
name: upload-markdown-to-confluence
description: Uploads a local markdown file to a Confluence page. Creates a new page or updates an existing one. Use when the user wants to publish or sync a local markdown file to Confluence.
license: MIT
compatibility: Designed for Claude Code. Requires network access to a Confluence instance and credentials in agent_skills/.env.
metadata:
  author: yohei1126
  version: "1.1"
---

## Instructions

Upload a local markdown file to Confluence as a page.

### Prerequisites

Set the following environment variables in `agent_skills/.env`:

```
CONFLUENCE_BASE_URL=https://yourorg.atlassian.net
CONFLUENCE_EMAIL=you@example.com
CONFLUENCE_API_TOKEN=your_api_token   # from id.atlassian.com/manage-profile/security/api-tokens
CONFLUENCE_SPACE_KEY=MYSPACE
```

### Usage

```bash
cd agent_skills
npx tsx upload-markdown-to-confluence/scripts/upload.ts <markdown-file> [options]
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
npx tsx upload-markdown-to-confluence/scripts/upload.ts reports/gpa-framework-guide-ja.md

# Nest under a parent page
npx tsx upload-markdown-to-confluence/scripts/upload.ts reports/overview-ja.md --parent-id 4890951685

# Update a specific page by ID (safe rename: avoids duplicate page on title change)
npx tsx upload-markdown-to-confluence/scripts/upload.ts reports/overview-ja.md --page-id 5940019259

# Override the title
npx tsx upload-markdown-to-confluence/scripts/upload.ts notes.md --title "Agent Eval Notes" --parent-id 98765
```
