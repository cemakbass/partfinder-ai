import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  try {
    const admin = getSupabaseAdmin();

    const { count: userCount, error: userCountError } = await admin.from("users").select("*", { count: "exact", head: true });
    if (userCountError) {
      return NextResponse.json({ error: userCountError.message }, { status: 500 });
    }

    const { count: searchCount, error: searchCountError } = await admin
      .from("searches")
      .select("*", { count: "exact", head: true });
    if (searchCountError) {
      return NextResponse.json({ error: searchCountError.message }, { status: 500 });
    }

    const { data: planRows, error: planError } = await admin.from("users").select("plan");
    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }

    const planBreakdown: Record<string, number> = {};
    for (const row of planRows ?? []) {
      const p = (row as { plan: string }).plan;
      planBreakdown[p] = (planBreakdown[p] ?? 0) + 1;
    }

    const { data: recent, error: recentError } = await admin
      .from("searches")
      .select("id, user_id, created_at, result_json, vehicle_make, vehicle_model, vehicle_year")
      .order("created_at", { ascending: false })
      .limit(8);

    if (recentError) {
      return NextResponse.json({ error: recentError.message }, { status: 500 });
    }

    return NextResponse.json({
      userCount: userCount ?? 0,
      searchCount: searchCount ?? 0,
      planBreakdown,
      recentSearches: recent ?? []
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
