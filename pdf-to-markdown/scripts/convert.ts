#!/usr/bin/env npx tsx
/**
 * Convert a PDF file to a Markdown file using pdftotext (poppler).
 *
 * Usage:
 *   npx tsx convert.ts <input.pdf> [output.md]
 *
 * Arguments:
 *   input   Path to the source PDF (required)
 *   output  Output .md path (optional, derived from input if omitted)
 *
 * Examples:
 *   npx tsx convert.ts report.pdf
 *   npx tsx convert.ts report.pdf docs/report.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export function deriveOutput(input: string): string {
  const base = path.basename(input, path.extname(input));
  const dir = path.dirname(input);
  return path.join(dir, `${base}.md`);
}

export function resolveOutput(output: string): string {
  if (!fs.existsSync(output)) return output;
  const ext = path.extname(output);
  const base = output.slice(0, -ext.length);
  let i = 2;
  while (fs.existsSync(`${base}-${i}${ext}`)) i++;
  return `${base}-${i}${ext}`;
}

export function pdfToText(input: string): string {
  // -layout preserves column layout; -nopgbrk removes form-feed page breaks
  return execFileSync("pdftotext", ["-layout", "-nopgbrk", input, "-"], {
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

export function textToMarkdown(text: string, sourceFile: string): string {
  const lines = text.split("\n");
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Skip blank lines (will re-add paragraph breaks)
    if (trimmed === "") {
      processed.push("");
      continue;
    }

    // Heuristic: short ALL-CAPS or title-case isolated lines → heading
    const isShort = trimmed.length < 80;
    const isAllCaps = isShort && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
    const prevBlank = i === 0 || lines[i - 1].trim() === "";
    const nextBlank = i === lines.length - 1 || lines[i + 1].trim() === "";

    if (isAllCaps && prevBlank && nextBlank) {
      processed.push(`## ${trimmed}`);
    } else {
      processed.push(trimmed);
    }
  }

  // Collapse 3+ consecutive blank lines into 2
  const collapsed = processed
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const today = new Date().toISOString().slice(0, 10);
  const filename = path.basename(sourceFile);
  return `---\nsource: ${filename}\nconverted: ${today}\n---\n\n${collapsed}\n`;
}

async function main() {
  const [input, outputArg] = process.argv.slice(2);

  if (!input) {
    console.error("Usage: npx tsx convert.ts <input.pdf> [output.md]");
    process.exit(1);
  }

  if (!fs.existsSync(input)) {
    console.error(`Error: file not found: ${input}`);
    process.exit(1);
  }

  const rawOutput = outputArg ?? deriveOutput(input);
  const output = resolveOutput(rawOutput);

  console.log(`Converting ${input} ...`);

  let text: string;
  try {
    text = pdfToText(input);
  } catch (err) {
    console.error(`pdftotext failed: ${(err as Error).message}`);
    process.exit(1);
    return; // unreachable, but satisfies the definite-assignment check
  }

  const md = textToMarkdown(text, input);

  const dir = path.dirname(output);
  if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(output, md, "utf-8");

  console.log(`Saved: ${output}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
