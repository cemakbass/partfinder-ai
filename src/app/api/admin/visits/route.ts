import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const params = new URL(request.url).searchParams;
  const limit = Math.min(Number(params.get("limit")) || 150, 500);
  const visitorId = params.get("visitor_id")?.trim();

  try {
    const admin = getSupabaseAdmin();
    let query = admin
      .from("site_visits")
      .select("id, visitor_id, user_id, path, referrer, user_agent, country, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (visitorId) {
      query = query.eq("visitor_id", visitorId);
    }

    const { data: visits, error } = await query;

    if (error) {
      const msg = error.message.includes("site_visits")
        ? "Database table site_visits is missing. Run supabase/migrations/20260515_site_visits.sql in Supabase SQL Editor."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const rows = visits ?? [];
    const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))] as string[];
    let emailById: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users } = await admin.from("users").select("id, email").in("id", userIds);
      if (users) {
        emailById = Object.fromEntries(users.map((u) => [u.id as string, u.email as string]));
      }
    }

    const enriched = rows.map((r) => ({
      ...r,
      user_email: r.user_id ? (emailById[r.user_id as string] ?? null) : null
    }));

    return NextResponse.json({ visits: enriched });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load visits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
