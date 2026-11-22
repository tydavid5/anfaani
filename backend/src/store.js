// Anfààní data store. Plain Node, zero dependencies except @vercel/blob,
// which is only used when a Blob store is connected (on Vercel).
// Jobs are a read-only cached file bundled with the deployment, read locally.
// Alerts, reports and saved jobs are written data: on Vercel they live in a
// private Vercel Blob store, because the serverless filesystem is read-only.
// Locally, with no Blob store connected, they fall back to JSON files in data/.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const DATA_DIR =
  process.env.DATA_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "data");

export function dataPath(name) {
  return join(DATA_DIR, name);
}

export function blobConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

export function readJson(name, fallback) {
  const path = dataPath(name);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(name, value) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(dataPath(name), JSON.stringify(value, null, 2) + "\n", "utf8");
}

export function readJobs() {
  return readJson("jobs.json", { fetched_at: null, sources: [], total: 0, jobs: [] });
}

// Written data: Blob on Vercel, JSON files locally.
export async function readData(name, fallback) {
  if (!blobConfigured()) return readJson(name, fallback);
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(name, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return fallback;
    return JSON.parse(await new Response(result.stream).text());
  } catch {
    return fallback;
  }
}

export async function writeData(name, value) {
  if (!blobConfigured()) {
    writeJson(name, value);
    return;
  }
  const { put } = await import("@vercel/blob");
  await put(name, JSON.stringify(value, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
