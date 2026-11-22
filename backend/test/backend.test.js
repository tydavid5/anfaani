import { test } from "node:test";
import assert from "node:assert/strict";
import { analyseEligibility } from "../src/eligibility.js";
import { inferField } from "../src/fields.js";
import { normaliseJob, normaliseUrl, dedupeJobs } from "../src/normalize.js";

test("eligibility: Nigeria named is yes, 8h overlap", () => {
  const e = analyseEligibility("Lagos, Nigeria");
  assert.equal(e.openToNigeria, "yes");
  assert.equal(e.timezoneOverlapWAT, 8);
});

test("eligibility: worldwide is yes, overlap not stated", () => {
  const e = analyseEligibility("Worldwide");
  assert.equal(e.openToNigeria, "yes");
  assert.equal(e.timezoneOverlapWAT, null);
});

test("eligibility: US only is no", () => {
  const e = analyseEligibility("United States");
  assert.equal(e.openToNigeria, "no");
});

test("eligibility: unspecified location is not stated", () => {
  const e = analyseEligibility("Berlin");
  assert.equal(e.openToNigeria, "not stated");
});

test("field inference: nursing title maps to Nursing and midwifery", () => {
  assert.equal(inferField("Registered Nurse, ICU"), "Nursing and midwifery");
});

test("field inference: unknown title maps to null", () => {
  assert.equal(inferField("Chief Vibes Officer"), null);
});

test("normaliseUrl: http and non-URLs are rejected, utm stripped", () => {
  assert.equal(normaliseUrl("http://example.com/job"), null);
  assert.equal(normaliseUrl("not a url"), null);
  assert.equal(
    normaliseUrl("https://example.com/job?utm_source=x&ref=1"),
    "https://example.com/job?ref=1",
  );
});

test("normaliseJob: salary only when given, eligibility always present", () => {
  const job = normaliseJob(
    { title: "Nurse", company: "Clinic", location: "Worldwide", applyUrl: "https://example.com/j/1" },
    "RemoteOK",
  );
  assert.equal(job.salary, null);
  assert.equal(job.eligibility.openToNigeria, "yes");
  assert.equal(job.source, "RemoteOK");
});

test("normaliseJob: no https apply link is dropped", () => {
  assert.equal(
    normaliseJob({ title: "Nurse", company: "Clinic", applyUrl: "http://example.com/j/1" }, "RemoteOK"),
    null,
  );
});

test("dedupeJobs: same apply URL counted once", () => {
  const a = normaliseJob({ title: "A", company: "C", applyUrl: "https://example.com/j/1" }, "RemoteOK");
  const b = normaliseJob({ title: "A", company: "C", applyUrl: "https://example.com/j/1" }, "Jobicy");
  assert.equal(dedupeJobs([a, b]).length, 1);
});
