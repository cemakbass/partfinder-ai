"use client";

import { useState } from "react";
import { PLAN_CONFIG } from "@/lib/plans";

const paidPlans = ["starter", "pro", "ultra"] as const;

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (plan: "starter" | "pro" | "ultra") => {
    setError(null);
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan })
      });

      const raw = await res.text();
      let data: { url?: string; error?: string; hint?: string; stripeCode?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        setError(raw.slice(0, 400) || `Unexpected response (${res.status}).`);
        return;
      }

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
        return;
      }

      if (!res.ok) {
        const parts = [data.error, data.hint, data.stripeCode ? `Stripe code: ${data.stripeCode}` : ""].filter(Boolean);
        throw new Error(parts.join(" — ") || `Checkout failed (${res.status})`);
      }
      if (!data.url) {
        throw new Error(data.error ?? "No checkout URL returned from server.");
      }
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-center text-4xl font-black">Pricing</h1>
        <p className="mb-10 text-center text-zinc-400">
          Choose your monthly plan. You must be signed in. Stripe opens in the same tab after you click Subscribe.
        </p>
        {error && (
          <div className="mb-6 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-center text-sm text-red-200">
            <p className="font-semibold">Checkout could not start</p>
            <p className="mt-2 whitespace-pre-wrap break-words">{error}</p>
            <p className="mt-3 text-xs text-red-300/90">
              On Vercel, set <code className="text-red-100">STRIPE_SECRET_KEY</code>,{" "}
              <code className="text-red-100">STRIPE_PRICE_STARTER</code>, <code className="text-red-100">STRIPE_PRICE_PRO</code>,{" "}
              <code className="text-red-100">STRIPE_PRICE_ULTRA</code> (all <code className="text-red-100">price_…</code> subscription
              prices). Test vs live mode must match, then Redeploy.
            </p>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {paidPlans.map((plan) => (
            <div
              key={plan}
              className={`rounded-2xl border p-6 ${plan === "pro" ? "border-amber-400 bg-amber-400 text-black" : "border-zinc-800 bg-zinc-900"}`}
            >
              <h2 className="text-2xl font-black">{PLAN_CONFIG[plan].name}</h2>
              <p className="mt-2 text-4xl font-black">${PLAN_CONFIG[plan].monthlyPrice}</p>
              <p className="mt-3 text-sm">{PLAN_CONFIG[plan].searchLimit} searches / month</p>
              <button
                onClick={() => checkout(plan)}
                disabled={loadingPlan === plan}
                className={`mt-6 w-full rounded-xl py-3 font-bold ${plan === "pro" ? "bg-black text-white" : "bg-amber-400 text-black"}`}
              >
                {loadingPlan === plan ? "Redirecting..." : "Start Subscription"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
