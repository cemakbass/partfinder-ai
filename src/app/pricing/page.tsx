"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PLAN_CONFIG } from "@/lib/plans";
import { MARKETING_IMAGES } from "@/lib/marketing-images";
import { SignOutButton } from "@/components/sign-out-button";

const paidPlans = ["starter", "pro", "ultra"] as const;

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const plan = (data.usage as { plan?: string })?.plan ?? "free";
        setHasPaidPlan(plan !== "free");
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const openBillingPortal = async () => {
    setError(null);
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Billing portal failed");
      if (data.url) window.location.assign(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing portal failed");
    } finally {
      setPortalLoading(false);
    }
  };

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
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0">
          <Image
            src={MARKETING_IMAGES.hero.src}
            alt=""
            fill
            className="object-contain p-12 opacity-25"
            sizes="100vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950 to-zinc-950" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            Dashboard
          </Link>
          {hasPaidPlan ? (
            <button
              type="button"
              disabled={portalLoading}
              onClick={() => void openBillingPortal()}
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-400 disabled:opacity-50"
            >
              {portalLoading ? "Opening..." : "Manage billing"}
            </button>
          ) : null}
          <SignOutButton />
        </div>
        <h1 className="mb-3 text-center text-4xl font-black">US auto part identification pricing</h1>
        <p className="mx-auto mb-2 max-w-2xl text-center text-zinc-400">
          Choose a monthly plan for photo-based OEM lookup and fitment research. Sign in required. Secure checkout via Stripe (USD).
        </p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-12">
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
