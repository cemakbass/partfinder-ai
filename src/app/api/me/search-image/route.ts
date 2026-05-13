import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createSignedPartImageUrl, objectPathFromStoredImageUrl } from "@/lib/storage-image";
import { isUuid } from "@/lib/uuid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchId = request.nextUrl.searchParams.get("searchId")?.trim() ?? "";
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

  try {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin
      .from("searches")
      .select("user_id, image_url")
      .eq("id", searchId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (row.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const path = objectPathFromStoredImageUrl(row.image_url as string);
    if (!path) {
      return NextResponse.json({ error: "Invalid image reference" }, { status: 500 });
    }

    const signed = await createSignedPartImageUrl(admin, path);
    if ("error" in signed) {
      return NextResponse.json({ error: signed.error }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
