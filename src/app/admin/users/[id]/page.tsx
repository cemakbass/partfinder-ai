"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PLANS } from "@/lib/plans";
import type { Plan } from "@/lib/types";

interface Profile {
  id: string;
  email: string;
  plan: string;
  searches_used: number;
  searches_limit: number;
  created_at: string;
}

interface UserDetailResponse {
  profile: Profile;
  auth: {
    banned_until: string | null;
    email_confirmed_at: string | null;
    last_sign_in_at: string | null;
  };
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [plan, setPlan] = useState<Plan>("free");
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [searchesLimit, setSearchesLimit] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [banPreset, setBanPreset] = useState<string>("skip");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAuth, setSavingAuth] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { credentials: "include" });
      const json = (await res.json()) as UserDetailResponse & { error?: string };
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          window.location.href = res.status === 401 ? `/login?next=/admin/users/${id}` : "/dashboard";
          return;
        }
        throw new Error(json.error ?? "Failed to load user");
      }
      setData(json);
      setPlan(json.profile.plan as Plan);
      setSearchesUsed(json.profile.searches_used);
      setSearchesLimit(json.profile.searches_limit);
      setNewEmail(json.profile.email);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProfile = async () => {
    if (!id) return;
    setSavingProfile(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          searches_used: searchesUsed,
          searches_limit: searchesLimit
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      setData((prev) => (prev && json.profile ? { ...prev, profile: json.profile } : prev));
      setMessage("Profile updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveAuth = async () => {
    if (!id || !data) return;
    setSavingAuth(true);
    setMessage(null);
    setError(null);
    try {
      const payload: { email?: string; banDuration?: string } = {};
      const nextEmail = newEmail.trim().toLowerCase();
      const curEmail = data.profile.email.trim().toLowerCase();
      if (nextEmail !== curEmail) {
        payload.email = nextEmail;
      }
      if (banPreset !== "skip") {
        payload.banDuration = banPreset === "none" ? "none" : banPreset;
      }

      if (Object.keys(payload).length === 0) {
        setError("Change the email or pick a ban action.");
        return;
      }

      const res = await fetch(`/api/admin/users/${id}/auth`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Auth update failed");
      setMessage("Auth settings updated.");
      setBanPreset("skip");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Auth update failed");
    } finally {
      setSavingAuth(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!id) return;
    setSendingReset(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/password-reset`, {
        method: "POST",
        credentials: "include"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      if (json.sentEmail) {
        setMessage("Password reset email sent.");
      } else if (json.recoveryLink) {
        setMessage(
          `${json.note ?? ""} Copy link: ${json.recoveryLink as string}`.trim()
        );
        try {
          await navigator.clipboard.writeText(json.recoveryLink as string);
        } catch {
          /* ignore */
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Password reset failed");
    } finally {
      setSendingReset(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  if (error && !data) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">{error}</p>
        <Link href="/admin/users" className="text-amber-400 hover:underline">
          ← Back to users
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const banned = Boolean(data.auth.banned_until && new Date(data.auth.banned_until) > new Date());

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm text-amber-400 hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-black">User</h1>
        <p className="mt-1 font-mono text-xs text-zinc-500">{data.profile.id}</p>
      </div>

      {message && <p className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">{message}</p>}
      {error && data && <p className="rounded-lg border border-red-900 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-bold">Account status</h2>
        <dl className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-zinc-600">Email confirmed</dt>
            <dd>{data.auth.email_confirmed_at ? new Date(data.auth.email_confirmed_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-600">Last sign-in</dt>
            <dd>{data.auth.last_sign_in_at ? new Date(data.auth.last_sign_in_at).toLocaleString() : "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-zinc-600">Ban</dt>
            <dd className={banned ? "text-red-400" : ""}>
              {banned && data.auth.banned_until
                ? `Until ${new Date(data.auth.banned_until).toLocaleString()}`
                : "Not banned"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-bold">Plan & usage</h2>
        <p className="mt-1 text-sm text-zinc-500">Changing plan sets the default monthly search limit unless you override the limit below.</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">Plan</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Plan)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-medium"
            >
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">Searches used</span>
            <input
              type="number"
              min={0}
              value={searchesUsed}
              onChange={(e) => setSearchesUsed(Number(e.target.value))}
              className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">Searches limit</span>
            <input
              type="number"
              min={0}
              value={searchesLimit}
              onChange={(e) => setSearchesLimit(Number(e.target.value))}
              className="w-32 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={savingProfile}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            {savingProfile ? "Saving…" : "Save plan & limits"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-bold">Email & restrictions</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Email updates Supabase Auth (confirmed) and syncs <code className="text-zinc-400">public.users</code>.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex max-w-md flex-col gap-1 text-sm">
            <span className="text-zinc-500">Email</span>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="flex max-w-md flex-col gap-1 text-sm">
            <span className="text-zinc-500">Ban / restriction</span>
            <select
              value={banPreset}
              onChange={(e) => setBanPreset(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            >
              <option value="skip">No ban change</option>
              <option value="none">Lift ban</option>
              <option value="1h">Ban 1 hour</option>
              <option value="24h">Ban 24 hours</option>
              <option value="168h">Ban 7 days</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void saveAuth()}
            disabled={savingAuth}
            className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-50"
          >
            {savingAuth ? "Applying…" : "Apply email / ban"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-bold">Password</h2>
        <p className="mt-1 text-sm text-zinc-500">Sends a Supabase recovery email when SMTP is configured; otherwise a one-time link is returned.</p>
        <button
          type="button"
          onClick={() => void sendPasswordReset()}
          disabled={sendingReset}
          className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          {sendingReset ? "Working…" : "Send password reset"}
        </button>
      </section>
    </div>
  );
}
