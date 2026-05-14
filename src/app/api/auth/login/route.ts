import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const MAX_FAILED = 3;
const LOCK_BAN_DURATION = "876600h"; // long ban; admin sets ban_duration to "none" to unlock

function jsonWithCookies(body: unknown, init: { status?: number }, source: NextResponse) {
  const res = NextResponse.json(body, { status: init.status ?? 200 });
  source.cookies.getAll().forEach((c) => {
    res.cookies.set(c.name, c.value, {
      path: c.path ?? "/",
      domain: c.domain,
      maxAge: c.maxAge,
      expires: c.expires,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: (c.sameSite as CookieOptions["sameSite"]) ?? "lax"
    });
  });
  return res;
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const email = emailRaw.toLowerCase();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const cookieResponse = NextResponse.next({
    request: { headers: request.headers }
  });

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
  }

  const { data: profile, error: profileError } = await admin
    .from("users")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: "Could not verify account." }, { status: 500 });
  }

  const userId = profile?.id as string | undefined;

  if (userId) {
    const { data: authData, error: authErr } = await admin.auth.admin.getUserById(userId);
    if (authErr) {
      return NextResponse.json({ error: "Could not verify account." }, { status: 500 });
    }
    const bannedUntil = authData.user.banned_until;
    if (bannedUntil && new Date(bannedUntil) > new Date()) {
      return NextResponse.json(
        {
          error:
            "This account is locked (too many incorrect password attempts or an admin restriction). Contact an administrator to unlock your account, then use “Forgot password” if you need to reset your password."
        },
        { status: 403 }
      );
    }

    const { data: throttle } = await admin.from("login_throttle").select("failed_count").eq("user_id", userId).maybeSingle();
    const failed = typeof throttle?.failed_count === "number" ? throttle.failed_count : 0;
    if (failed >= MAX_FAILED) {
      await admin.auth.admin.updateUserById(userId, { ban_duration: LOCK_BAN_DURATION }).catch(() => undefined);
      return NextResponse.json(
        {
          error:
            "This account is locked after too many incorrect password attempts. An administrator must unlock your account before you can sign in again."
        },
        { status: 403 }
      );
    }
  }

  const { error: signError } = await supabase.auth.signInWithPassword({ email, password });

  if (signError) {
    if (userId) {
      const { data: existing } = await admin.from("login_throttle").select("failed_count").eq("user_id", userId).maybeSingle();
      const prev = typeof existing?.failed_count === "number" ? existing.failed_count : 0;
      const next = prev + 1;
      await admin.from("login_throttle").upsert(
        { user_id: userId, failed_count: next, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      if (next >= MAX_FAILED) {
        await admin.auth.admin.updateUserById(userId, { ban_duration: LOCK_BAN_DURATION }).catch(() => undefined);
        return NextResponse.json(
          {
            error:
              "Too many incorrect password attempts. This account is now locked. Contact an administrator to unlock it."
          },
          { status: 403 }
        );
      }
    }
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (userId) {
    await admin.from("login_throttle").delete().eq("user_id", userId);
  }

  return jsonWithCookies({ ok: true }, { status: 200 }, cookieResponse);
}
