import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isUuid } from "@/lib/uuid";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthBody = {
  email?: string;
  /** GoTrue ban duration, e.g. "24h", or "none" / "" to lift ban */
  banDuration?: string;
};

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const userId = context.params.id;
  if (!isUuid(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  let body: AuthBody;
  try {
    body = (await request.json()) as AuthBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const hasEmail = body.email !== undefined;
  const hasBan = body.banDuration !== undefined;

  if (!hasEmail && !hasBan) {
    return NextResponse.json({ error: "Provide email and/or banDuration" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();

    if (hasBan) {
      const raw = String(body.banDuration).trim();
      const banDuration = raw === "" || raw === "none" ? "none" : raw;

      if (banDuration !== "none" && auth.userId === userId) {
        return NextResponse.json({ error: "Cannot ban your own account" }, { status: 400 });
      }

      const { error: banError } = await admin.auth.admin.updateUserById(userId, { ban_duration: banDuration });
      if (banError) {
        return NextResponse.json({ error: banError.message }, { status: 400 });
      }

      if (banDuration === "none") {
        await admin.from("login_throttle").delete().eq("user_id", userId);
      }
    }

    if (hasEmail) {
      const email = body.email!.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }

      const { error: updateAuthError } = await admin.auth.admin.updateUserById(userId, {
        email,
        email_confirm: true
      });

      if (updateAuthError) {
        return NextResponse.json({ error: updateAuthError.message }, { status: 400 });
      }

      const { error: syncError } = await admin.from("users").update({ email }).eq("id", userId);
      if (syncError) {
        return NextResponse.json(
          {
            error: `Auth email updated but profile sync failed: ${syncError.message}. Fix manually in public.users.`
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Auth update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
