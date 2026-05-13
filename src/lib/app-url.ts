import type { NextRequest } from "next/server";

/**
 * Public base URL for redirects (Stripe success/cancel, emails, etc.).
 * Prefer NEXT_PUBLIC_APP_URL; fall back to Vercel or the incoming request origin.
 */
export function getPublicAppUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return request.nextUrl.origin.replace(/\/$/, "");
}
