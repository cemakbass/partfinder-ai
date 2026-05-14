"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    const run = async () => {
      await new Promise((r) => setTimeout(r, 100));
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setHasSession(!!data.session);
      setReady(true);
    };

    void run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setHasSession(!!session);
      setReady(true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: upd } = await supabase.auth.updateUser({ password });
      if (upd) {
        setError(upd.message);
        return;
      }
      setMessage("Password updated. Redirecting…");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!supabase) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 text-sm text-zinc-400">
          <p className="font-semibold text-amber-400">App configuration incomplete</p>
          <p className="mt-2">Missing Supabase environment variables.</p>
          <Link href="/login" className="mt-4 inline-block text-amber-400">
            ← Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-2 text-3xl font-black">Set new password</h1>
        <p className="mb-6 text-sm text-zinc-400">Use the link from your email to open this page, then choose a new password.</p>

        {!ready ? (
          <p className="text-sm text-zinc-400">Checking session…</p>
        ) : !hasSession ? (
          <div className="space-y-4 text-sm text-zinc-400">
            <p>This link is invalid or has expired. Request a new reset link from the login page.</p>
            <Link href="/forgot-password" className="text-amber-400">
              Forgot password
            </Link>
            {" · "}
            <Link href="/login" className="text-amber-400">
              Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-green-400">{message}</p>}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-amber-400 py-3 font-bold text-black disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
