"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import { AuthVisualPanel } from "@/components/marketing/auth-visual-panel";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!acceptedTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: getAuthCallbackUrl() }
      });
      if (signUpError) {
        const dup =
          /already registered|already exists|user already|duplicate/i.test(signUpError.message) ||
          signUpError.code === "user_already_exists";
        setError(
          dup
            ? "An account with this email already exists. Sign in instead or use “Forgot password” on the login page."
            : signUpError.message
        );
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

      const identities = data.user.identities;
      if (Array.isArray(identities) && identities.length === 0) {
        setError(
          "An account with this email already exists. Sign in instead or use “Forgot password” on the login page."
        );
        setLoading(false);
        return;
      }

      void fetch("/api/email/welcome", { method: "POST" }).catch(() => undefined);

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
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-8 lg:grid-cols-2 lg:items-stretch">
        <AuthVisualPanel variant="register" />
        <div className="flex flex-col justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
        <Link href="/" className="mb-6 text-lg font-black lg:hidden">
          Part<span className="text-amber-400">Finder</span> AI
        </Link>
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
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 rounded border-zinc-600"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-amber-400 hover:underline" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-400 hover:underline" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}
          <button
            disabled={loading || !acceptedTerms}
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
      </div>
    </main>
  );
}
