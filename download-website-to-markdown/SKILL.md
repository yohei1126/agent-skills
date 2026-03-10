---
name: download-website-to-markdown
description: Downloads a website URL and saves its content as a local markdown file. Uses a headless browser (Playwright) to handle JS-rendered pages. Use when the user wants to archive a webpage, save documentation locally, or convert a web page to markdown for offline reading.
license: MIT
compatibility: Designed for Claude Code. Requires internet access and Node.js with Playwright installed.
metadata:
  author: yohei1126
  version: "1.1"
---

## Instructions

Run the download script from the `agent_skills/` directory.

### Usage

```bash
cd agent_skills
npx tsx download-website-to-markdown/scripts/download.ts <url> [output]
```

| Argument | Required | Description |
|---|---|---|
| `url` | Yes | The URL to download |
| `output` | No | Output file path. Derived from the URL if omitted. |

### Steps

1. **Run the script** with the URL and optional output path.
2. The script fetches the page using a headless Chromium browser (waits for network idle to handle JS-rendered content).
3. HTML is converted to Markdown using Turndown. Navigation, footers, scripts, and styles are stripped automatically.
4. A YAML front matter block is prepended:
   ```
   ---
   source: <original URL>
   fetched: <YYYY-MM-DD>
   ---
   ```
5. The file is saved. If the output path already exists, a numeric suffix is appended (e.g. `page-2.md`).

### Examples

```bash
# Derive filename from URL → saves to: ai-observability.md
npx tsx download-website-to-markdown/scripts/download.ts https://docs.snowflake.com/en/user-guide/snowflake-cortex/ai-observability

# Save to a specific path
npx tsx download-website-to-markdown/scripts/download.ts https://example.com outputs/reference-docs/example.md
```

### Edge cases

- If the URL is unreachable or times out (30 s), the script exits with an error and does not create a file.
- Query strings and fragments are ignored when deriving the output filename.
- If the derived filename already exists, a numeric suffix is appended rather than overwriting silently.
