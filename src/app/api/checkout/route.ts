import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase-server";
import { PLAN_CONFIG } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { getPublicAppUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY?.trim()) {
      return NextResponse.json(
        {
          error:
            "Missing STRIPE_SECRET_KEY on the server. Add it in Vercel → Settings → Environment Variables (Production), then Redeploy. Use the same mode as your Price IDs (test sk_test_… with test price_…, or live sk_live_… with live price_…)."
        },
        { status: 503 }
      );
    }

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
        {
          error: `Missing ${envName} (Stripe recurring Price ID for ${plan}). Add it in Vercel → Environment Variables, then Redeploy. Value must start with price_.`
        },
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
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message,
          stripeCode: error.code,
          hint:
            error.code === "resource_missing"
              ? "Often: STRIPE_PRICE_* is from Live Dashboard but STRIPE_SECRET_KEY is test (or the opposite). Keys and Price IDs must both be test or both live."
              : undefined
        },
        { status: 400 }
      );
    }
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
