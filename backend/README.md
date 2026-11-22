# Anfààní backend

Backend for Anfààní, a job search platform, Nigeria first, global by design, with 52 fields.
It fetches open job feeds, caches them, and serves a small JSON API for jobs,
alerts, reports and saved jobs.

No paid services. No external database. Plain Node.js, zero dependencies.
No deployment exists yet. Nothing here is live on the internet.

## What it does

- **Fetch pipeline** (`src/fetch-jobs.js`): fetches open, keyless feeds,
  dedupes by apply URL, normalises each job, and writes `data/jobs.json`
  with a `fetched_at` timestamp. Users read the saved copy and click the
  original apply link. No per-user feed calls.
- **API server** (`src/server.js`): plain Node HTTP server.
  - `GET /api/health`
  - `GET /api/jobs?q=&field=&location=&mode=&nigeria_only=&limit=&offset=`
  - `POST /api/alerts` (email, field, location, mode, consent required)
  - `POST /api/reports` (job_id, reason, note)
  - `GET /api/saved?email=...` or `?device_id=...`
  - `POST /api/saved` (email or device_id, job_id, action save or remove)
- **Email** (`src/email.js`, `src/send-alerts.js`): Resend, only when
  `RESEND_API_KEY` and `FROM_EMAIL` are set. Otherwise it is a clear no-op
  and nothing is claimed as sent.
- **Scheduled fetch** (`../.github/workflows/fetch-jobs.yml`, at the repo
  root): GitHub Actions runs the fetch 4 times a day (02:00, 08:00, 14:00,
  20:00 UTC) and commits the updated `data/jobs.json`. Vercel Hobby cron is
  once a day max, so it cannot do the agreed 3 to 5 fetches a day, which is
  why Actions does it. The workflow lives at the repo root because GitHub
  Actions only runs workflows from there. The repo is `tydavid5/anfaani`,
  one repo for the whole project, with this backend in `backend/`.

## Feeds

Carried by the daily refresh, all open and keyless:

| Source | Feed | Notes |
|---|---|---|
| RemoteOK | `https://remoteok.com/api` | JSON, no key |
| Arbeitnow | `https://www.arbeitnow.com/api/job-board-api` | JSON, no key |
| Jobicy | `https://jobicy.com/api/v2/remote-jobs` | JSON, no key |
| Remotive | `https://remotive.com/api/remote-jobs` | JSON, no key, max 4 calls a day advised, this runs 4 times a day |
| WeWorkRemotely | `https://weworkremotely.com/remote-jobs.rss` | RSS, no key |
| Greenhouse | per company board API | Only for companies listed in `companies.json`, which is empty by default. Add `{ "name": "...", "board_token": "..." }` to enable a board. |

Capped aggregators are deliberately NOT on the daily refresh and are never
called by this code:

- JSearch, 200 requests a month, needs a key.
- SerpApi, 250 searches a month, needs a key.
- JobsPipe, 1,000 credits one time only, not refilled, needs a key.

Do not add them to `src/fetch-jobs.js` without a key and a separate,
sparing schedule.

## Normalised job shape

```json
{
  "id": "a1b2c3d4e5f60718",
  "title": "Backend Engineer",
  "company": "Example Ltd",
  "location": "Worldwide",
  "scope": "worldwide",
  "workMode": "Remote",
  "field": "Software engineering",
  "fieldSource": "inferred",
  "salary": { "min": 50000, "max": 80000, "currency": "USD" },
  "postedDate": "2026-11-22T10:00:00.000Z",
  "applyUrl": "https://example.com/jobs/123",
  "source": "RemoteOK",
  "eligibility": {
    "openToNigeria": "yes",
    "openToAfrica": "yes",
    "openToWorldwide": "yes",
    "scope": "worldwide",
    "timezoneOverlapWAT": null
  }
}
```

Rules:

- Salary is only present when the source gave it. Otherwise `salary` is null.
- Eligibility is conservative: `openToNigeria` is `yes` only when the source
  says Nigeria, Africa or worldwide. A named restriction elsewhere is `no`.
  Everything else is `not stated`, never guessed.
- Timezone overlap with WAT is only stated where the region makes it a fact:
  Nigeria 8 hours, Africa 6 hours, Europe or UK 7 hours. Otherwise null.
- `field` is inferred from the title only, so `fieldSource` is
  `"inferred"`. Source tags are ignored because they are often a broad
  industry category that misfiles jobs. If nothing matches, `field` is null.
- Apply links are https only and are kept on the source domain. Jobs with
  no usable https apply link are dropped.

## Data storage

Simple JSON files in `data/`, no external database:

- `data/jobs.json`, the cached feed, committed by the fetch workflow.
- `data/alerts.json`, alert registrations, gitignored.
- `data/reports.json`, job reports, gitignored.
- `data/saved.json`, saved jobs keyed by `email:...` or `device:...`, gitignored.

On Vercel the filesystem is ephemeral, so `alerts.json`, `reports.json` and
`saved.json` do not persist reliably there. That is a known limit: for
durable user data on Vercel, move those three files to Vercel KV or
Postgres later. `jobs.json` is fine, it is committed to the repo by the
fetch workflow and read from disk.

## Run locally

```bash
cd backend
node src/fetch-jobs.js
npm start
```

Then, in another terminal:

```bash
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/jobs?limit=5"
curl "http://localhost:3000/api/jobs?q=nurse&nigeria_only=true"
```

No `npm install` is needed, there are no dependencies. Node 20 or newer
is required.

## Environment variables

Copy `.env.example` to `.env` for local use. Never commit a real `.env`.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Only to send email | Resend API key. The user must create this in a Resend account. No key is in this repo. |
| `FROM_EMAIL` | Only to send email | Verified sender address in Resend, for example `jobs@anfaani.example`. |
| `PORT` | No, default 3000 | API server port. |
| `DATA_DIR` | No, default `./data` | Where the JSON data files live. |

## Deploy

No deployment exists yet. To deploy, after the repo is created on GitHub:

1. Push the whole `job-platform` folder as the GitHub repo
   `tydavid5/anfaani`, one repo for the whole project, not a separate
   backend repo. The repo is named `anfaani`, one repo for the whole project.
2. Import it in Vercel, set the Root Directory to `backend`, framework
   preset: Other, build command empty, output directory empty. Vercel maps
   `backend/api/index.js` to the API.
3. Set `RESEND_API_KEY` and `FROM_EMAIL` in Vercel only if you want real
   alert emails. Without them, alerts register but no email is sent, and
   the API says so plainly.
4. The GitHub Actions fetch workflow needs the repo's default
   `GITHUB_TOKEN` with contents write permission, which it already has
   in the workflow file. It commits `backend/data/jobs.json` 4 times a day.

No domain yet. Domain buying is deferred to Dec 2026. Vercel gives a
`.vercel.app` URL until then.

## What is still missing

- **No Resend API key.** No real emails go out until the user creates a
  Resend account and key and sets `RESEND_API_KEY` and `FROM_EMAIL`.
  Alert registration works without it, it just stores the registration.
- **No JSearch, SerpApi or JobsPipe key.** Those aggregators are not
  called. Add them only with a key and a sparing schedule, never daily.
- **No durable user data on Vercel.** Alerts, reports and saved jobs are
  JSON files and do not persist reliably on serverless. Move them to
  Vercel KV or Postgres before relying on them in production.
- **No domain yet.** Deferred to Dec 2026, about $11 a year for a .com.
- **No auth.** Saved jobs are keyed by email or device id, not by a
  logged in account. Anyone with the same key can read that list.
- **Greenhouse boards are empty.** `companies.json` is `[]` by default.
  Add a company board token to enable a board.

## Tests

```bash
npm test
```

Tests cover eligibility, URL normalisation, dedupe, field inference and
the API handler. They do not call any live feed.
