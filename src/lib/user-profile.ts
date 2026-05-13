import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface UserProfileUsage {
  searches_used: number;
  searches_limit: number;
}

export async function getOrCreateUserProfile(
  userId: string,
  email: string | null | undefined
): Promise<UserProfileUsage> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("users")
    .select("searches_used, searches_limit")
    .eq("id", userId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: createError } = await supabaseAdmin
    .from("users")
    .insert({
      id: userId,
      email: email ?? "",
      plan: "free",
      searches_used: 0,
      searches_limit: 2
    })
    .select("searches_used, searches_limit")
    .single();

  if (createError || !created) {
    throw new Error(createError?.message ?? "Could not create user profile.");
  }

  return created;
}
