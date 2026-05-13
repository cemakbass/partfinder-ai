"use client";

import { useEffect, useState } from "react";
import type { PartAnalysisResult } from "@/lib/types";

interface SearchRow {
  id: string;
  user_id: string;
  user_email: string;
  created_at: string;
  image_url: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  result_json: PartAnalysisResult;
}

export default function AdminSearchesPage() {
  const [rows, setRows] = useState<SearchRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/searches?limit=150", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            window.location.href = res.status === 401 ? "/login?next=/admin/searches" : "/dashboard";
            return;
          }
          throw new Error(data.error ?? "Failed");
        }
        setRows(data.searches as SearchRow[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Searches</h1>
        <p className="mt-1 text-sm text-zinc-400">Latest part identification requests.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-zinc-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Photo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-950">
              {rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-zinc-900/80">
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-500">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{r.user_email}</td>
                  <td className="px-4 py-3 font-medium text-amber-400">{r.result_json?.partName ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {[r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/admin/search-image?searchId=${encodeURIComponent(r.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block h-12 w-12 shrink-0 overflow-hidden rounded border border-zinc-600 bg-zinc-900"
                        title="View upload (signed, expires soon)"
                      >
                        <img
                          src={`/api/admin/search-image?searchId=${encodeURIComponent(r.id)}`}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </a>
                      <a
                        href={`/api/admin/search-image?searchId=${encodeURIComponent(r.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-400 underline"
                      >
                        Open
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
