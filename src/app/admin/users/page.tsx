"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface UserRow {
  id: string;
  email: string;
  plan: string;
  searches_used: number;
  searches_limit: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin/users?${params.toString()}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          window.location.href = res.status === 401 ? "/login?next=/admin/users" : "/dashboard";
          return;
        }
        throw new Error(data.error ?? "Failed");
      }
      setUsers(data.users as UserRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Users</h1>
        <p className="mt-1 text-sm text-zinc-400">Search by email. Open a user to edit plan, limits, email, ban, or send a password reset.</p>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void load(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by email…"
          className="min-w-[200px] flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black">
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-zinc-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-950">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/80">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-semibold">{u.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {u.searches_used} / {u.searches_limit}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                    >
                      Edit
                    </Link>
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
