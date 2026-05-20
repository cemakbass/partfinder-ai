import { resolveAppBaseUrl } from "@/lib/app-url";

/**
 * llms.txt — short site summary for AI crawlers and assistants (see llmstxt.org).
 * Public marketing pages are also in /sitemap.xml and allowed in /robots.txt.
 */
export function GET() {
  const base = resolveAppBaseUrl();

  const body = `# PartFinder AI

> Identify automotive parts from a photo — OEM-style codes, vehicle fitment hints, and US retailer links. Built for DIYers, repair shops, and collision estimators in the United States.

## Canonical site
- ${base}

## What this product does
- User uploads a photo of a car part on the web dashboard.
- Vision AI returns part name, OEM-style reference, likely year/make/model fitment, damage notes, and links to major US parts retailers (Amazon, RockAuto, AutoZone, O'Reilly).
- Results are research aids; users must verify fitment with VIN, OEM data, and a qualified technician.

## Public pages (crawlable)
- ${base}/ — product overview, features, pricing summary, FAQ
- ${base}/pricing — subscription plans (USD, Stripe)
- ${base}/register — create account
- ${base}/login — sign in

## Not publicly indexed
- /dashboard — requires login (part analysis tool)
- /admin — admin only
- /api/* — server APIs

## Sitemap
- ${base}/sitemap.xml

## Contact / brand
- PartFinder AI
- Primary market: United States (en-US)
`;

  return new Response(body.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
