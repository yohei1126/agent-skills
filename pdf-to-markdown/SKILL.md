---
name: pdf-to-markdown
description: Converts a PDF file to a Markdown file. Uses pdftotext (poppler) to extract text with layout preservation, then applies heuristics to identify headings and format the output as clean Markdown with YAML front matter. Use when the user wants to convert a PDF document to Markdown for editing, archiving, or ingestion into a knowledge base.
license: MIT
compatibility: Designed for Claude Code. Requires pdftotext (poppler) installed on the system (e.g. `brew install poppler` on macOS).
metadata:
  author: yohei1126
  version: "1.0"
---

## Prerequisites

Install poppler if not already present:

```bash
brew install poppler   # macOS
# or: apt-get install poppler-utils  # Debian/Ubuntu
```

## Instructions

Run the conversion script from the `agent-skills/` directory.

### Usage

```bash
cd agent-skills
npx tsx pdf-to-markdown/scripts/convert.ts <input.pdf> [output.md]
```

| Argument | Required | Description |
|---|---|---|
| `input.pdf` | Yes | Path to the source PDF file |
| `output.md` | No | Output file path. Derived from the input filename if omitted (same directory, `.md` extension). |

### Steps

1. **Run the script** with the PDF path and optional output path.
2. `pdftotext` extracts text with `-layout` (preserves column spacing) and `-nopgbrk` (removes form-feed characters).
3. Heuristics detect headings: short, ALL-CAPS lines surrounded by blank lines become `##` headings.
4. A YAML front matter block is prepended:
   ```
   ---
   source: <original filename>
   converted: <YYYY-MM-DD>
   ---
   ```
5. The file is saved. If the output path already exists, a numeric suffix is appended (e.g. `report-2.md`).

### Examples

```bash
# Derive output from input → saves to: documaris/_inputs/report.md
npx tsx pdf-to-markdown/scripts/convert.ts documaris/_inputs/report.pdf

# Save to a specific path
npx tsx pdf-to-markdown/scripts/convert.ts documaris/_inputs/report.pdf docs/report.md
```

### Edge cases

- If `pdftotext` is not installed, the script exits with an error message.
- If the input PDF does not exist, the script exits with an error.
- Scanned/image-only PDFs will produce empty or near-empty output (no OCR is performed).
- If the derived output path already exists, a numeric suffix is appended rather than overwriting.
