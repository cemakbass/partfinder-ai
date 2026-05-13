"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError(
          "Could not create account. If email confirmation is enabled, check your inbox — you may need to confirm before signing in."
        );
        setLoading(false);
        return;
      }

      setMessage("Account created. Redirecting…");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Network error — could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL / anon key and your internet connection.";
      setError(msg.includes("fetch") ? msg + " (often: wrong Supabase URL, paused project, or VPN/firewall blocking requests.)" : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-6 text-3xl font-black">Create Account</h1>
        {!supabase ? (
          <div className="rounded-xl border border-amber-500/30 bg-zinc-950/80 p-4 text-sm text-zinc-400">
            <p className="font-semibold text-amber-400">App configuration incomplete</p>
            <p className="mt-2 leading-relaxed">
              Missing <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_URL</code> or{" "}
              <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Set them on your host (Vercel → Environment Variables),
              then redeploy.
            </p>
            <Link href="/" className="mt-4 inline-block text-amber-400 hover:underline">
              ← Home
            </Link>
          </div>
        ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-amber-400 py-3 font-bold text-black disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        )}
        {supabase && (
        <p className="mt-4 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400">
            Login
          </Link>
        </p>
        )}
      </div>
    </main>
  );
}
