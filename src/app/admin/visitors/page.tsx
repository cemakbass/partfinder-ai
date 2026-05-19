"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface VisitorRow {
  visitor_id: string;
  user_id: string | null;
  user_email: string | null;
  visit_count: number;
  first_seen_at: string;
  last_seen_at: string;
  last_path: string | null;
  country: string | null;
}

interface VisitRow {
  id: string;
  visitor_id: string;
  user_id: string | null;
  user_email: string | null;
  path: string;
  referrer: string | null;
  country: string | null;
  created_at: string;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [filterVisitorId, setFilterVisitorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (visitorId: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const visitsUrl = visitorId
        ? `/api/admin/visits?limit=100&visitor_id=${encodeURIComponent(visitorId)}`
        : "/api/admin/visits?limit=150";

      const [visitorsRes, visitsRes] = await Promise.all([
        fetch("/api/admin/visitors?limit=200", { credentials: "include" }),
        fetch(visitsUrl, { credentials: "include" })
      ]);

      const visitorsData = await visitorsRes.json();
      const visitsData = await visitsRes.json();

      if (!visitorsRes.ok) {
        if (visitorsRes.status === 403 || visitorsRes.status === 401) {
          window.location.href = visitorsRes.status === 401 ? "/login?next=/admin/visitors" : "/dashboard";
          return;
        }
        throw new Error(visitorsData.error ?? "Failed to load visitors");
      }
      if (!visitsRes.ok) {
        throw new Error(visitsData.error ?? "Failed to load visits");
      }

      setVisitors(visitorsData.visitors as VisitorRow[]);
      setVisits(visitsData.visits as VisitRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filterVisitorId);
  }, [filterVisitorId, load]);

  const visitorLabel = (v: VisitorRow) => {
    if (v.user_email) return v.user_email;
    return `${v.visitor_id.slice(0, 8)}…`;
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black">Visitors</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Unique visitors and recent page views. Anonymous guests are grouped by browser cookie; signed-in users show their email.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Unique visitors</h2>
          <span className="text-sm text-zinc-500">{loading ? "…" : `${visitors.length} listed`}</span>
        </div>
        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Visits</th>
                  <th className="px-4 py-3">First seen</th>
                  <th className="px-4 py-3">Last seen</th>
                  <th className="px-4 py-3">Last page</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                      No visits recorded yet. Data appears after users browse the public site.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr
                      key={v.visitor_id}
                      className={`align-top hover:bg-zinc-900/80 ${filterVisitorId === v.visitor_id ? "bg-zinc-900/60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-200">{visitorLabel(v)}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{v.visitor_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        {v.user_email ? (
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                            Registered
                          </span>
                        ) : (
                          <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-xs text-zinc-400">Guest</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{v.country ?? "—"}</td>
                      <td className="px-4 py-3 font-semibold text-white">{v.visit_count}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-500">{new Date(v.first_seen_at).toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-500">{new Date(v.last_seen_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">{v.last_path ?? "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setFilterVisitorId(filterVisitorId === v.visitor_id ? null : v.visitor_id)}
                          className="text-xs font-semibold text-amber-400 hover:underline"
                        >
                          {filterVisitorId === v.visitor_id ? "Clear filter" : "View pages"}
                        </button>
                        {v.user_id && (
                          <Link href={`/admin/users/${v.user_id}`} className="ml-3 text-xs text-zinc-400 hover:text-white">
                            User →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Recent page views</h2>
          {filterVisitorId && (
            <button
              type="button"
              onClick={() => setFilterVisitorId(null)}
              className="text-sm text-amber-400 hover:underline"
            >
              Show all visitors
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                      No page views{filterVisitorId ? " for this visitor" : ""}.
                    </td>
                  </tr>
                ) : (
                  visits.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-zinc-900/80">
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-500">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {r.user_email ?? `${r.visitor_id.slice(0, 8)}…`}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-amber-400/90">{r.path}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.country ?? "—"}</td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-xs text-zinc-500" title={r.referrer ?? undefined}>
                        {r.referrer ? referrerHost(r.referrer) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function referrerHost(referrer: string): string {
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer.slice(0, 40);
  }
}
