"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { PART_IMAGE_SIGNED_URL_TTL_SECONDS } from "@/lib/storage-image";
import type { PartAnalysisResult, SearchRecord } from "@/lib/types";
import { UpgradeModal } from "@/components/upgrade-modal";
import { SignOutButton } from "@/components/sign-out-button";

interface UserUsage {
  searches_used: number;
  searches_limit: number;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = userUsage ? Math.max(userUsage.searches_limit - userUsage.searches_used, 0) : null;

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

  const handleImageSelect = (file: File) => {
    setImage(file);
    setResult(null);
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
      setUserUsage({
        searches_limit: data.usage.searches_limit,
        searches_used: data.usage.searches_used
      });
      setHistory((prev) => [data.search as SearchRecord, ...prev].slice(0, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-black">
            Part<span className="text-amber-400">Finder</span> AI
          </h1>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <a href="/admin" className="text-sm font-semibold text-zinc-300 hover:text-amber-400">
                Admin
              </a>
            )}
            <span className="text-sm text-zinc-400">
              {usageLoading || remaining === null ? "Loading usage..." : `${remaining} searches left`}
            </span>
            <a href="/pricing" className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black">
              Upgrade
            </a>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
        <section className="space-y-4 md:col-span-2">
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleImageSelect(file);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900 p-6 text-center"
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
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="mx-auto max-h-56 rounded-xl object-contain" />
            ) : (
              <p className="text-zinc-400">Drop image or click to upload (JPG, PNG, WEBP max 5MB)</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="mb-3 text-sm text-zinc-400">Vehicle info (optional)</p>
            <div className="grid grid-cols-3 gap-2">
              <input
                placeholder="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
              />
              <input
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
              />
              <input
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
              />
            </div>
          </div>

          <button
            disabled={!image || loading || usageLoading || remaining === null}
            onClick={analyze}
            className="w-full rounded-xl bg-amber-400 py-3 text-lg font-black text-black disabled:opacity-50"
          >
            {usageLoading ? "Loading Account..." : loading ? "Analyzing..." : "Identify Part"}
          </button>

          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

          <p className="text-xs text-zinc-500">
            AI identification is for reference only. Always verify with a qualified mechanic.
          </p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 text-lg font-bold">Result</h2>
            {!result ? (
              <p className="text-sm text-zinc-500">No result yet.</p>
            ) : (
              <div className="space-y-3 text-sm">
                <p><span className="text-zinc-400">Part:</span> {result.partName}</p>
                <p><span className="text-zinc-400">OEM:</span> {result.oemCode}</p>
                <p><span className="text-zinc-400">Category:</span> {result.category}</p>
                <p><span className="text-zinc-400">Confidence:</span> {result.confidence}</p>
                <p className="text-zinc-300">{result.description}</p>

                {result.estimatedDamage && (
                  <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-400">
                      Estimated damage
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-200">{result.estimatedDamage}</p>
                  </div>
                )}

                {result.damageRelatedParts && result.damageRelatedParts.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">Likely related parts</p>
                    <div className="flex flex-wrap gap-1">
                      {result.damageRelatedParts.map((p) => (
                        <span key={p} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(result.marketplaceListings ?? []).length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-zinc-400">Sample listings (max 3)</p>
                    <p className="mb-2 text-xs text-zinc-500">
                      {"Prices and stock are AI-assisted estimates — always confirm on the retailer's site."}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {(result.marketplaceListings ?? []).slice(0, 3).map((listing, idx) => (
                        <a
                          key={`${idx}-${listing.site}-${listing.listingUrl}`}
                          href={listing.listingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/80 transition-opacity hover:opacity-90"
                        >
                          <div className="relative aspect-[4/3] bg-zinc-900">
                            {listing.imageUrl ? (
                              <img
                                src={listing.imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                                No image
                              </div>
                            )}
                            <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                              {listing.site}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col gap-1 p-2">
                            <p className="line-clamp-2 text-xs font-medium text-zinc-100">{listing.title}</p>
                            <p className="text-sm font-black text-amber-400">{listing.priceDisplay}</p>
                            <span
                              className={`inline-flex w-fit rounded px-2 py-0.5 text-[10px] font-bold ${
                                listing.inStock
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-zinc-600/40 text-zinc-400"
                              }`}
                            >
                              {listing.inStock ? "In stock (estimate)" : "Stock unknown / out"}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <a href={result.searchLinks.amazon} target="_blank" rel="noreferrer" className="text-amber-400">Amazon</a>
                  <a href={result.searchLinks.rockauto} target="_blank" rel="noreferrer" className="text-amber-400">RockAuto</a>
                  <a href={result.searchLinks.autozone} target="_blank" rel="noreferrer" className="text-amber-400">AutoZone</a>
                </div>

                {result.additionalNotes ? (
                  <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-2 text-xs text-zinc-400">
                    {result.additionalNotes}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 text-lg font-bold">Last 10 Searches</h2>
            <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
              Thumbnails open through a short-lived signed link (about {Math.floor(PART_IMAGE_SIGNED_URL_TTL_SECONDS / 60)} minutes) for privacy.
            </p>
            <div className="space-y-2">
              {history.length === 0 && <p className="text-sm text-zinc-500">No history yet.</p>}
              {history.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-lg bg-zinc-800 p-2 text-xs">
                  <a
                    href={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-600 bg-zinc-900"
                    title="View photo (short-lived link)"
                  >
                    {/* Same-origin URL redirects to a time-limited signed Supabase URL */}
                    <img
                      src={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-amber-400">{item.result_json.partName}</p>
                    <p className="text-zinc-400">{new Date(item.created_at).toLocaleString()}</p>
                    <a
                      href={`/api/me/search-image?searchId=${encodeURIComponent(item.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-[10px] text-zinc-500 underline hover:text-amber-400"
                    >
                      Open original
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </main>
  );
}
