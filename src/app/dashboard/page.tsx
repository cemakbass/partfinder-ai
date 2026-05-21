"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { PART_IMAGE_SIGNED_URL_TTL_SECONDS } from "@/lib/storage-image";
import { formatRelativeTime } from "@/lib/relative-time";
import type { PartAnalysisResult, SearchRecord } from "@/lib/types";
import { UpgradeModal } from "@/components/upgrade-modal";
import { SignOutButton } from "@/components/sign-out-button";
import { AnalysisResult } from "@/components/dashboard/analysis-result";
import { MaterialIcon } from "@/components/dashboard/material-icon";

interface UserUsage {
  searches_used: number;
  searches_limit: number;
  plan: string;
  stripe_customer_id: string | null;
}

function confidenceLabel(confidence: string): string {
  const map: Record<string, string> = { high: "HIGH", medium: "MED", low: "LOW" };
  return map[confidence] ?? confidence.toUpperCase();
}

export default function DashboardPage() {
  const supabase = createClient();
  const [userUsage, setUserUsage] = useState<UserUsage | null>(null);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [usageLoading, setUsageLoading] = useState(true);
  const [usageLoadError, setUsageLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartAnalysisResult | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<HTMLElement>(null);

  const remaining = userUsage ? Math.max(userUsage.searches_limit - userUsage.searches_used, 0) : null;
  const hasPaidPlan = userUsage ? userUsage.plan !== "free" : false;
  const planLabel = userUsage?.plan ? userUsage.plan.charAt(0).toUpperCase() + userUsage.plan.slice(1) : "—";

  useEffect(() => {
    const loadInitialData = async () => {
      if (!supabase) {
        setUsageLoadError(
          "App is missing Supabase settings (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Add them in Vercel → Environment Variables, then redeploy."
        );
        setError(
          "App is missing Supabase settings (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Add them in Vercel → Environment Variables, then redeploy."
        );
        setUsageLoading(false);
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        window.location.href = "/login";
        return;
      }

      try {
        setUsageLoadError(null);
        const res = await fetch("/api/me");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Could not load account usage.");
        }

        setUserUsage(data.usage as UserUsage);
        setHistory(data.history as SearchRecord[]);
        setIsAdmin(Boolean((data as { isAdmin?: boolean }).isAdmin));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load account usage.";
        setUsageLoadError(message);
        setError(message);
      } finally {
        setUsageLoading(false);
      }
    };

    void loadInitialData();
  }, [supabase]);

  const openBillingPortal = async () => {
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Billing portal failed");
      if (data.url) window.location.assign(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing portal failed");
    }
  };

  const createShareLink = async (searchId: string) => {
    setShareLoading(true);
    setShareCopied(false);
    setError(null);
    try {
      const res = await fetch(`/api/searches/${searchId}/share`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create share link");
      setShareUrl(data.url as string);
    } catch (e) {
      setShareUrl(null);
      setError(e instanceof Error ? e.message : "Could not create share link");
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setError("Could not copy link. Select and copy manually.");
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    setResult(null);
    setCurrentSearchId(null);
    setShareUrl(null);
    setShareCopied(false);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    if (usageLoading || remaining === null) {
      setError(
        usageLoadError
          ? `Account usage could not be loaded: ${usageLoadError}`
          : "Account usage is still loading. Please try again in a moment."
      );
      return;
    }
    if (remaining <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", image);
      if (make) formData.append("make", make);
      if (model) formData.append("model", model);
      if (year) formData.append("year", year);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) setShowUpgradeModal(true);
        throw new Error(data.error ?? "Analyze failed");
      }

      setResult(data.data as PartAnalysisResult);
      const search = data.search as SearchRecord;
      setCurrentSearchId(search.id);
      setShareUrl(null);
      setShareCopied(false);
      setUserUsage((prev) => ({
        plan: prev?.plan ?? "free",
        stripe_customer_id: prev?.stripe_customer_id ?? null,
        searches_limit: data.usage.searches_limit,
        searches_used: data.usage.searches_used
      }));
      setHistory((prev) => [search, ...prev].slice(0, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-pf-background text-pf-on-surface">
      {/* Sidebar — desktop */}
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-pf-outline-variant/60 bg-pf-surface-container py-6 lg:flex">
        <div className="mb-8 px-6">
          <h1 className="text-xl font-bold text-pf-primary">
            Part<span className="text-pf-primary-container">Finder</span> AI
          </h1>
          <p className="mt-1 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant/70">
            Part identification
          </p>
        </div>

        <div className="flex-1 space-y-1 px-3">
          <span className="flex items-center gap-3 rounded-lg border-r-4 border-pf-primary-container bg-pf-primary-container/10 px-4 py-2.5 font-semibold text-pf-primary">
            <MaterialIcon name="dashboard" className="text-xl" />
            Dashboard
          </span>
          <Link
            href="/pricing"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-pf-on-surface-variant transition-colors hover:bg-pf-surface-container-high"
          >
            <MaterialIcon name="payments" className="text-xl" />
            Pricing
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-pf-on-surface-variant transition-colors hover:bg-pf-surface-container-high"
            >
              <MaterialIcon name="admin_panel_settings" className="text-xl" />
              Admin
            </Link>
          ) : null}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-pf-on-surface-variant transition-colors hover:bg-pf-surface-container-high"
          >
            <MaterialIcon name="home" className="text-xl" />
            Home
          </Link>
        </div>

        <div className="mt-auto space-y-4 px-6">
          <button
            type="button"
            onClick={pickImage}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pf-primary-container py-3 text-sm font-semibold text-pf-on-primary-container transition-transform active:scale-[0.98]"
          >
            <MaterialIcon name="center_focus_strong" />
            Scan new part
          </button>
          <div className="space-y-1 border-t border-pf-outline-variant/40 pt-4">
            <Link href="/privacy" className="flex items-center gap-2 px-2 py-1 text-sm text-pf-on-surface-variant hover:text-pf-on-surface">
              <MaterialIcon name="help_outline" className="text-lg" />
              Privacy
            </Link>
          </div>
        </div>
      </nav>

      {/* Top bar */}
      <header className="fixed right-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-pf-outline-variant/60 bg-pf-surface px-4 lg:left-64 lg:w-[calc(100%-16rem)] lg:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/" className="text-lg font-bold text-pf-primary">
            Part<span className="text-pf-primary-container">Finder</span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-pf-surface-container-high px-4 py-1.5 text-sm text-pf-on-surface-variant md:flex">
          <MaterialIcon name="analytics" className="text-lg text-pf-primary-container" />
          {usageLoading || remaining === null ? (
            <span>Loading usage…</span>
          ) : (
            <span>
              <strong className="text-pf-on-surface">{remaining}</strong> identifications left · {planLabel} plan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/pricing" className="hidden text-sm text-pf-on-surface-variant hover:text-pf-on-surface sm:inline">
            Pricing
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="hidden text-sm text-pf-on-surface-variant hover:text-pf-primary-container sm:inline">
              Admin
            </Link>
          ) : null}
          {hasPaidPlan ? (
            <button
              type="button"
              onClick={() => void openBillingPortal()}
              className="hidden rounded-lg border border-pf-outline-variant px-3 py-1.5 text-xs font-semibold sm:inline-block"
            >
              Billing
            </button>
          ) : (
            <Link
              href="/pricing"
              className="rounded-lg bg-pf-primary-container px-3 py-1.5 text-xs font-bold text-pf-on-primary-container sm:px-4 sm:py-2 sm:text-sm"
            >
              Upgrade
            </Link>
          )}
          <SignOutButton className="rounded-lg border border-pf-outline-variant px-3 py-1.5 text-xs font-semibold text-pf-on-surface-variant transition hover:border-pf-primary-container/50 hover:text-pf-on-surface disabled:opacity-50 sm:text-sm" />
        </div>
      </header>

      <main className="min-h-screen pt-16 lg:ml-64">
        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
          {/* Hero scanner / upload */}
          <section
            ref={scannerRef}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleImageSelect(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="group relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-pf-outline-variant/50 bg-pf-surface-container-lowest md:min-h-[360px]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, #4f4633 1px, transparent 0)",
              backgroundSize: "32px 32px"
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-40 transition-opacity group-hover:opacity-100">
              <div className="viewfinder-corner left-4 top-4 rounded-tl-lg border-l-4 border-t-4 md:left-6 md:top-6" />
              <div className="viewfinder-corner right-4 top-4 rounded-tr-lg border-r-4 border-t-4 md:right-6 md:top-6" />
              <div className="viewfinder-corner bottom-4 left-4 rounded-bl-lg border-b-4 border-l-4 md:bottom-6 md:left-6" />
              <div className="viewfinder-corner bottom-4 right-4 rounded-br-lg border-b-4 border-r-4 md:bottom-6 md:right-6" />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pf-primary-container/20 bg-pf-primary-container/10 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-pf-primary-container" />
                <span className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-primary">
                  {loading ? "Analyzing…" : "Ready to scan"}
                </span>
              </div>

              {imagePreview ? (
                <button type="button" onClick={pickImage} className="mx-auto mb-4 block max-h-40 overflow-hidden rounded-xl ring-2 ring-pf-primary-container/40">
                  <img src={imagePreview} alt="Upload preview" className="max-h-40 object-contain" />
                </button>
              ) : (
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-4xl">
                  Visual intelligence for precision identification
                </h2>
              )}

              {!imagePreview && (
                <p className="mx-auto mt-3 max-w-lg text-pf-on-surface-variant">
                  Upload a photo of any automotive part. JPG, PNG, or WEBP, max 5MB.
                </p>
              )}

              <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
                <input
                  placeholder="Make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="rounded-lg border border-pf-outline-variant/50 bg-pf-surface-container/80 px-3 py-2 text-sm placeholder:text-pf-on-surface-variant/60"
                />
                <input
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="rounded-lg border border-pf-outline-variant/50 bg-pf-surface-container/80 px-3 py-2 text-sm placeholder:text-pf-on-surface-variant/60"
                />
                <input
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-lg border border-pf-outline-variant/50 bg-pf-surface-container/80 px-3 py-2 text-sm placeholder:text-pf-on-surface-variant/60"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={pickImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-pf-outline-variant px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-pf-surface-container-high"
                >
                  <MaterialIcon name="upload" />
                  {imagePreview ? "Change photo" : "Upload image"}
                </button>
                <button
                  type="button"
                  disabled={!image || loading || usageLoading || remaining === null}
                  onClick={() => void analyze()}
                  className="inline-flex items-center gap-2 rounded-xl bg-pf-primary-container px-8 py-2.5 text-sm font-bold text-pf-on-primary-container shadow-lg shadow-pf-primary-container/20 transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <MaterialIcon name="center_focus_strong" />
                  {loading ? "Analyzing…" : "Identify part"}
                </button>
              </div>
            </div>
          </section>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
          ) : null}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div>
                <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Used this period</p>
                <p className="mt-1 text-2xl font-bold text-white">{usageLoading ? "—" : userUsage?.searches_used ?? 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pf-surface-container-high text-pf-primary-container">
                <MaterialIcon name="analytics" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div>
                <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Remaining</p>
                <p className="mt-1 text-2xl font-bold text-white">{usageLoading || remaining === null ? "—" : remaining}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pf-surface-container-high text-pf-primary-container">
                <MaterialIcon name="inventory" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div>
                <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Current plan</p>
                <p className="mt-1 text-2xl font-bold capitalize text-white">{usageLoading ? "—" : planLabel}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pf-surface-container-high text-pf-primary-container">
                <MaterialIcon name="verified" />
              </div>
            </div>
          </div>

          {/* Latest result */}
          {result ? (
            <section className="rounded-2xl border border-pf-primary-container/30 bg-zinc-900 p-5 md:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <MaterialIcon name="check_circle" className="text-pf-primary-container" />
                Latest identification
              </h3>
              <AnalysisResult
                result={result}
                currentSearchId={currentSearchId}
                shareUrl={shareUrl}
                shareLoading={shareLoading}
                shareCopied={shareCopied}
                onCreateShare={() => currentSearchId && void createShareLink(currentSearchId)}
                onCopyShare={() => void copyShareLink()}
              />
            </section>
          ) : null}

          {/* Recent scans */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Recent identifications</h3>
              <span className="font-dashboard-mono text-[10px] text-pf-on-surface-variant">
                Signed URLs ~{Math.floor(PART_IMAGE_SIGNED_URL_TTL_SECONDS / 60)} min
              </span>
            </div>

            {history.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-pf-outline-variant/50 py-12 text-center text-pf-on-surface-variant">
                No scans yet. Upload a part photo above.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {history.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-default rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-pf-primary-container/50"
                    >
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-pf-surface-container-lowest">
                        <img
                          src={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute right-2 top-2 rounded-lg border border-zinc-700 bg-zinc-950/80 px-2 py-0.5 backdrop-blur-md">
                          <p className="font-dashboard-mono text-[10px] text-pf-primary-container">
                            {confidenceLabel(item.result_json.confidence)}
                          </p>
                        </div>
                      </div>
                      <h4 className="line-clamp-2 text-sm font-semibold text-white">{item.result_json.partName}</h4>
                      <div className="mt-1 flex items-center justify-between font-dashboard-mono text-[10px] text-pf-on-surface-variant">
                        <span className="truncate">{item.result_json.oemCode}</span>
                        <span>{formatRelativeTime(item.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-pf-on-surface-variant">All recent</p>
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg bg-pf-surface-container-high/50 p-2">
                        <img
                          src={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-pf-primary-container">{item.result_json.partName}</p>
                          <p className="text-xs text-pf-on-surface-variant">{formatRelativeTime(item.created_at)}</p>
                        </div>
                        <a
                          href={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-pf-on-surface-variant hover:text-pf-primary"
                        >
                          Open
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </section>

          <p className="text-center text-xs text-pf-on-surface-variant/80">
            AI identification is for reference only. Always verify fitment with a qualified technician.
          </p>
        </div>
      </main>

      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
