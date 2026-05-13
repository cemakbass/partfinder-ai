"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-white">
      <h1 className="mb-2 text-2xl font-black">Something went wrong</h1>
      {error.digest ? (
        <p className="mb-4 font-mono text-xs text-zinc-500">Digest: {error.digest}</p>
      ) : null}
      <p className="mb-8 max-w-md text-center text-sm text-zinc-400">{error.message || "An unexpected error occurred."}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-amber-400 px-8 py-3 font-bold text-black hover:bg-amber-300"
      >
        Try again
      </button>
      <a href="/" className="mt-6 text-sm text-zinc-500 underline hover:text-zinc-300">
        Back to home
      </a>
    </div>
  );
}
