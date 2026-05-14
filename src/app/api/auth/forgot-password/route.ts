import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPublicAppUrl } from "@/lib/app-url";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string };
    try {
      body = (await request.json()) as { email?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const appUrl = getPublicAppUrl(request);
    const redirectTo = `${appUrl}/update-password`;

    const { error: resetErr } = await admin.auth.resetPasswordForEmail(email, { redirectTo });
    if (resetErr && process.env.NODE_ENV === "development") {
      console.warn("[forgot-password] resetPasswordForEmail:", resetErr.message);
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for this email, you will receive a password reset link shortly."
    });
  } catch {
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
