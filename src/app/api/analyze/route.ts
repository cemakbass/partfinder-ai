import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { analyzeCarPart } from "@/lib/anthropic";
import { getOrCreateUserProfile } from "@/lib/user-profile";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function formatAnalyzeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Analyze failed";

  if (message.includes("credit balance is too low")) {
    return {
      message: "Anthropic API credit balance is too low. Add credits in Anthropic Plans & Billing, then try again.",
      status: 502
    };
  }

  if (
    message.includes("Could not resolve authentication method") ||
    message.includes("apiKey") ||
    message.includes("ANTHROPIC_API_KEY is not set")
  ) {
    return {
      message:
        "Anthropic API key is missing or not accepted. In Vercel → Environment Variables, set ANTHROPIC_API_KEY to your key from console.anthropic.com (no quotes, no spaces), then Redeploy.",
      status: 503
    };
  }

  return { message, status: 500 };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server misconfigured: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 503 }
      );
    }
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const make = (formData.get("make") as string | null)?.trim();
    const model = (formData.get("model") as string | null)?.trim();
    const year = (formData.get("year") as string | null)?.trim();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!allowedMimeTypes.has(image.type)) {
      return NextResponse.json({ error: "Invalid file format. Use JPG, PNG or WEBP." }, { status: 400 });
    }
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large. Max 5MB." }, { status: 400 });
    }

    const usage = await getOrCreateUserProfile(user.id, user.email);
    const supabaseAdmin = getSupabaseAdmin();

    if (usage.searches_used >= usage.searches_limit) {
      return NextResponse.json({ error: "Search limit reached." }, { status: 402 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const vehicleInfo = make && model && year ? { make, model, year } : undefined;
    const result = await analyzeCarPart(base64, image.type as "image/jpeg" | "image/png" | "image/webp", vehicleInfo);

    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.bin`;
    const upload = await supabaseAdmin.storage.from("part-images").upload(fileName, buffer, {
      contentType: image.type
    });

    if (upload.error) {
      return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
    }

    const { data: searchRecord, error: searchInsertError } = await supabaseAdmin
      .from("searches")
      .insert({
        user_id: user.id,
        image_url: fileName,
        result_json: result,
        vehicle_make: make ?? null,
        vehicle_model: model ?? null,
        vehicle_year: year ?? null
      })
      .select("id, image_url, result_json, vehicle_make, vehicle_model, vehicle_year, created_at")
      .single();

    if (searchInsertError) {
      return NextResponse.json({ error: "Search save failed." }, { status: 500 });
    }

    const { data: incrementedUsage, error: rpcError } = await supabaseAdmin.rpc("consume_search_credit", {
      p_user_id: user.id
    });

    if (rpcError || !incrementedUsage?.[0]) {
      return NextResponse.json(
        { error: rpcError?.message ?? "Could not consume search credit." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      usage: incrementedUsage[0],
      search: searchRecord
    });
  } catch (error) {
    const { message, status } = formatAnalyzeError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
