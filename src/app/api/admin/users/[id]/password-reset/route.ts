import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPublicAppUrl } from "@/lib/app-url";
import { isUuid } from "@/lib/uuid";

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

  try {
    const admin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await admin
      .from("users")
      .select("email")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let email = profile?.email?.trim();
    if (!email) {
      const { data: authUser, error: authError } = await admin.auth.admin.getUserById(userId);
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }
      email = authUser.user.email?.trim();
    }

    if (!email) {
      return NextResponse.json({ error: "No email on file for this user" }, { status: 404 });
    }

    const appUrl = getPublicAppUrl(request);
    const redirectTo = `${appUrl}/login`;

    const { error: resetError } = await admin.auth.resetPasswordForEmail(email, { redirectTo });

    if (!resetError) {
      return NextResponse.json({ sentEmail: true, recoveryLink: null as string | null });
    }

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo }
    });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json(
        {
          error: resetError.message,
          fallbackError: linkError?.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sentEmail: false,
      recoveryLink: linkData.properties.action_link,
      note:
        "Email could not be sent (check SMTP). Share the recovery link with the user manually if appropriate."
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Password reset failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
