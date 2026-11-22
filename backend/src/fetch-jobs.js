// Anfààní live job fetch pipeline.
// Fetches only open, keyless feeds. Capped aggregators (JSearch, SerpApi,
// JobsPipe) are deliberately NOT called here: they need a paid or limited
// key and must never sit on the daily refresh. See README.md.
// Run: npm run fetch  (or: node src/fetch-jobs.js)
// Output: data/jobs.json, with fetched_at, per-source counts, and deduped jobs.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normaliseJob, dedupeJobs, cleanSalary } from "./normalize.js";
import { readJobs, writeJson, dataPath } from "./store.js";

const USER_AGENT = "Anfaani-Job-Fetcher/0.1 (+https://anfaani.example; contact: jobs@anfaani.example)";
const TIMEOUT_MS = 20000;

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function stripHtml(text = "") {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function rssTag(item, tag) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  let value = match[1].trim();
  value = value.replace(/^<!\[CDATA\[|\]\]>$/g, "");
  return decodeEntities(stripHtml(value));
}

// --- Source adapters. Each returns raw job objects for normaliseJob. ---

async function fetchRemoteOK() {
  const data = await fetchJson("https://remoteok.com/api");
  const rows = Array.isArray(data) ? data.filter((r) => r && r.position) : [];
  return rows.map((r) => ({
    title: r.position,
    company: r.company,
    location: r.location || "Worldwide",
    workMode: "Remote",
    tags: r.tags || [],
    salary: cleanSalary(r.salary_min, r.salary_max, r.salary_currency || "USD"),
    postedDate: r.date,
    applyUrl: r.url,
    eligibilityText: `${r.location || ""} ${(r.tags || []).join(" ")}`,
  }));
}

async function fetchArbeitnow() {
  const data = await fetchJson("https://www.arbeitnow.com/api/job-board-api");
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((r) => ({
    title: r.title,
    company: r.company_name,
    location: r.location || "Not stated",
    workMode: r.remote ? "Remote" : "On site",
    tags: r.job_types || [],
    salary: null,
    postedDate: r.created_at,
    applyUrl: r.url,
    eligibilityText: r.location || "",
  }));
}

async function fetchJobicy() {
  const data = await fetchJson("https://jobicy.com/api/v2/remote-jobs");
  const rows = Array.isArray(data?.jobs) ? data.jobs : [];
  return rows.map((r) => ({
    title: r.jobTitle,
    company: r.companyName,
    location: Array.isArray(r.jobGeo) ? r.jobGeo.join(", ") : r.jobGeo || "Worldwide",
    workMode: "Remote",
    tags: [r.jobIndustry, r.jobType].filter(Boolean),
    salary: null,
    postedDate: r.pubDate,
    applyUrl: r.url,
    eligibilityText: `${r.jobGeo || ""} ${r.jobIndustry || ""}`,
  }));
}

async function fetchRemotive() {
  const data = await fetchJson("https://remotive.com/api/remote-jobs");
  const rows = Array.isArray(data?.jobs) ? data.jobs : [];
  return rows.map((r) => ({
    title: r.title,
    company: r.company_name,
    location: r.candidate_required_location || "Worldwide",
    workMode: "Remote",
    tags: [r.category, r.job_type].filter(Boolean),
    salary: r.salary ? { min: null, max: null, currency: null, raw: r.salary } : null,
    postedDate: r.publication_date,
    applyUrl: r.url,
    eligibilityText: r.candidate_required_location || "",
  }));
}

async function fetchWeWorkRemotely() {
  const xml = await fetchText("https://weworkremotely.com/remote-jobs.rss");
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((item) => {
    const title = rssTag(item, "title");
    // WWR titles are "Company: Role" in many feeds.
    const split = title.indexOf(":");
    return {
      title: split > 0 ? title.slice(split + 1).trim() : title,
      company: split > 0 ? title.slice(0, split).trim() : "Not stated",
      location: "Worldwide",
      workMode: "Remote",
      tags: [rssTag(item, "category")].filter(Boolean),
      salary: null,
      postedDate: rssTag(item, "pubDate"),
      applyUrl: rssTag(item, "link"),
      eligibilityText: rssTag(item, "description"),
    };
  });
}

function readCompanies() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "..", "companies.json");
  if (!existsSync(path)) return [];
  try {
    const list = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(list) ? list.filter((c) => c.board_token) : [];
  } catch {
    return [];
  }
}

async function fetchGreenhouse() {
  const companies = readCompanies();
  if (companies.length === 0) return [];
  const all = [];
  for (const company of companies) {
    try {
      const data = await fetchJson(
        `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(company.board_token)}/jobs?content=true`,
      );
      for (const r of data?.jobs || []) {
        all.push({
          title: r.title,
          company: company.name || "Not stated",
          location: r.location?.name || "Not stated",
          workMode: /remote/i.test(r.location?.name || "") ? "Remote" : "On site",
          tags: [],
          salary: null,
          postedDate: r.updated_at,
          applyUrl: r.absolute_url,
          eligibilityText: r.location?.name || "",
        });
      }
    } catch (err) {
      console.error(`  Greenhouse ${company.board_token}: failed (${err.message})`);
    }
  }
  return all;
}

const SOURCES = [
  { name: "RemoteOK", fn: fetchRemoteOK },
  { name: "Arbeitnow", fn: fetchArbeitnow },
  { name: "Jobicy", fn: fetchJobicy },
  { name: "Remotive", fn: fetchRemotive },
  { name: "WeWorkRemotely", fn: fetchWeWorkRemotely },
  { name: "Greenhouse", fn: fetchGreenhouse },
];

export async function runFetch() {
  const fetchedAt = new Date().toISOString();
  const allJobs = [];
  const sourceReports = [];

  for (const source of SOURCES) {
    try {
      const raw = await source.fn();
      const jobs = raw.map((r) => normaliseJob(r, source.name)).filter(Boolean);
      console.log(`  ${source.name}: ${jobs.length} jobs`);
      allJobs.push(...jobs);
      sourceReports.push({ name: source.name, status: "ok", count: jobs.length });
    } catch (err) {
      console.error(`  ${source.name}: FAILED (${err.message})`);
      sourceReports.push({ name: source.name, status: "failed", count: 0, error: err.message });
    }
  }

  const deduped = dedupeJobs(allJobs).sort((a, b) =>
    (b.postedDate || "") > (a.postedDate || "") ? 1 : -1,
  );

  if (deduped.length === 0) {
    console.error("All sources failed or returned no jobs. Keeping the previous jobs.json.");
    return { ok: false, total: 0, sourceReports };
  }

  const payload = {
    fetched_at: fetchedAt,
    total: deduped.length,
    sources: sourceReports,
    jobs: deduped,
  };
  writeJson("jobs.json", payload);
  console.log(`Wrote ${dataPath("jobs.json")}: ${deduped.length} jobs from ${sourceReports.filter((s) => s.status === "ok").length} sources.`);
  return { ok: true, total: deduped.length, sourceReports };
}

// Run directly: node src/fetch-jobs.js
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (isMain || process.argv[1]?.endsWith("fetch-jobs.js")) {
  runFetch().then((result) => process.exit(result.ok ? 0 : 1));
}
