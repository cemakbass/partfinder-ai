import type { SupabaseClient } from "@supabase/supabase-js";

export const PART_IMAGES_BUCKET = "part-images";

/** Signed links for viewing uploads in browser (not for long-term sharing). */
export const PART_IMAGE_SIGNED_URL_TTL_SECONDS = 900;

/**
 * `searches.image_url` stores the object path inside `part-images` (e.g. `uuid/timestamp-abc.bin`).
 * Legacy rows may still hold a full public URL until migration runs.
 */
export function objectPathFromStoredImageUrl(stored: string): string | null {
  const v = stored.trim();
  if (!v) return null;
  if (v.includes("..")) return null;

  if (v.startsWith("http://") || v.startsWith("https://")) {
    const publicMarker = `/object/public/${PART_IMAGES_BUCKET}/`;
    const i = v.indexOf(publicMarker);
    if (i !== -1) {
      const path = v.slice(i + publicMarker.length).split("?")[0];
      return path || null;
    }
    return null;
  }

  return v;
}

export async function createSignedPartImageUrl(
  admin: SupabaseClient,
  objectPath: string,
  expiresIn = PART_IMAGE_SIGNED_URL_TTL_SECONDS
): Promise<{ signedUrl: string } | { error: string }> {
  const { data, error } = await admin.storage.from(PART_IMAGES_BUCKET).createSignedUrl(objectPath, expiresIn);
  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "Could not sign image URL." };
  }
  return { signedUrl: data.signedUrl };
}
