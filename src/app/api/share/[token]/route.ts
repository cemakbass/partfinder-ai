import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: NextRequest, context: { params: { token: string } }) {
  const token = context.params.token?.trim();
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: share, error } = await admin
      .from("search_shares")
      .select("expires_at, search_id")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!share) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }

    if (new Date(share.expires_at as string) < new Date()) {
      return NextResponse.json({ error: "This share link has expired." }, { status: 410 });
    }

    const { data: search, error: searchErr } = await admin
      .from("searches")
      .select("id, result_json, vehicle_make, vehicle_model, vehicle_year, created_at")
      .eq("id", share.search_id as string)
      .maybeSingle();

    if (searchErr || !search) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      expiresAt: share.expires_at,
      search: {
        id: search.id,
        result_json: search.result_json,
        vehicle_make: search.vehicle_make,
        vehicle_model: search.vehicle_model,
        vehicle_year: search.vehicle_year,
        created_at: search.created_at
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load share";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
