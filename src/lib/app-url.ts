import type { NextRequest } from "next/server";

/** Canonical production domain (custom domain on Vercel). */
export const PRODUCTION_SITE_URL = "https://avtopartfinder.com";

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, "");
}

function isLocalUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Public base URL for redirects, sitemap, canonical links, and emails.
 * Production on Vercel always uses avtopartfinder.com unless a non-local NEXT_PUBLIC_APP_URL is set.
 */
export function resolveAppBaseUrl(options?: { requestOrigin?: string }): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const envUrl = fromEnv ? normalizeBaseUrl(fromEnv) : null;

  if (process.env.VERCEL_ENV === "production") {
    if (envUrl && !isLocalUrl(envUrl)) return envUrl;
    return PRODUCTION_SITE_URL;
  }

  if (envUrl) return envUrl;

  if (process.env.VERCEL_URL) {
    return `https://${normalizeBaseUrl(process.env.VERCEL_URL)}`;
  }

  if (options?.requestOrigin) {
    return normalizeBaseUrl(options.requestOrigin);
  }

  return PRODUCTION_SITE_URL;
}

export function getPublicAppUrl(request: NextRequest): string {
  return resolveAppBaseUrl({ requestOrigin: request.nextUrl.origin });
}
