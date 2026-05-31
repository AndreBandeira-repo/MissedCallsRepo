import { Resend } from "resend";
import type { Business, Lead } from "./types";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendNewLeadEmail(business: Business, lead: Lead) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const preview = lead.message.slice(0, 80);
  const jobHint = lead.job_type ? ` (${lead.job_type})` : "";

  await resend.emails.send({
    from,
    to: business.notification_email,
    subject: `New lead from missed call${jobHint}`,
    html: `
      <h2>New lead for ${business.business_name}</h2>
      <p><strong>Phone:</strong> ${lead.caller_phone}</p>
      ${lead.caller_name ? `<p><strong>Name:</strong> ${lead.caller_name}</p>` : ""}
      ${lead.job_type ? `<p><strong>Job type:</strong> ${lead.job_type}</p>` : ""}
      <p><strong>Message:</strong> ${lead.message}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/leads/${lead.id}">View in dashboard</a></p>
      <hr />
      <p style="color:#666;font-size:12px">${preview}</p>
    `,
  });
}
