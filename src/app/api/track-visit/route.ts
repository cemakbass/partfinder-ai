import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { shouldTrackPath, truncateField, VISITOR_COOKIE } from "@/lib/visit-tracking";
import { isUuid } from "@/lib/uuid";

export async function POST(request: NextRequest) {
  let body: { path?: string; referrer?: string };
  try {
    body = (await request.json()) as { path?: string; referrer?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path : "";
  if (!shouldTrackPath(path)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const cookieVisitor = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = cookieVisitor && isUuid(cookieVisitor) ? cookieVisitor : randomUUID();

  let userId: string | null = null;
  try {
    const supabase = createServerSupabase();
    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user?.id && isUuid(user.id)) {
        userId = user.id;
      }
    }
  } catch {
    // ignore session errors; still record anonymous visit
  }

  const referrer = truncateField(body.referrer);
  const userAgent = truncateField(request.headers.get("user-agent"));
  const country =
    truncateField(request.headers.get("x-vercel-ip-country"), 8) ??
    truncateField(request.headers.get("cf-ipcountry"), 8);

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("site_visits").insert({
      visitor_id: visitorId,
      user_id: userId,
      path,
      referrer,
      user_agent: userAgent,
      country
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to record visit";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  if (!cookieVisitor || !isUuid(cookieVisitor)) {
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return res;
}
