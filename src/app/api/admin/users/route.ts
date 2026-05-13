import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);

  try {
    const admin = getSupabaseAdmin();
    let query = admin
      .from("users")
      .select("id, email, plan, searches_used, searches_limit, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (q) {
      query = query.ilike("email", `%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
