import { Resend } from "resend";
import { resolveAppBaseUrl } from "@/lib/app-url";
import { COMPANY_NAME, SUPPORT_EMAIL } from "@/lib/site-config";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  const from = process.env.RESEND_FROM?.trim();
  if (from) return from;
  return `${COMPANY_NAME} <onboarding@resend.dev>`;
}

export async function sendWelcomeEmail(to: string) {
  const resend = getResend();
  if (!resend) return { ok: false as const, skipped: "RESEND_API_KEY missing" };

  const base = resolveAppBaseUrl();
  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `Welcome to ${COMPANY_NAME}`,
    html: `
      <p>Thanks for joining ${COMPANY_NAME}.</p>
      <p>Upload a photo of any automotive part to get OEM-style codes, fitment hints, and US retailer links.</p>
      <p><a href="${base}/dashboard">Open your dashboard</a></p>
      <p style="color:#666;font-size:12px;">Questions? ${SUPPORT_EMAIL}</p>
    `
  });
  return { ok: true as const };
}

export async function sendLimitWarningEmail(to: string, used: number, limit: number) {
  const resend = getResend();
  if (!resend) return { ok: false as const, skipped: "RESEND_API_KEY missing" };

  const base = resolveAppBaseUrl();
  const remaining = Math.max(0, limit - used);
  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `${COMPANY_NAME}: ${remaining} identification${remaining === 1 ? "" : "s"} left this month`,
    html: `
      <p>You have used <strong>${used}</strong> of <strong>${limit}</strong> part identifications this billing period.</p>
      <p>Upgrade your plan to keep analyzing parts without interruption.</p>
      <p><a href="${base}/pricing">View plans</a></p>
    `
  });
  return { ok: true as const };
}

export async function sendLimitReachedEmail(to: string, limit: number) {
  const resend = getResend();
  if (!resend) return { ok: false as const, skipped: "RESEND_API_KEY missing" };

  const base = resolveAppBaseUrl();
  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `${COMPANY_NAME}: monthly identification limit reached`,
    html: `
      <p>You have used all <strong>${limit}</strong> identifications included in your current plan.</p>
      <p>Upgrade to continue, or wait until your next billing cycle resets your allowance.</p>
      <p><a href="${base}/pricing">Upgrade now</a></p>
    `
  });
  return { ok: true as const };
}
