import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { PLAN_CONFIG } from "@/lib/plans";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const priceToPlan = new Map<string, "starter" | "pro" | "ultra">([
  [process.env.STRIPE_PRICE_STARTER ?? "", "starter"],
  [process.env.STRIPE_PRICE_PRO ?? "", "pro"],
  [process.env.STRIPE_PRICE_ULTRA ?? "", "ultra"]
]);

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const supabaseAdmin = getSupabaseAdmin();
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as "starter" | "pro" | "ultra" | undefined;
    if (userId && plan) {
      await supabaseAdmin
        .from("users")
        .update({
          plan,
          searches_limit: PLAN_CONFIG[plan].searchLimit,
          searches_used: 0
        })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const supabaseAdmin = getSupabaseAdmin();
    const subscription = event.data.object as Stripe.Subscription;
    const item = subscription.items.data[0];
    const plan = priceToPlan.get(item.price.id);
    const userId = subscription.metadata?.userId;
    if (plan && userId) {
      await supabaseAdmin
        .from("users")
        .update({ plan, searches_limit: PLAN_CONFIG[plan].searchLimit })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
