// Email sending through Resend, with a clear no-op path.
// No key is ever logged or printed. If RESEND_API_KEY is absent, sending
// is a no-op and the caller is told so, so nothing is ever claimed as sent
// when it was not.

const RESEND_URL = "https://api.resend.com/emails";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

export async function sendEmail({ to, subject, html, text }) {
  if (!emailConfigured()) {
    return { sent: false, reason: "no_resend_key" };
  }
  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: [to],
      subject,
      html: html || text || "",
      text: text || "",
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, reason: `resend_${response.status}`, detail: body.slice(0, 200) };
  }
  const data = await response.json().catch(() => ({}));
  return { sent: true, id: data.id || null };
}
