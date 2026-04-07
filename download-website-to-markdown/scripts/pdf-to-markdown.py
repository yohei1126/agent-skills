#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["docling", "requests"]
# ///
"""
Convert a remote (or local) PDF to a Markdown file using Docling.

Usage:
    uv run pdf-to-markdown.py <pdf-url-or-path> [output]

Arguments:
    pdf-url-or-path  Remote URL (https://…) or local file path to a PDF.
    output           Output .md path (optional).
                     - If omitted, derived from the filename in the URL/path.
                     - If a directory, the derived filename is placed inside it.
                     - If the destination already exists, a numeric suffix is added
                       (e.g. paper-2.md) rather than overwriting silently.

Examples:
    uv run pdf-to-markdown.py https://arxiv.org/pdf/2310.06825
    uv run pdf-to-markdown.py report.pdf outputs/report.md
    uv run pdf-to-markdown.py https://example.com/spec.pdf outputs/
"""

from __future__ import annotations

import os
import sys
import tempfile
import urllib.parse
from datetime import date
from pathlib import Path

import requests
from docling.document_converter import DocumentConverter


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def derive_filename(source: str) -> str:
    """Derive a .md filename from a URL or file path."""
    if source.startswith("http://") or source.startswith("https://"):
        parsed = urllib.parse.urlparse(source)
        segments = parsed.path.rstrip("/").split("/")
        name = next((s for s in reversed(segments) if s), parsed.netloc.replace(".", "-"))
    else:
        name = Path(source).stem
    safe = name.replace(" ", "-")
    for ch in ("?", "#", "&", "=", "%"):
        safe = safe.replace(ch, "-")
    # Strip .pdf suffix if present so we get paper.md not paper.pdf.md
    safe = safe.removesuffix(".pdf")
    return f"{safe}.md"


def resolve_output(output: str) -> str:
    """Append a numeric suffix if the output path already exists."""
    p = Path(output)
    if not p.exists():
        return output
    base, ext = p.stem, p.suffix
    parent = p.parent
    i = 2
    while (parent / f"{base}-{i}{ext}").exists():
        i += 1
    return str(parent / f"{base}-{i}{ext}")


def download_pdf(url: str, dest: Path) -> None:
    """Download a PDF from a URL to a local path."""
    print(f"Downloading {url} …")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers, timeout=60, stream=True)
    response.raise_for_status()
    dest.write_bytes(response.content)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    source = args[0]
    output_arg = args[1] if len(args) > 1 else None

    # Resolve output path
    is_dir = output_arg and (
        output_arg.endswith("/")
        or (os.path.exists(output_arg) and os.path.isdir(output_arg))
    )
    raw_output = (
        os.path.join(output_arg, derive_filename(source))
        if is_dir
        else (output_arg or derive_filename(source))
    )
    output = resolve_output(raw_output)

    # Obtain a local PDF path (download if URL)
    is_url = source.startswith("http://") or source.startswith("https://")
    tmp_file = None
    try:
        if is_url:
            tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
            tmp_path = Path(tmp_file.name)
            tmp_file.close()
            download_pdf(source, tmp_path)
            local_pdf = str(tmp_path)
        else:
            local_pdf = source

        # Convert with Docling
        print(f"Converting {local_pdf} with Docling …")
        converter = DocumentConverter()
        result = converter.convert(local_pdf)
        markdown_body = result.document.export_to_markdown()

        # Prepend YAML front matter
        today = date.today().isoformat()
        front_matter = f"---\nsource: {source}\nfetched: {today}\n---\n\n"
        content = front_matter + markdown_body

        # Write output
        out_path = Path(output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(content, encoding="utf-8")
        print(f"Saved: {output}")

    finally:
        if tmp_file and os.path.exists(tmp_file.name):
            os.unlink(tmp_file.name)


if __name__ == "__main__":
    main()
