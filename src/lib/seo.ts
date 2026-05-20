import type { Metadata } from "next";
import { PRODUCTION_SITE_URL, resolveAppBaseUrl } from "@/lib/app-url";

export const SITE_NAME = "PartFinder AI";
export const SITE_LOCALE = "en_US";

export const DEFAULT_TITLE =
  "PartFinder AI — Identify Car Parts by Photo | OEM Codes & Fitment (USA)";

export const DEFAULT_DESCRIPTION =
  "Upload a photo of any automotive part and get OEM-style part numbers, vehicle fitment hints, and links to US retailers like Amazon, RockAuto, and AutoZone. Built for DIYers, body shops, and fleet teams across the United States.";

export const DEFAULT_KEYWORDS = [
  "car part identification",
  "identify auto parts by photo",
  "OEM part number lookup",
  "automotive parts finder",
  "car parts AI",
  "collision repair parts lookup",
  "RockAuto part number",
  "AutoZone parts search",
  "vehicle fitment lookup",
  "salvage yard parts identification",
  "USA auto parts"
];

export function getSiteUrl(): string {
  return resolveAppBaseUrl();
}

export { PRODUCTION_SITE_URL };

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function buildPageMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const title = options.title ?? DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const canonical = options.path ? absoluteUrl(options.path) : getSiteUrl();
  const keywords = options.keywords ?? DEFAULT_KEYWORDS;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
