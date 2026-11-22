# Anfààní, concept brief v0
Date: 2026-11-19
Status: v0 prototype built Nov 19 2026, for feedback testing only, not launched. Artifact slug global-job-search-platform. All 52 fields browsable in 7 groups, 28 clearly labelled sample listings across 28 fields. Search, location scope, work mode, job type, salary and recency filters, sorting, match profile builder, job detail, save jobs, honest empty states with job alerts, and a Later section for premium, featured employers, and hiring data. Known limit from builder check: the bookmark save click timed out twice in the probe harness, page stayed responsive, that toggle is verified by code path only, not by a live click in the probe.

## Problem in one sentence
People in Nigeria, and in many other places, waste applications on jobs marked remote that are not actually open to where they live.

## Primary concept now
A job search tool where a person enters qualifications, skills, experience, location, and preferred location for the job, then finds matching jobs anywhere.
- Work mode: remote, hybrid, or on site
- Scope: global, region (for example Africa), country, or city
- Fields: at least 52 areas, not only tech, listed below
- Nigeria first in testing, global in design
- Go all in on this as a long term product, not a one off demo

## The 52 areas, updated Nov 19 2026
Checked against Indeed career fields, which group jobs into broad fields such as healthcare, science and technology, business, and arts and entertainment, and against Indeed occupation categories, which include Technology, Healthcare, Finance and Accounting, Science and Research, and Supply Chain and Logistics. Our list splits those broad fields into job seeker friendly areas, and adds crypto, AI, and environment as first class areas, not sub items.

Tech and Digital, 1 to 10:
1. Software engineering
2. AI and machine learning
3. Data science and analytics
4. Cybersecurity
5. Crypto, blockchain, and Web3
6. Product management
7. UI and UX design
8. Cloud, DevOps, and IT
9. Game development
10. QA, testing, and technical support

Health, Science, and Medicine, 11 to 18:
11. Medicine and clinical care
12. Nursing and midwifery
13. Pharmacy
14. Public health and immunology
15. Medical laboratory and diagnostics
16. Mental health and counselling
17. Research and laboratory science
18. Veterinary and animal health

Business, Finance, and Law, 19 to 27:
19. Finance
20. Accounting and audit
21. Banking
22. Insurance
23. Investment and fintech
24. Marketing and growth
25. Sales and business development
26. Human resources and recruiting
27. Law and legal

Engineering, Energy, and Environment, 28 to 34:
28. Civil and construction engineering
29. Mechanical and electrical engineering
30. Energy, oil, gas, and renewables
31. Environmental science and sustainability
32. Agriculture and food systems
33. Architecture and urban planning
34. Mining and natural resources

Education, Government, and Society, 35 to 41:
35. Education and teaching
36. Training and vocational skills
37. Government and public service
38. NGO, nonprofit, and development
39. International organisations and diplomacy
40. Community, social work, and care
41. Security, defence, and emergency services

Creative, Media, and Hospitality, 42 to 47:
42. Media, journalism, and writing
43. Film, music, and entertainment
44. Fashion and beauty
45. Hospitality, tourism, and travel
46. Sports and fitness
47. Food, beverage, and catering

Trades, Logistics, and Operations, 48 to 52:
48. Operations, supply chain, and procurement
49. Transport, aviation, and logistics
50. Manufacturing and production
51. Construction trades and skilled crafts
52. Retail, e-commerce, and customer service

Rule for the list: a category only stays if a real job can be found in it. No category exists only to look big. In v0, all 52 show as browse options, sample jobs cover at least 20 of them, and the rest show an honest empty state with a job alert, never a fake listing.

## Later, not now
- Cheap premium tiers for job seekers
- Featured listings for companies, schools, scholarships, and organisations
- Hiring and candidate data for employers, with consent and clear privacy rules
- No paid tier in v0. Free search first, prove it helps people find real jobs.

## What makes this different from LinkedIn and Indeed
The checked insight from 2026 guides for Nigerians: a job marked remote is often restricted to the US, Canada, or Europe. Himalayas stands out because it has a real Nigeria filter and timezone filter. Wellfound shows where a startup hires remotely from.
Our v0 must make eligibility impossible to miss on every card:
- Open to Nigeria: yes or no
- Open to Africa, or worldwide: yes or no
- Timezone overlap with WAT, in hours
- Salary shown in NGN and USD when the employer gives it, never guessed
- Posted date and a clear apply route, no fake listings

## UI direction, checked Nov 19 2026
Standing rule: Framer Marketplace is the UI source, free templates only as inspiration, never buy a paid template, never reuse a template used for another project.
Two free Framer job templates fit this product, neither used before:
1. Verixaa, free. Modern recruitment template, 14 pages, CMS jobs, blog and case studies. Job pages show salary, experience, work type, badge, and full company profile.
2. Jobhub, free. Clean modern job board, 17 pages, all jobs, job categories, job types, job locations, company pages, post a job, and built in monetisation thinking for later.
Workze, free, is the third option. It has dynamic filters for CMS entries, useful for the region, country, work mode, and salary filters.
Borrowed ideas, not copied code:
- From Verixaa: the job card with salary, work type badge, and company profile on the detail page
- From Workze: dynamic filters that update the list at once, no page reload feeling
- From the Nov 19 creative study: collapse many signals into one next step. On a job card, show one clear next step, Apply, Save, or Not eligible here, with the three reasons behind it, for example location match, skill match, and work mode match.
- From LinkedIn critique: keep filters visible, not hidden at the end of a horizontal scroll. The most used filters, location, work mode, and field, stay on screen.

## Feedback loops, iterate until it is right
Loop 1, prototype: clickable v0 with 20 real sample jobs, half Nigeria based or open to Nigeria, half worldwide. Test with 5 job seekers. Measure time to first relevant job, and how many tap a job that is not open to them. Target: zero wasted taps on ineligible jobs.
Loop 2, search: test the onboarding flow. Can a person set qualifications, location, and work mode in under 2 minutes on a phone, with no account needed to search?
Loop 3, trust: test salary, date, and apply route on every listing. Remove any listing where the apply link is dead or the eligibility is unclear.
Loop 4, repeat: fix only the biggest failure from each loop, retest with the same 5 people, then widen to 20 people.
Do not launch publicly until Loop 1 and Loop 2 pass with real users.

## V0 scope, proposed
- Search by role or skill, plus location scope: global, Africa, country, city
- Browse all 52 areas, with filters inside each area
- Filters: remote, hybrid, on site; full time, contract, internship; salary band; posted in last 7 or 30 days
- Job card: title, company, location scope, work mode, salary if given, eligibility for Nigeria, posted date, match reason in plain words
- Job detail: full description, requirements, apply link, company profile
- Save jobs, no account needed to search, account only to save and get alerts
- Mobile first, phone is how most users in Nigeria will use it
- No employer posting, no premium, no scholarships in v0. Those come after search works.

## Getting users, without launching too early
The goal is real users, not a launch post with no jobs behind it.
- Step 1: 5 testers from Nigeria, across different fields, use the prototype and report where they get stuck
- Step 2: 20 testers, widened to more of the 52 areas, plus a simple waitlist for job alerts by field and location
- Step 3: only then share publicly, with live jobs in at least 20 areas and a clear eligibility line on every card
- Early users come from people already looking for work, not from ads. The waitlist is by field, so a nurse, a teacher, and a software engineer each get alerts only for their field.

## Open decisions, one at a time
1. First decision: is this 52 area list right, and should I build the v0 prototype with all 52 as browse options?
2. Later: product name, colours, and logo
3. Later: where real job listings come from in v0, curated manual list or a live feed
4. Later: premium price points, only after free search is proven

## Next updates, agreed Nov 19 2026 23:07 WAT, in order
1. Live jobs first. Test feed: JSearch, Google for Jobs aggregation, free 200 requests a month, Pro $25 for 10,000, checked Nov 19 2026. Adzuna does not cover Nigeria, its 19 country list has no NG code, so it is not the feed for Nigeria local jobs.
2. Trust and safety. Verified employer mark, Report this job, Never pay to apply on every card, plus the Loop 3 check on salary, date, and eligibility for every listing.
3. Saved jobs, with email registration and job alerts by field and location. Email when a new live job matches, for retention. Saved jobs must persist, not only in the session.
4. LinkedIn linking deferred to a later update, not in this round.
5. Name: Anfààní, picked Nov 22 2026 by 5, Yoruba ànfààní, advantage, privilege, benefit, opportunity, from Hausa anfani, Arabic naf. Name history note: Fyndr was an earlier name tried the same day and rejected because it was already used in recruiting, including in Nigeria. CONFLICT WARNING: Anfààní also has conflicts, a UK wellness app founded 2022 at anfaani.co, an EU and UNICEF backed Nigeria opportunity platform Anfani by Beere Software, and Project Anfaani in Ibadan, plus anfaani.com and anfaani.ng are registered, so do not buy a domain. 5 sent Anfààní again Nov 22 18:48 WAT after the warning, treated as keep Anfààní anyway with the tone marked spelling Anfààní. Logo v1 made Nov 22: magnifier plus pin mark, wordmark anfààní, indigo #4F46E5 light, #818CF8 dark, files in ~/workspace/job-platform/anfaani-logo/, anfaani-logo-light.svg, anfaani-logo-dark.svg, anfaani-icon.svg. Logo v2, Nov 22 18:49 WAT, 5 asked for another logo, keep the word: three new marks, Door, Steps, Sun, same wordmark. 5 picked Door Nov 22 18:50 WAT. Final Door set in ~/workspace/job-platform/anfaani-logo/v2/, anfaani-door-light.svg, anfaani-door-dark.svg, anfaani-door-icon.svg, plus PNG renders, all rendered and checked, door is an arch with the panel ajar, opportunity opens a door. 5 said Nov 22 18:52 WAT the light version is the official logo, copied as anfaani-official-light.svg and .png in ~/workspace/job-platform/anfaani-logo/, dark and icon stay as supporting versions. Fallback clean names if the name is ever revisited: Occasa, Ascara, Vynra, Jorva, Ezuna, Olora, web check only, no trademark or domain check yet.
6. Testers: 5 will find friends and family searching for jobs to test the app.
7. CV builder, added Nov 19 2026 23:59 WAT, before the name is picked. Sticky top bar with internal links (Find jobs, Browse fields, How matching works, Create CV, Tailor CV), three line menu with Create CV, Tailor CV, Saved jobs, Match profile, and Log in. Login is optional, not compulsory, no account needed to search or build a CV. CV page: form for contact details, summary, skills, work experience and education, live preview, Download CV and Copy as text. Tailor CV from the menu, from a Tailor CV button on every job card and in the job detail modal, or by picking any of the 88 sample jobs in the builder. It checks skills against that job, lists matched and missing skills, missing skills can be added only by tapping, with a note to add only skills you truly have, puts matching skills first, and adds an Applying for fit note to the preview and downloads. No storage in the prototype, everything stays on screen only. Name search paused for this work. Adwuma was tapped by mistake and is not picked, it is already a Ghana job platform, okAdwuma, so it is out.
8. Scholarships, added Nov 20 2026 19:52 WAT, approved by 5 Nov 20 19:47 WAT. Jobs / Scholarships toggle in the hero and above the results, same keyword search works for both at once and narrows both to the searched field. 24 sample scholarships across 22 fields, clearly labelled sample, not live. Filters: field from the same 52 fields, level Undergraduate / Masters / PhD / Postdoc / Fellowship, destination, funding Fully funded / Partial / Tuition only, deadline, open to Nigeria only, saved only. Compact wide cards with funding amount and what it covers, deadline badge, eligibility pill and Save, paginated 6 per page. Detail modal with about, what it covers, who can apply, how to apply steps and a prototype Apply button. Saved scholarships work in parallel to saved jobs, from the profile strip and the menu. Browse all 52 fields shows job and scholarship counts and filters whichever tab is active.
9. Live feed plan, approved Nov 20 2026 20:11 WAT, domain buying deferred to next month, about Dec 2026. Source: JSearch free tier first, 200 requests a month, Pro $25 for 10,000 if needed, aggregates Google for Jobs, LinkedIn, Indeed, Glassdoor, company pages. Adzuna ruled out for Nigeria, no NG code. Open feeds RemoteOK, WeWorkRemotely, Remotive, Jobicy are backup, not the main feed. Method: backend on Vercel, fetch once every 3 days, cache, dedupe, normalise to our card format, eligibility check on every listing, open to Nigeria, scope, timezone overlap with WAT, salary only if given, posted date, verified apply link. Users read the cached copy, no per user API burn. Budget: about 10 core searches per refresh, 10 refreshes a month, about 100 requests, inside free 200. Do not search all 52 fields individually, that would blow the cap. Hosting: Vercel Hobby $0, 100 GB, 1 million requests, 100 deploys a day, free .vercel.app for now. Domain: about $11 a year for .com, buy next month after the name is picked, point DNS to Vercel, no app code change. Mercor is separate and manual, per job referral links refreshed while signed in, no API credits, referral use cap 100 per 30 days. Scholarships stay sample in this step, live later.
10. Revised live feed plan, Nov 20 2026 20:14 WAT, 5 corrected the plan: not JSearch only, pull from a lot of places, goal is the platform with most jobs available. Fetch 3 to 5 times a day, cached, users read the saved copy and click the original apply link, no per user API burn. Sources split by cap: uncapped or polite free feeds carry the 3 to 5 times a day refresh, RemoteOK one JSON feed no published quota, WeWorkRemotely RSS, Remotive at most 4 calls a day advised, Jobicy at most once an hour, Arbeitnow, plus Greenhouse, Lever and Ashby per company, no published quota. Capped aggregators are used sparingly, JSearch 200 requests a month, SerpApi 250 searches a month, Adzuna 2500 a month but no Nigeria, JobsPipe 1000 credits one time only, not refilled. JSearch and SerpApi about once every 3 days for big board Nigeria and remote roles, about 100 to 150 capped requests a month, inside free. Terms: link back and credit RemoteOK and Remotive on each card, Remotive asks not to pass its jobs on to other job sites, so check its terms before re-hosting. Vercel Hobby cron is at most once a day, so 3 to 5 fetches a day needs a free external trigger such as GitHub Actions, or Vercel Pro, otherwise use a fetch on first visit after a few hours. Vercel deploys are 100 a day, so 3 to 5 data updates a day fit, Netlify would not, 15 credits per production deploy.

## Neatness recheck, Nov 22 2026 20:27 WAT, verified
Brand rule: Anfààní only. No Fyndr name, logo, or wordmark anywhere in the site, repo, or backend, except the one name-history note in item 5 above. No WorkBridge, no Global Job Search Platform as a product name, no anfaani-backend as a product name. Palette black, white, indigo #4F46E5 light / #818CF8 dark, red only for warnings, no green.
- GitHub repo tydavid5/anfaani: verified Nov 22 2026, root files .github/workflows/fetch-jobs.yml, .gitignore, CONCEPT.md, README.md, anfaani-logo/, backend/. No fyndr-logo folder, no PUSH-TEST.md. Root README.md was empty, replaced with a proper Anfààní README (commit via create_or_update_file, SHA 2340267d). Updated CONCEPT.md, .gitignore, backend/package.json, backend/src/server.js, backend/README.md pushed in commit cbfc8a8b.
- Backend: npm test 10 pass, 0 fail, run Nov 22 2026 after the rename. jobs.json fetched 2026-11-22T18:18:30Z, 616 jobs, 616 unique https apply URLs, 0 non-https, eligibility present on all 616. API server started locally on port 3456: /api/health returned ok true, service anfaani, jobs 616, email_configured false; /api/jobs returned total 616; nigeria_only returned total 121. No .env file, no node_modules, no secrets found. Package name renamed from anfaani-backend to anfaani, health service renamed the same way.
- Fyndr history: the local fyndr-logo folder was moved to ~/workspace/job-platform/archive/fyndr-logo-2026-11-22/, and archive/ was added to .gitignore, so it cannot be pushed or mixed in again. The 9 Fyndr files previously pushed to the repo were deleted, verified: the fyndr-logo folder no longer exists in the repo.
- Site inspection: artifact inspection dispatched Nov 22 2026, result pending at the time this section was written, see the recheck report for its outcome.
- Outstanding: no live deployment exists, no Resend email key, no domain yet (deferred Dec 2026). Alerts, reports, and saved jobs are JSON files and will not persist reliably on Vercel serverless.
