---
name: download-website-to-markdown
description: Downloads a website URL and saves its content as a local markdown file. Uses a headless browser (Playwright) to handle JS-rendered pages. Also includes a PDF-to-Markdown converter using Docling. Use when the user wants to archive a webpage or PDF, save documentation locally, or convert web/PDF content to markdown for offline reading.
license: MIT
compatibility: Designed for Claude Code. Requires internet access and Node.js with Playwright installed. PDF conversion requires Python 3.10+ and uv.
metadata:
  author: yohei1126
  version: "1.2"
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

---

## PDF to Markdown (`pdf-to-markdown.py`)

Converts a remote or local PDF to Markdown using [Docling](https://github.com/DS4SD/docling), which preserves document structure (headings, tables, lists, code blocks).

### Requirements

- Python 3.10+
- [`uv`](https://docs.astral.sh/uv/) — dependencies (`docling`, `requests`) are declared inline and installed automatically on first run.

### Usage

```bash
cd agent_skills
uv run download-website-to-markdown/scripts/pdf-to-markdown.py <pdf-url-or-path> [output]
```

| Argument | Required | Description |
|---|---|---|
| `pdf-url-or-path` | Yes | Remote URL (`https://…`) or local file path to a PDF |
| `output` | No | Output `.md` path or directory. Derived from the PDF filename if omitted. |

### Steps

1. **Run the script** with the PDF URL or local path and an optional output path.
2. If a URL is given, the PDF is downloaded to a temporary file.
3. Docling converts the PDF to Markdown, preserving structure (headings, tables, code blocks).
4. A YAML front matter block is prepended:
   ```
   ---
   source: <original URL or path>
   fetched: <YYYY-MM-DD>
   ---
   ```
5. The file is saved. If the output path already exists, a numeric suffix is appended (e.g. `paper-2.md`).

### Examples

```bash
# Remote PDF — filename derived from URL → saves to: 2310.06825.md
uv run download-website-to-markdown/scripts/pdf-to-markdown.py https://arxiv.org/pdf/2310.06825

# Save to a specific path
uv run download-website-to-markdown/scripts/pdf-to-markdown.py https://example.com/spec.pdf outputs/spec.md

# Save into a directory (filename derived automatically)
uv run download-website-to-markdown/scripts/pdf-to-markdown.py report.pdf outputs/
```

### Edge cases

- Remote PDFs are downloaded to a temp file and deleted after conversion.
- `.pdf` is stripped from the derived filename so the output is `paper.md`, not `paper.pdf.md`.
- If the output path already exists, a numeric suffix is appended rather than overwriting silently.
