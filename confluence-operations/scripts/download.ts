#!/usr/bin/env npx tsx
/**
 * Download a Confluence page and save it as a local markdown file.
 *
 * Usage:
 *   npx tsx download.ts <page-id> [output]
 *
 * Arguments:
 *   page-id  Confluence page ID (required)
 *   output   Output file path (optional, derived from page title if omitted)
 *
 * Required environment variables (set in agent_skills/.env):
 *   CONFLUENCE_BASE_URL   e.g. https://yourorg.atlassian.net
 *   CONFLUENCE_EMAIL      your Atlassian account email
 *   CONFLUENCE_API_TOKEN  API token from id.atlassian.com/manage-profile/security/api-tokens
 *   CONFLUENCE_SPACE_KEY  e.g. MYSPACE
 *
 * Examples:
 *   npx tsx confluence-operations/scripts/download.ts 5940019259
 *   npx tsx confluence-operations/scripts/download.ts 5940019259 outputs/my-page.md
 *   npx tsx confluence-operations/scripts/download.ts 5940019259 outputs/snowflake/
 */

import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { config } from "dotenv";

// Load .env from the agent_skills root (two levels up from this script)
config({ path: new URL("../../.env", import.meta.url).pathname });

// --- Config ---

const BASE_URL = process.env.CONFLUENCE_BASE_URL?.replace(/\/$/, "");
const EMAIL = process.env.CONFLUENCE_EMAIL;
const API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY;

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    console.error(`Error: missing required environment variable ${name}`);
    process.exit(1);
  }
  return val;
}

// --- Helpers ---

function authHeader(): string {
  const creds = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString("base64");
  return `Basic ${creds}`;
}

async function apiRequest(endpoint: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/wiki/rest/api${endpoint}`, {
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const preview = text.slice(0, 300).replace(/\s+/g, " ");
    throw new Error(
      `Confluence API GET ${endpoint} → ${res.status} ${res.statusText}\nResponse: ${preview}`
    );
  }
  return JSON.parse(text);
}

function deriveFilename(pageId: string, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${pageId}-${slug}.md`;
}

function resolveOutput(output: string): string {
  if (!fs.existsSync(output)) return output;
  const ext = path.extname(output);
  const base = output.slice(0, -ext.length);
  let i = 2;
  while (fs.existsSync(`${base}-${i}${ext}`)) i++;
  return `${base}-${i}${ext}`;
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  // Strip Confluence macros and boilerplate
  td.addRule("removeMacros", {
    filter: ["ac:structured-macro", "ac:parameter", "ac:plain-text-body"],
    replacement: () => "",
  });
  td.addRule("removeBoilerplate", {
    filter: ["script", "style", "noscript"],
    replacement: () => "",
  });
  return td.turndown(html);
}

// --- Main ---

async function main() {
  requireEnv("CONFLUENCE_BASE_URL");
  requireEnv("CONFLUENCE_EMAIL");
  requireEnv("CONFLUENCE_API_TOKEN");
  requireEnv("CONFLUENCE_SPACE_KEY");

  const [pageId, outputArg] = process.argv.slice(2);

  if (!pageId) {
    console.error("Usage: npx tsx download.ts <page-id> [output]");
    process.exit(1);
  }

  console.log(`Fetching page ${pageId} from Confluence ...`);
  const data = (await apiRequest(
    `/content/${pageId}?expand=body.storage,version,space`
  )) as {
    title: string;
    space: { key: string };
    version: { number: number };
    body: { storage: { value: string } };
    _links: { webui: string };
  };

  const title = data.title;
  const storageHtml = data.body.storage.value;
  const pageUrl = `${BASE_URL}/wiki${data._links.webui}`;

  // Resolve output path
  const isDir =
    outputArg &&
    (outputArg.endsWith("/") ||
      (fs.existsSync(outputArg) && fs.statSync(outputArg).isDirectory()));
  const rawOutput = isDir
    ? path.join(outputArg, deriveFilename(pageId, title))
    : (outputArg ?? deriveFilename(pageId, title));
  const output = resolveOutput(rawOutput);

  // Convert storage HTML → Markdown
  const markdownBody = htmlToMarkdown(storageHtml);
  const today = new Date().toISOString().slice(0, 10);
  const content =
    `---\n` +
    `title: ${title}\n` +
    `source: ${pageUrl}\n` +
    `page_id: ${pageId}\n` +
    `fetched: ${today}\n` +
    `---\n\n` +
    markdownBody;

  // Write output
  const dir = path.dirname(output);
  if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(output, content, "utf-8");

  console.log(`Saved: ${output}`);
  console.log(`Source: ${pageUrl}`);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
