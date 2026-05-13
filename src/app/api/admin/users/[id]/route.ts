import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isValidPlan, PLAN_CONFIG } from "@/lib/plans";
import { isUuid } from "@/lib/uuid";

function adminJsonError(auth: Awaited<ReturnType<typeof getAdminSession>>) {
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }
  return null;
}

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const auth = await getAdminSession();
  const err = adminJsonError(auth);
  if (err) return err;

  const userId = context.params.id;
  if (!isUuid(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: authUser, error: authError } = await admin.auth.admin.getUserById(userId);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const u = authUser.user;
    return NextResponse.json({
      profile,
      auth: {
        banned_until: u.banned_until ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type PatchBody = {
  plan?: string;
  searches_used?: number;
  searches_limit?: number;
};

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const auth = await getAdminSession();
  const err = adminJsonError(auth);
  if (err) return err;

  const userId = context.params.id;
  if (!isUuid(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.plan !== undefined && !isValidPlan(body.plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const updates: Record<string, string | number> = {};

  if (body.plan !== undefined) {
    updates.plan = body.plan;
    if (body.searches_limit === undefined) {
      updates.searches_limit = PLAN_CONFIG[body.plan].searchLimit;
    }
  }

  if (body.searches_used !== undefined) {
    const n = Number(body.searches_used);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: "searches_used must be a non-negative number" }, { status: 400 });
    }
    updates.searches_used = Math.floor(n);
  }

  if (body.searches_limit !== undefined) {
    const n = Number(body.searches_limit);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: "searches_limit must be a non-negative number" }, { status: 400 });
    }
    updates.searches_limit = Math.floor(n);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Provide at least one of: plan, searches_used, searches_limit" },
      { status: 400 }
    );
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from("users").update(updates).eq("id", userId).select("*").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
