import Anthropic from "@anthropic-ai/sdk";
import type { PartAnalysisResult } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

function buildSearchLinks(partName: string) {
  const encoded = encodeURIComponent(partName);
  return {
    amazon: `https://www.amazon.com/s?k=${encoded}+car+part`,
    rockauto: "https://www.rockauto.com/en/partslist/",
    autozone: `https://www.autozone.com/searchresult?searchtext=${encoded}`
  };
}

function normalizeListings(raw: unknown): NonNullable<PartAnalysisResult["marketplaceListings"]> {
  if (!Array.isArray(raw)) return [];
  const out: NonNullable<PartAnalysisResult["marketplaceListings"]> = [];
  for (const item of raw.slice(0, 3)) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const site = typeof o.site === "string" ? o.site.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const priceDisplay =
      typeof o.priceDisplay === "string"
        ? o.priceDisplay.trim()
        : typeof o.price === "string"
          ? o.price.trim()
          : "";
    const currency = typeof o.currency === "string" ? o.currency.trim() : undefined;
    const imageUrl =
      typeof o.imageUrl === "string" && o.imageUrl.startsWith("https://") ? o.imageUrl.trim() : null;
    const listingUrl =
      typeof o.listingUrl === "string" && o.listingUrl.startsWith("https://")
        ? o.listingUrl.trim()
        : typeof o.url === "string" && o.url.startsWith("https://")
          ? o.url.trim()
          : "";
    const inStock = o.inStock === true;
    if (!site || !listingUrl) continue;
    out.push({
      site,
      title: title || site,
      priceDisplay: priceDisplay || "—",
      currency,
      imageUrl,
      inStock,
      listingUrl
    });
  }
  return out;
}

function normalizeResult(parsed: PartAnalysisResult): PartAnalysisResult {
  const partName = typeof parsed.partName === "string" ? parsed.partName : "Unknown part";
  const estimatedDamage =
    typeof parsed.estimatedDamage === "string" && parsed.estimatedDamage.trim()
      ? parsed.estimatedDamage.trim()
      : "Could not infer damage severity from the image; an in-person inspection is recommended.";

  const damageRelatedParts = Array.isArray(parsed.damageRelatedParts)
    ? parsed.damageRelatedParts.filter((x): x is string => typeof x === "string").slice(0, 8)
    : undefined;

  const marketplaceListings = normalizeListings(
    (parsed as unknown as { marketplaceListings?: unknown }).marketplaceListings
  );

  return {
    ...parsed,
    partName,
    estimatedDamage,
    damageRelatedParts,
    marketplaceListings
  };
}

export async function analyzeCarPart(
  imageBase64: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp",
  vehicleInfo?: { make: string; model: string; year: string }
): Promise<PartAnalysisResult> {
  const vehicleContext = vehicleInfo
    ? `Vehicle Context: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}.`
    : "Vehicle Context: Not provided.";

  const prompt = `You are an expert automotive parts specialist and collision assessor.
Analyze this image: identify the primary damaged or relevant part AND assess visible damage.
${vehicleContext}

Language rules:
- Write ALL user-facing text in English: "description", "additionalNotes", "estimatedDamage", listing "title", and any notes.
- Use standard English/OEM-style part naming where appropriate.

Respond ONLY with valid JSON (no markdown):
{
  "partName": "string",
  "oemCode": "string",
  "category": "string",
  "description": "string",
  "compatibleVehicles": ["string"],
  "searchLinks": {
    "amazon": "string",
    "rockauto": "string",
    "autozone": "string"
  },
  "confidence": "high|medium|low",
  "additionalNotes": "string",
  "estimatedDamage": "English: visible damage assessment, affected surfaces, suspected underlying structure (estimate only; verify in person).",
  "damageRelatedParts": ["optional: other parts likely affected, max 8 short strings in English"],
  "marketplaceListings": [
    {
      "site": "e.g. eBay, Amazon, RockAuto, AutoZone — only sites where you can provide a plausible HTTPS URL",
      "title": "Short listing or product title in English",
      "priceDisplay": "e.g. $420 or EUR 380 (plain text)",
      "currency": "optional USD|EUR|TRY|GBP",
      "imageUrl": "https://... product image URL, or null",
      "inStock": true,
      "listingUrl": "https://... direct product or search results page"
    }
  ]
}

STRICT rules for marketplaceListings:
- Return AT MOST 3 objects. Never return more than 3.
- Prefer different reputable sites when possible (mix marketplaces and auto parts retailers).
- "listingUrl" MUST be a plausible HTTPS URL (product page or site search for this exact part/OEM). Do not invent domains that do not exist.
- "imageUrl" MUST be null OR a valid https image URL you are confident exists (CDN/product image). If unsure, use null.
- "inStock": only true if realistically likely in stock; otherwise false.
- Add a short honesty note: prices/stock are indicative; user must verify on the site.

If the image is not vehicle damage, still give best-effort part ID and empty damageRelatedParts if not applicable.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: imageBase64
            }
          },
          {
            type: "text",
            text: prompt
          }
        ]
      }
    ]
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";
  const clean = text.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new Error("AI response could not be parsed.");
  }

  const base = parsed as PartAnalysisResult;
  const pn = typeof base.partName === "string" && base.partName.trim() ? base.partName.trim() : "car part";
  base.partName = pn;
  base.searchLinks = buildSearchLinks(pn);
  return normalizeResult(base);
}
