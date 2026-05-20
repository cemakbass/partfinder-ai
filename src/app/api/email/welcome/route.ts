import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST() {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendWelcomeEmail(user.email);
  return NextResponse.json({ ok: true, email: result });
}
