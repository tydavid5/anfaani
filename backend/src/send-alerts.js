// Send new-job alert emails to registered alert subscribers.
// Run manually or on a schedule: node src/send-alerts.js
// No-op when RESEND_API_KEY or FROM_EMAIL is not set. Nothing is ever
// claimed as sent when it was not.

import { readJobs, readJson } from "./store.js";
import { sendEmail, emailConfigured } from "./email.js";

function matches(job, alert) {
  if (alert.field && job.field && job.field !== alert.field) return false;
  if (alert.location && alert.location !== "anywhere") {
    if (!`${job.location} ${job.scope}`.toLowerCase().includes(alert.location.toLowerCase())) return false;
  }
  if (alert.mode && alert.mode !== "any") {
    if ((job.workMode || "").toLowerCase() !== alert.mode.toLowerCase()) return false;
  }
  return true;
}

async function main() {
  if (!emailConfigured()) {
    console.log("Email not configured: RESEND_API_KEY or FROM_EMAIL is not set. Nothing sent.");
    return;
  }
  const data = readJobs();
  const alerts = readJson("alerts.json", []);
  if (alerts.length === 0) {
    console.log("No alert registrations. Nothing sent.");
    return;
  }
  // Jobs fetched in the last 24 hours only, so repeat runs do not resend.
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const fresh = (data.jobs || []).filter((j) => j.postedDate && new Date(j.postedDate).getTime() > cutoff);

  let sent = 0;
  for (const alert of alerts) {
    const matchesForAlert = fresh.filter((job) => matches(job, alert)).slice(0, 10);
    if (matchesForAlert.length === 0) continue;
    const lines = matchesForAlert
      .map((job) => `- ${job.title} at ${job.company} (${job.location}) - ${job.applyUrl}`)
      .join("\n");
    const result = await sendEmail({
      to: alert.email,
      subject: `Anfààní: ${matchesForAlert.length} new job${matchesForAlert.length > 1 ? "s" : ""} in ${alert.field}`,
      text: `New jobs in ${alert.field} on Anfààní:\n\n${lines}\n\nYou are receiving this because you registered a job alert. Reply to unsubscribe, or delete your alert in the app.`,
    });
    if (result.sent) sent += 1;
    else console.error(`Failed to send to ${alert.email}: ${result.reason}`);
  }
  console.log(`Sent ${sent} alert email(s) to ${alerts.length} registration(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
