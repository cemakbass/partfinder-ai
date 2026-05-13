import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getOrCreateUserProfile } from "@/lib/user-profile";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const supabase = createServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server misconfigured: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 503 }
      );
    }
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getOrCreateUserProfile(user.id, user.email);
    const supabaseAdmin = getSupabaseAdmin();
    const { data: history, error: historyError } = await supabaseAdmin
      .from("searches")
      .select("id, image_url, result_json, vehicle_make, vehicle_model, vehicle_year, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 });
    }

    return NextResponse.json({
      usage,
      history: history ?? [],
      isAdmin: isAdminEmail(user.email)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
