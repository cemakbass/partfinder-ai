import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createSignedPartImageUrl, objectPathFromStoredImageUrl } from "@/lib/storage-image";
import { isUuid } from "@/lib/uuid";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getAdminSession();
  if (!auth.ok) {
    const status = auth.reason === "unauthorized" ? 401 : 403;
    return NextResponse.json({ error: auth.reason }, { status });
  }

  const searchId = request.nextUrl.searchParams.get("searchId")?.trim() ?? "";
  if (!isUuid(searchId)) {
    return NextResponse.json({ error: "Invalid search id" }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: row, error } = await admin.from("searches").select("image_url").eq("id", searchId).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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
