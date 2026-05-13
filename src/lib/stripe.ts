import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazy init so missing env during analysis doesn’t break unrelated routes at import time. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2024-06-20",
      typescript: true
    });
  }
  return stripeClient;
}
