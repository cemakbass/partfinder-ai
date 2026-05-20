"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PartReport } from "@/components/part-report";
import type { PartAnalysisResult } from "@/lib/types";

type SharePayload = {
  expiresAt: string;
  search: {
    id: string;
    result_json: PartAnalysisResult;
    vehicle_make: string | null;
    vehicle_model: string | null;
    vehicle_year: string | null;
    created_at: string;
  };
};

export default function SharePage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/share/${encodeURIComponent(params.token)}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error ?? "Could not load report");
        }
        setData(json as SharePayload);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.token]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white print:bg-white print:text-black">
        <header className="border-b border-zinc-800 px-6 py-4 print:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/" className="font-black">
              Part<span className="text-amber-400">Finder</span> AI
            </Link>
            {data && (
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-800"
              >
                Print / Save PDF
              </button>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-2xl font-black">Part identification report</h1>
          {loading && <p className="mt-4 text-zinc-400">Loading…</p>}
          {error && <p className="mt-4 text-red-400">{error}</p>}
          {data && (
            <>
              <p className="mt-2 text-xs text-zinc-500 print:hidden">
                Shared link expires {new Date(data.expiresAt).toLocaleString()}
              </p>
              <div className="mt-8">
                <PartReport
                  result={data.search.result_json}
                  vehicle={{
                    make: data.search.vehicle_make,
                    model: data.search.vehicle_model,
                    year: data.search.vehicle_year
                  }}
                  createdAt={data.search.created_at}
                />
              </div>
            </>
          )}
        </div>
    </main>
  );
}
