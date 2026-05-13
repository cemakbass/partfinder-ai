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

      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? `Checkout failed (${res.status})`);
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
        <p className="mb-10 text-center text-zinc-400">Choose your monthly plan.</p>
        {error && <p className="mb-4 text-center text-red-400">{error}</p>}
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
