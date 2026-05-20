import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPublicAppUrl } from "@/lib/app-url";
import { isUuid } from "@/lib/uuid";

const SHARE_DAYS = 7;

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  const searchId = context.params.id;
  if (!isUuid(searchId)) {
    return NextResponse.json({ error: "Invalid search id" }, { status: 400 });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: search, error: searchErr } = await admin
    .from("searches")
    .select("id, user_id")
    .eq("id", searchId)
    .maybeSingle();

  if (searchErr || !search) {
    return NextResponse.json({ error: "Search not found." }, { status: 404 });
  }

  if (search.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + SHARE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error: insertErr } = await admin.from("search_shares").insert({
    search_id: searchId,
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  const appUrl = getPublicAppUrl(request);
  return NextResponse.json({
    url: `${appUrl}/share/${token}`,
    expiresAt,
    expiresInDays: SHARE_DAYS
  });
}
