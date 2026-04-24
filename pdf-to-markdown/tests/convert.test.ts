import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  deriveOutput,
  resolveOutput,
  pdfToText,
  textToMarkdown,
} from "../scripts/convert.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal but pdftotext-parseable PDF containing the given ASCII text. */
function buildMinimalPdf(text: string): Buffer {
  const streamContent = `BT /F1 12 Tf 50 700 Td (${text}) Tj ET`;
  const streamLen = Buffer.byteLength(streamContent, "ascii");

  const parts = [
    Buffer.from("%PDF-1.4\n", "ascii"),
    Buffer.from("1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n", "ascii"),
    Buffer.from("2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n", "ascii"),
    Buffer.from(
      "3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]" +
        " /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>\nendobj\n",
      "ascii"
    ),
    Buffer.from(
      `4 0 obj\n<</Length ${streamLen}>>\nstream\n${streamContent}\nendstream\nendobj\n`,
      "ascii"
    ),
    Buffer.from(
      "5 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n",
      "ascii"
    ),
  ];

  // Compute byte offsets for each object (parts[0] is the header, parts[1] is obj 1, …)
  const offsets: number[] = [];
  let pos = 0;
  for (const buf of parts) {
    offsets.push(pos);
    pos += buf.length;
  }
  // offsets[0] = start of header (not an object), offsets[1..5] = objects 1-5
  const xrefOffset = pos;

  const xrefLines = [
    "xref",
    "0 6",
    "0000000000 65535 f ",
    ...offsets.slice(1).map((o) => `${String(o).padStart(10, "0")} 00000 n `),
    "trailer",
    "<</Size 6 /Root 1 0 R>>",
    "startxref",
    String(xrefOffset),
    "%%EOF",
    "",
  ].join("\n");

  return Buffer.concat([...parts, Buffer.from(xrefLines, "ascii")]);
}

function tmpFile(ext: string): string {
  return path.join(os.tmpdir(), `convert-test-${process.pid}-${Date.now()}${ext}`);
}

// ---------------------------------------------------------------------------
// deriveOutput
// ---------------------------------------------------------------------------

describe("deriveOutput", () => {
  test("replaces .pdf extension with .md in the same directory", () => {
    assert.equal(deriveOutput("/docs/report.pdf"), "/docs/report.md");
  });

  test("handles a bare filename with no directory component", () => {
    assert.equal(deriveOutput("report.pdf"), "report.md");
  });

  test("uses the full stem including spaces and special chars", () => {
    assert.equal(
      deriveOutput("/inputs/Smart Port Challenge 2026.pdf"),
      "/inputs/Smart Port Challenge 2026.md"
    );
  });
});

// ---------------------------------------------------------------------------
// resolveOutput
// ---------------------------------------------------------------------------

describe("resolveOutput", () => {
  test("returns the path unchanged when the file does not exist", () => {
    const p = tmpFile(".md");
    assert.equal(resolveOutput(p), p);
  });

  test("appends -2 suffix when the file already exists", () => {
    const p = tmpFile(".md");
    fs.writeFileSync(p, "");
    try {
      assert.equal(resolveOutput(p), p.replace(/\.md$/, "-2.md"));
    } finally {
      fs.rmSync(p, { force: true });
    }
  });

  test("increments suffix past existing collisions", () => {
    const p = tmpFile(".md");
    const p2 = p.replace(/\.md$/, "-2.md");
    fs.writeFileSync(p, "");
    fs.writeFileSync(p2, "");
    try {
      assert.equal(resolveOutput(p), p.replace(/\.md$/, "-3.md"));
    } finally {
      fs.rmSync(p, { force: true });
      fs.rmSync(p2, { force: true });
    }
  });
});

// ---------------------------------------------------------------------------
// textToMarkdown
// ---------------------------------------------------------------------------

describe("textToMarkdown", () => {
  test("wraps output in YAML front matter with source and converted date", () => {
    const result = textToMarkdown("Some content", "report.pdf");
    assert.match(result, /^---\nsource: report\.pdf\nconverted: \d{4}-\d{2}-\d{2}\n---/);
  });

  test("uses basename of sourceFile in the front matter source field", () => {
    const result = textToMarkdown("content", "/long/path/to/doc.pdf");
    assert.match(result, /source: doc\.pdf/);
  });

  test("converts an ALL-CAPS line surrounded by blank lines to a ## heading", () => {
    const result = textToMarkdown("\nINTRODUCTION\n\nParagraph text.", "f.pdf");
    assert.match(result, /## INTRODUCTION/);
  });

  test("does not promote a mixed-case line to a heading", () => {
    const result = textToMarkdown("\nIntroduction\n\nParagraph text.", "f.pdf");
    assert.doesNotMatch(result, /## Introduction/);
  });

  test("does not promote an ALL-CAPS line that is not isolated by blank lines", () => {
    const result = textToMarkdown("INTRODUCTION\nParagraph text.", "f.pdf");
    assert.doesNotMatch(result, /## INTRODUCTION/);
  });

  test("does not promote an ALL-CAPS line >= 80 characters to a heading", () => {
    const longCaps = "A".repeat(80);
    const result = textToMarkdown(`\n${longCaps}\n\nContent`, "f.pdf");
    assert.doesNotMatch(result, /## A{80}/);
  });

  test("collapses 3+ consecutive blank lines into 2", () => {
    const result = textToMarkdown("Line A\n\n\n\n\nLine B", "f.pdf");
    assert.doesNotMatch(result, /\n{3,}/);
  });

  test("trims leading and trailing whitespace from each line", () => {
    const result = textToMarkdown("   indented content   ", "f.pdf");
    assert.match(result, /indented content/);
    assert.doesNotMatch(result, /   indented/);
  });
});

// ---------------------------------------------------------------------------
// pdfToText (integration — requires pdftotext from poppler)
// ---------------------------------------------------------------------------

describe("pdfToText", () => {
  test("extracts text from a minimal synthetic PDF", () => {
    const pdf = buildMinimalPdf("Hello World");
    const tmpPdf = tmpFile(".pdf");
    fs.writeFileSync(tmpPdf, pdf);
    try {
      const text = pdfToText(tmpPdf);
      assert.match(text, /Hello World/);
    } finally {
      fs.rmSync(tmpPdf, { force: true });
    }
  });

  test("throws when the file does not exist", () => {
    assert.throws(() => pdfToText("/nonexistent/path.pdf"));
  });
});
