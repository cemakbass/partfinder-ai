import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const limit = Math.min(Number(new URL(request.url).searchParams.get("limit")) || 100, 500);

  try {
    const admin = getSupabaseAdmin();
    const { data: searches, error } = await admin
      .from("searches")
      .select("id, user_id, created_at, image_url, vehicle_make, vehicle_model, vehicle_year, result_json")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = searches ?? [];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    let emailById: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users, error: userErr } = await admin.from("users").select("id, email").in("id", userIds);
      if (!userErr && users) {
        emailById = Object.fromEntries(users.map((u) => [u.id as string, u.email as string]));
      }
    }

    const enriched = rows.map((r) => ({
      ...r,
      user_email: emailById[r.user_id as string] ?? "—"
    }));

    return NextResponse.json({ searches: enriched });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load searches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
