"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) {
      setRedirectTo(n);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const signInPromise = supabase.auth.signInWithPassword({ email, password });
      const timeoutPromise = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("Login request timed out. Check your Supabase URL/key and network.")), 15000);
      });

      const { error: signInError } = await Promise.race([signInPromise, timeoutPromise]);
      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-6 text-3xl font-black">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-amber-400 py-3 font-bold text-black disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-400">
          No account?{" "}
          <Link href="/register" className="text-amber-400">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
