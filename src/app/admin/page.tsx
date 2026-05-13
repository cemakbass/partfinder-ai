"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  userCount: number;
  searchCount: number;
  planBreakdown: Record<string, number>;
  recentSearches: Array<{
    id: string;
    user_id: string;
    created_at: string;
    result_json: { partName?: string };
    vehicle_make: string | null;
  }>;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            window.location.href = res.status === 401 ? "/login?next=/admin" : "/dashboard";
            return;
          }
          throw new Error(data.error ?? "Failed to load");
        }
        setStats(data as Stats);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!stats) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Overview</h1>
        <p className="mt-1 text-sm text-zinc-400">Usage and signups at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Users</p>
          <p className="mt-2 text-3xl font-black text-white">{stats.userCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Total searches</p>
          <p className="mt-2 text-3xl font-black text-amber-400">{stats.searchCount}</p>
        </div>
        {Object.entries(stats.planBreakdown).map(([plan, count]) => (
          <div key={plan} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Plan: {plan}</p>
            <p className="mt-2 text-3xl font-black text-zinc-100">{count}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent searches</h2>
          <Link href="/admin/searches" className="text-sm text-amber-400 hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-zinc-800">
          {stats.recentSearches.length === 0 ? (
            <li className="py-4 text-sm text-zinc-500">No searches yet.</li>
          ) : (
            stats.recentSearches.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-zinc-200">{s.result_json?.partName ?? "—"}</span>
                <span className="text-zinc-500">{new Date(s.created_at).toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
