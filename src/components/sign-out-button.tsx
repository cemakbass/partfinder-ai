"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

export function SignOutButton({ className, label = "Sign out" }: SignOutButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={loading || !supabase}
      className={
        className ??
        "rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
      }
    >
      {loading ? "Signing out…" : label}
    </button>
  );
}
