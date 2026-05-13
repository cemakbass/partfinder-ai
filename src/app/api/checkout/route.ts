import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-server";
import { PLAN_CONFIG } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { getPublicAppUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in required to subscribe.", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = (await request.json()) as { plan?: "starter" | "pro" | "ultra" };
    const plan = body.plan;
    if (!plan || !PLAN_CONFIG[plan].stripePriceEnv) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const envName = PLAN_CONFIG[plan].stripePriceEnv!;
    const priceId = process.env[envName]?.trim();
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing ${envName} in .env.local (Stripe Price ID for ${plan}).` },
        { status: 500 }
      );
    }

    if (priceId.startsWith("prod_")) {
      return NextResponse.json(
        {
          error: `${envName} is set to a Product ID (${priceId}). Use a Price ID instead (starts with price_). In Stripe Dashboard: Product → Pricing → copy the Price ID, not the Product ID.`
        },
        { status: 400 }
      );
    }

    if (!priceId.startsWith("price_")) {
      return NextResponse.json(
        {
          error: `${envName} should be a recurring subscription Price ID (usually starts with price_). Current value: ${priceId.slice(0, 12)}…`
        },
        { status: 400 }
      );
    }

    const appUrl = getPublicAppUrl(request);
    const stripe = getStripe();

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancel`,
      client_reference_id: user.id,
      metadata: { userId: user.id, plan }
    };

    if (user.email) {
      sessionParams.customer_email = user.email;
    }

    sessionParams.subscription_data = {
      metadata: { userId: user.id, plan }
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL. Check Price ID and Stripe dashboard settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    let message = "Could not create checkout.";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = String((error as { message: unknown }).message);
    } else if (typeof error === "string") {
      message = error;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
