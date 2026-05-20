import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getStripe } from "@/lib/stripe";
import { getPublicAppUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Server misconfigured." }, { status: 503 });
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin.from("users").select("stripe_customer_id").eq("id", user.id).maybeSingle();

    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const existing = await stripe.customers.list({ email: user.email, limit: 1 });
      customerId = existing.data[0]?.id;
      if (!customerId) {
        const created = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id }
        });
        customerId = created.id;
      }
      await admin.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const appUrl = getPublicAppUrl(request);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard`
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Billing portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
