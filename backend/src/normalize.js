import { createHash } from "node:crypto";
import { analyseEligibility } from "./eligibility.js";
import { inferField } from "./fields.js";

export function normaliseUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function makeId(applyUrl) {
  return createHash("sha256").update(applyUrl).digest("hex").slice(0, 16);
}

function cleanSalary(min, max, currency) {
  if (min == null && max == null) return null;
  const num = (v) => (v == null || v === "" ? null : Number(v));
  const salaryMin = num(min);
  const salaryMax = num(max);
  if (salaryMin == null && salaryMax == null) return null;
  if (salaryMin != null && salaryMax != null && salaryMin > salaryMax) return null;
  return { min: salaryMin, max: salaryMax, currency: currency || null };
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// Every normalised job has the same shape, and every job has an
// eligibility line. Salary is only present when the source gave it.
export function normaliseJob(raw, source) {
  const applyUrl = normaliseUrl(raw.applyUrl);
  if (!applyUrl) return null;
  const title = (raw.title || "").trim();
  const company = (raw.company || "").trim() || "Not stated";
  if (!title) return null;

  const location = (raw.location || "").trim() || "Not stated";
  const eligibility = analyseEligibility(location, raw.eligibilityText || "");
  const field = inferField(title, raw.tags || []);

  return {
    id: makeId(applyUrl),
    title,
    company,
    location,
    scope: eligibility.scope,
    workMode: raw.workMode || "Not stated",
    field,
    fieldSource: field ? "inferred" : null,
    salary: raw.salary || null,
    postedDate: toIsoDate(raw.postedDate),
    applyUrl,
    source,
    sourceUrl: applyUrl,
    eligibility,
    fetchedAt: new Date().toISOString(),
  };
}

export function dedupeJobs(jobs) {
  const seen = new Set();
  const out = [];
  for (const job of jobs) {
    if (!job || seen.has(job.applyUrl)) continue;
    seen.add(job.applyUrl);
    out.push(job);
  }
  return out;
}

export { cleanSalary };
