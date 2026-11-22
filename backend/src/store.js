import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const DATA_DIR =
  process.env.DATA_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "data");

export function dataPath(name) {
  return join(DATA_DIR, name);
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
