import type { Plan } from "@/lib/types";

export const PLANS: Plan[] = ["free", "starter", "pro", "ultra"];

export function isValidPlan(value: string): value is Plan {
  return (PLANS as string[]).includes(value);
}

export const PLAN_CONFIG: Record<
  Plan,
  { name: string; monthlyPrice: number; searchLimit: number; stripePriceEnv?: string }
> = {
  free: { name: "Free", monthlyPrice: 0, searchLimit: 2 },
  starter: { name: "Starter", monthlyPrice: 9.99, searchLimit: 5, stripePriceEnv: "STRIPE_PRICE_STARTER" },
  pro: { name: "Pro", monthlyPrice: 14.99, searchLimit: 10, stripePriceEnv: "STRIPE_PRICE_PRO" },
  ultra: { name: "Ultra", monthlyPrice: 19.99, searchLimit: 20, stripePriceEnv: "STRIPE_PRICE_ULTRA" }
};
