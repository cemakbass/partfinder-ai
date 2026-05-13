export type Plan = "free" | "starter" | "pro" | "ultra";

export interface SearchLinks {
  amazon: string;
  rockauto: string;
  autozone: string;
}

/** Up to 3 representative online listings (AI-synthesized from typical retail; verify on site). */
export interface MarketplaceListing {
  site: string;
  title: string;
  priceDisplay: string;
  currency?: string;
  /** HTTPS product/listing image URL when known; null if none. */
  imageUrl: string | null;
  inStock: boolean;
  listingUrl: string;
}

export interface PartAnalysisResult {
  partName: string;
  oemCode: string;
  category: string;
  description: string;
  compatibleVehicles: string[];
  searchLinks: SearchLinks;
  confidence: "high" | "medium" | "low";
  additionalNotes: string;
  /** Visible damage estimate from the photo (optional on legacy saved results). */
  estimatedDamage?: string;
  /** Other parts likely affected (optional). */
  damageRelatedParts?: string[];
  /** Max 3 items when present (optional on legacy saved results). */
  marketplaceListings?: MarketplaceListing[];
}

export interface SearchRecord {
  id: string;
  image_url: string;
  result_json: PartAnalysisResult;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  created_at: string;
}
