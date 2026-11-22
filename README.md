# Anfààní

Anfààní is a job search platform, Nigeria first, global by design. It helps people find jobs that are actually open to where they live, by qualifications, location, preferred location, remote or hybrid or on site, and scope, global, region, country, or city. It covers 52 fields, from software engineering and AI to nursing, finance, agriculture, and skilled trades, plus scholarships.

The problem it solves in one sentence: people in Nigeria, and in many other places, waste applications on jobs marked remote that are not actually open to where they live.

Every job card makes eligibility impossible to miss: open to Nigeria yes or no, open to Africa or worldwide, timezone overlap with WAT in hours where that is a fact, salary in NGN and USD only when the employer gives it, posted date, and a clear apply route to the original listing. Never pay to apply.

## What is in this repo

- `backend/` - Plain Node.js backend, zero dependencies. It fetches open job feeds, dedupes and normalises them, caches them, and serves a small JSON API for jobs, alerts, reports, and saved jobs.
- `anfaani-logo/` - The official Anfààní logo, the Door mark. The light version is the official logo. Dark version and app icon are supporting versions.
- `CONCEPT.md` - The concept brief, the 52 fields, the feedback loops, and the agreed next updates.
- `.github/workflows/fetch-jobs.yml` - Fetches live jobs 4 times a day and commits the cached copy.

## Backend

```bash
cd backend
node src/fetch-jobs.js
npm start
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/jobs?limit=5"
```

API: `GET /api/health`, `GET /api/jobs` (filters: `q`, `field`, `location`, `mode`, `nigeria_only`, `limit`, `offset`), `POST /api/alerts` (email and consent required), `POST /api/reports`, `GET /api/saved` and `POST /api/saved`.

Tests: `npm test` in `backend/`, 10 tests, all passing as of Nov 22 2026.

Live jobs, verified Nov 22 2026: the fetch pulled 616 real jobs with 616 unique apply links and 0 failures, from RemoteOK, Arbeitnow, Jobicy, Remotive, and WeWorkRemotely. 121 are open to Nigeria, 112 state a salary. Every job has an eligibility line and an https apply link on its source domain.

## Deploy

No live deployment exists yet. To deploy: import this repo in Vercel, set the Root Directory to `backend`, framework preset Other, build command empty, output directory empty. The GitHub Actions workflow runs the fetch 4 times a day.

## Honest limits

- No email sending key yet. Alerts register, but no real email goes out until a Resend API key is set (`RESEND_API_KEY` and `FROM_EMAIL` in the hosting environment). The API says so plainly.
- No domain yet. Domain buying is deferred to Dec 2026. Vercel gives a free `.vercel.app` address for now.
- Sample jobs and scholarships in the prototype are clearly labelled sample, not live jobs.
- No JSearch, SerpApi, or JobsPipe key, and those aggregators are never called by this code.
- Alerts, reports, and saved jobs are stored as JSON files and will not persist reliably on Vercel serverless, they need Vercel KV or Postgres before production use.
- The name Anfààní has known conflicts, a UK wellness app and a Nigeria opportunity platform with the same word root, so do not buy a domain until that is settled.

## Palette

Black, white, indigo #4F46E5 in light mode and #818CF8 in dark mode, red only for warnings.
