import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export type VisitorSummary = {
  visitor_id: string;
  user_id: string | null;
  user_email: string | null;
  visit_count: number;
  first_seen_at: string;
  last_seen_at: string;
  last_path: string | null;
  country: string | null;
};

export async function GET(request: NextRequest) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const limit = Math.min(Number(new URL(request.url).searchParams.get("limit")) || 200, 500);
  const scanLimit = Math.min(limit * 40, 8000);

  try {
    const admin = getSupabaseAdmin();
    const { data: rows, error } = await admin
      .from("site_visits")
      .select("visitor_id, user_id, path, country, created_at")
      .order("created_at", { ascending: false })
      .limit(scanLimit);

    if (error) {
      const msg = error.message.includes("site_visits")
        ? "Database table site_visits is missing. Run supabase/migrations/20260515_site_visits.sql in Supabase SQL Editor."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const visits = rows ?? [];
    const byVisitor = new Map<
      string,
      {
        visitor_id: string;
        user_id: string | null;
        visit_count: number;
        first_seen_at: string;
        last_seen_at: string;
        last_path: string | null;
        country: string | null;
      }
    >();

    for (const v of visits) {
      const vid = v.visitor_id as string;
      const created = v.created_at as string;
      const existing = byVisitor.get(vid);
      if (!existing) {
        byVisitor.set(vid, {
          visitor_id: vid,
          user_id: (v.user_id as string | null) ?? null,
          visit_count: 1,
          first_seen_at: created,
          last_seen_at: created,
          last_path: (v.path as string) ?? null,
          country: (v.country as string | null) ?? null
        });
        continue;
      }
      existing.visit_count += 1;
      if (created < existing.first_seen_at) {
        existing.first_seen_at = created;
      }
      if (created > existing.last_seen_at) {
        existing.last_seen_at = created;
        existing.last_path = (v.path as string) ?? existing.last_path;
        if (v.country) existing.country = v.country as string;
      }
      if (v.user_id && !existing.user_id) {
        existing.user_id = v.user_id as string;
      }
    }

    const summaries = [...byVisitor.values()]
      .sort((a, b) => b.last_seen_at.localeCompare(a.last_seen_at))
      .slice(0, limit);

    const userIds = [...new Set(summaries.map((s) => s.user_id).filter(Boolean))] as string[];
    let emailById: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users } = await admin.from("users").select("id, email").in("id", userIds);
      if (users) {
        emailById = Object.fromEntries(users.map((u) => [u.id as string, u.email as string]));
      }
    }

    const visitors: VisitorSummary[] = summaries.map((s) => ({
      ...s,
      user_email: s.user_id ? (emailById[s.user_id] ?? null) : null
    }));

    return NextResponse.json({ visitors, uniqueCount: visitors.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load visitors";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
