#!/usr/bin/env npx tsx
/**
 * Download a website and save it as a local markdown file.
 * Uses Playwright for JS-rendered pages, falls back to plain fetch.
 *
 * Usage:
 *   npx tsx download.ts <url> [output]
 *
 * Arguments:
 *   url     The URL to download (required)
 *   output  Output file path (optional, derived from URL if omitted)
 *
 * Examples:
 *   npx tsx download.ts https://docs.snowflake.com/en/user-guide/cortex-overview
 *   npx tsx download.ts https://example.com my-notes.md
 *   npx tsx download.ts https://example.com outputs/subdir/notes.md
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import TurndownService from "turndown";

function deriveFilename(url: string): string {
  const parsed = new URL(url);
  const segments = parsed.pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const name = segments.at(-1) ?? parsed.hostname.replace(/\./g, "-");
  return `${name.replace(/[^\w-]/g, "-").replace(/-+/g, "-")}.md`;
}

async function fetchWithPlaywright(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    return await page.content();
  } finally {
    await browser.close();
  }
}

function toMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  td.addRule("removeBoilerplate", {
    filter: ["script", "style", "noscript", "nav", "footer", "header"],
    replacement: () => "",
  });
  return td.turndown(html);
}

function resolveOutput(output: string): string {
  if (!fs.existsSync(output)) return output;
  const ext = path.extname(output);
  const base = output.slice(0, -ext.length);
  let i = 2;
  while (fs.existsSync(`${base}-${i}${ext}`)) i++;
  return `${base}-${i}${ext}`;
}

async function main() {
  const [url, outputArg] = process.argv.slice(2);

  if (!url) {
    console.error("Usage: npx tsx download.ts <url> [output]");
    process.exit(1);
  }

  const output = resolveOutput(outputArg ?? deriveFilename(url));

  console.log(`Fetching ${url} (headless browser) ...`);
  let html: string;
  try {
    html = await fetchWithPlaywright(url);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }

  const md = toMarkdown(html);
  const today = new Date().toISOString().slice(0, 10);
  const content = `---\nsource: ${url}\nfetched: ${today}\n---\n\n${md}`;

  const dir = path.dirname(output);
  if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(output, content, "utf-8");

  console.log(`Saved: ${output}`);
}

main();
