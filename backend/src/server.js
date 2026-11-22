// Anfààní API server. Plain Node, zero dependencies.
// Run: npm start  (or: node src/server.js)
// Env: PORT (default 3000), DATA_DIR, RESEND_API_KEY, FROM_EMAIL.

import { createServer } from "node:http";
import { readJobs, readData, writeData } from "./store.js";
import { emailConfigured } from "./email.js";

const PORT = Number(process.env.PORT || 3000);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REPORT_REASONS = ["scam", "asks for payment", "wrong location", "dead link", "wrong details", "other"];

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 200_000) throw new Error("body too large");
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  return JSON.parse(text);
}

function keyFor(body) {
  if (body.email && EMAIL_RE.test(body.email)) return `email:${body.email.toLowerCase()}`;
  if (typeof body.device_id === "string" && body.device_id.trim()) {
    return `device:${body.device_id.trim().slice(0, 128)}`;
  }
  return null;
}

function filterJobs(jobs, query) {
  const q = (query.get("q") || "").toLowerCase().trim();
  const field = (query.get("field") || "").toLowerCase().trim();
  const location = (query.get("location") || "").toLowerCase().trim();
  const mode = (query.get("mode") || "").toLowerCase().trim();
  const nigeriaOnly = query.get("nigeria_only") === "true" || query.get("nigeria_only") === "1";

  return jobs.filter((job) => {
    if (q && !`${job.title} ${job.company} ${job.location}`.toLowerCase().includes(q)) return false;
    if (field && (job.field || "").toLowerCase() !== field) return false;
    if (location && !`${job.location} ${job.scope}`.toLowerCase().includes(location)) return false;
    if (mode && (job.workMode || "").toLowerCase() !== mode) return false;
    if (nigeriaOnly && job.eligibility?.openToNigeria !== "yes") return false;
    return true;
  });
}

export function createHandler() {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, "http://localhost");
    const path = url.pathname;

    try {
      if (req.method === "GET" && path === "/api/health") {
        const data = readJobs();
        return sendJson(res, 200, {
          ok: true,
          service: "anfaani",
          jobs: data.total || 0,
          fetched_at: data.fetched_at || null,
          email_configured: emailConfigured(),
        });
      }

      if (req.method === "GET" && path === "/api/jobs") {
        const data = readJobs();
        const jobs = filterJobs(data.jobs || [], url.searchParams);
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 200);
        const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
        return sendJson(res, 200, {
          fetched_at: data.fetched_at || null,
          total: jobs.length,
          jobs: jobs.slice(offset, offset + limit),
        });
      }

      if (req.method === "POST" && path === "/api/alerts") {
        const body = await readBody(req);
        if (!body.email || !EMAIL_RE.test(body.email)) {
          return sendJson(res, 400, { ok: false, error: "a valid email is required" });
        }
        if (body.consent !== true) {
          return sendJson(res, 400, { ok: false, error: "consent is required" });
        }
        if (!body.field || typeof body.field !== "string") {
          return sendJson(res, 400, { ok: false, error: "field is required" });
        }
        const alerts = await readData("alerts.json", []);
        const alert = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          email: body.email.toLowerCase(),
          field: body.field,
          location: body.location || "anywhere",
          mode: body.mode || "any",
          consent: true,
          created_at: new Date().toISOString(),
        };
        alerts.push(alert);
        await writeData("alerts.json", alerts);
        // Honest: registration is stored, no email is sent here. Real
        // emails only go out via src/send-alerts.js when a Resend key is set.
        return sendJson(res, 201, {
          ok: true,
          alert,
          email_sending: emailConfigured() ? "configured" : "not_configured",
        });
      }

      if (req.method === "POST" && path === "/api/reports") {
        const body = await readBody(req);
        if (!body.job_id || typeof body.job_id !== "string") {
          return sendJson(res, 400, { ok: false, error: "job_id is required" });
        }
        if (!REPORT_REASONS.includes(body.reason)) {
          return sendJson(res, 400, { ok: false, error: `reason must be one of: ${REPORT_REASONS.join(", ")}` });
        }
        const reports = await readData("reports.json", []);
        const report = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          job_id: body.job_id,
          reason: body.reason,
          note: typeof body.note === "string" ? body.note.slice(0, 1000) : "",
          created_at: new Date().toISOString(),
        };
        reports.push(report);
        await writeData("reports.json", reports);
        return sendJson(res, 201, { ok: true, report });
      }

      if (req.method === "GET" && path === "/api/saved") {
        const key = keyFor(Object.fromEntries(url.searchParams));
        if (!key) return sendJson(res, 400, { ok: false, error: "email or device_id is required" });
        const saved = await readData("saved.json", {});
        const ids = saved[key] || [];
        const data = readJobs();
        const jobs = (data.jobs || []).filter((j) => ids.includes(j.id));
        return sendJson(res, 200, { ok: true, key, job_ids: ids, jobs });
      }

      if (req.method === "POST" && path === "/api/saved") {
        const body = await readBody(req);
        const key = keyFor(body);
        if (!key) return sendJson(res, 400, { ok: false, error: "email or device_id is required" });
        if (!body.job_id || typeof body.job_id !== "string") {
          return sendJson(res, 400, { ok: false, error: "job_id is required" });
        }
        const saved = await readData("saved.json", {});
        const ids = new Set(saved[key] || []);
        if (body.action === "remove") ids.delete(body.job_id);
        else ids.add(body.job_id);
        saved[key] = [...ids];
        await writeData("saved.json", saved);
        return sendJson(res, 200, { ok: true, key, job_ids: saved[key] });
      }

      return sendJson(res, 404, { ok: false, error: "not found" });
    } catch (err) {
      if (err instanceof SyntaxError) {
        return sendJson(res, 400, { ok: false, error: "invalid JSON body" });
      }
      console.error(err);
      return sendJson(res, 500, { ok: false, error: "internal error" });
    }
  };
}

const isMain = process.argv[1]?.endsWith("server.js");
if (isMain) {
  const server = createServer(createHandler());
  server.listen(PORT, () => {
    console.log(`Anfààní backend listening on http://localhost:${PORT}`);
    console.log(`Email configured: ${emailConfigured() ? "yes" : "no (RESEND_API_KEY not set)"}`);
  });
}
