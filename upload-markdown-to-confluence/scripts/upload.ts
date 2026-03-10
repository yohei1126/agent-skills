#!/usr/bin/env npx tsx
/**
 * Upload a local markdown file to a Confluence page.
 * Creates a new page or updates an existing one.
 *
 * Usage:
 *   npx tsx upload.ts <markdown-file> [--title "Page Title"] [--parent-id 12345] [--page-id 99999]
 *
 * Required environment variables:
 *   CONFLUENCE_BASE_URL   e.g. https://yourorg.atlassian.net
 *   CONFLUENCE_EMAIL      your Atlassian account email
 *   CONFLUENCE_API_TOKEN  API token from id.atlassian.com/manage-profile/security/api-tokens
 *   CONFLUENCE_SPACE_KEY  e.g. MYSPACE
 */

import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
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

// --- CLI args ---

function parseArgs() {
  const args = process.argv.slice(2);
  if (!args[0] || args[0].startsWith("--")) {
    console.error(
      "Usage: npx tsx upload.ts <markdown-file> [--title 'Page Title'] [--parent-id 12345]"
    );
    process.exit(1);
  }

  const filePath = args[0];
  let title: string | undefined;
  let parentId: string | undefined;
  let pageId: string | undefined;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--title") title = args[++i];
    else if (args[i] === "--parent-id") parentId = args[++i];
    else if (args[i] === "--page-id") pageId = args[++i];
  }

  return { filePath, title, parentId, pageId };
}

// --- Confluence API helpers ---

function authHeader(): string {
  const creds = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString("base64");
  return `Basic ${creds}`;
}

async function apiRequest(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/wiki/rest/api${endpoint}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    // Show first 300 chars of response to help diagnose auth/URL issues
    const preview = text.slice(0, 300).replace(/\s+/g, " ");
    throw new Error(`Confluence API ${method} ${endpoint} → ${res.status} ${res.statusText}\nURL: ${BASE_URL}/wiki/rest/api${endpoint}\nResponse: ${preview}`);
  }
  const json = JSON.parse(text);
  return json;
}

async function findPage(
  spaceKey: string,
  title: string
): Promise<{ id: string; version: number } | null> {
  const encoded = encodeURIComponent(title);
  const data = (await apiRequest(
    "GET",
    `/content?spaceKey=${spaceKey}&title=${encoded}&expand=version`
  )) as { results: Array<{ id: string; version: { number: number } }> };

  if (data.results.length === 0) return null;
  const page = data.results[0];
  return { id: page.id, version: page.version.number };
}

async function createPage(
  spaceKey: string,
  title: string,
  htmlBody: string,
  parentId?: string
): Promise<string> {
  const ancestors = parentId ? [{ id: parentId }] : [];
  const data = (await apiRequest("POST", "/content", {
    type: "page",
    title,
    ancestors,
    space: { key: spaceKey },
    body: { storage: { value: htmlBody, representation: "storage" } },
  })) as { id: string };
  return data.id;
}

async function getPageVersion(pageId: string): Promise<number> {
  const data = (await apiRequest("GET", `/content/${pageId}?expand=version`)) as {
    version: { number: number };
  };
  return data.version.number;
}

async function updatePage(
  pageId: string,
  title: string,
  htmlBody: string,
  currentVersion: number
): Promise<void> {
  await apiRequest("PUT", `/content/${pageId}`, {
    type: "page",
    title,
    version: { number: currentVersion + 1 },
    body: { storage: { value: htmlBody, representation: "storage" } },
  });
}

// --- Main ---

async function main() {
  requireEnv("CONFLUENCE_BASE_URL");
  requireEnv("CONFLUENCE_EMAIL");
  requireEnv("CONFLUENCE_API_TOKEN");
  requireEnv("CONFLUENCE_SPACE_KEY");

  const { filePath, title: titleArg, parentId, pageId } = parseArgs();

  if (!fs.existsSync(filePath)) {
    console.error(`Error: file not found: ${filePath}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(filePath, "utf-8");
  const h1Match = markdown.match(/^#\s+(.+)/m);
  const title = titleArg ?? h1Match?.[1]?.trim() ?? path.basename(filePath, path.extname(filePath));
  // Strip the first H1 from body — Confluence uses the title separately
  const body = h1Match ? markdown.replace(/^#\s+.+\n?/, "") : markdown;
  const toc = '<ac:structured-macro ac:name="toc" ac:schema-version="1"/>';
  const htmlBody = toc + await marked(body);

  // --page-id: update a specific page by ID (bypasses title search, allows title rename)
  if (pageId) {
    console.log(`Updating page ${pageId} with title "${title}" ...`);
    const version = await getPageVersion(pageId);
    await updatePage(pageId, title, htmlBody, version);
    console.log(`Updated: ${BASE_URL}/wiki/spaces/${SPACE_KEY}/pages/${pageId}`);
    return;
  }

  console.log(`Uploading "${title}" to space ${SPACE_KEY} ...`);

  const existing = await findPage(SPACE_KEY!, title);

  if (existing) {
    await updatePage(existing.id, title, htmlBody, existing.version);
    console.log(`Updated: ${BASE_URL}/wiki/spaces/${SPACE_KEY}/pages/${existing.id}`);
  } else {
    const newId = await createPage(SPACE_KEY!, title, htmlBody, parentId);
    console.log(`Created: ${BASE_URL}/wiki/spaces/${SPACE_KEY}/pages/${newId}`);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
