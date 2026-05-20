import { PRODUCTION_SITE_URL } from "@/lib/app-url";

function isLocalHost(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Where Supabase should send users after email confirm (must be allowlisted in Supabase Auth URLs). */
export function getAuthCallbackUrl(): string {
  if (typeof window !== "undefined") {
    const origin = window.location.origin.replace(/\/$/, "");
    if (!isLocalHost(origin)) {
      return `${origin}/auth/callback`;
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv && !isLocalHost(fromEnv)) {
    return `${fromEnv}/auth/callback`;
  }

  return `${PRODUCTION_SITE_URL}/auth/callback`;
}
