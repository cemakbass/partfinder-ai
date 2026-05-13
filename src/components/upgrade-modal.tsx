"use client";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-2xl font-black mb-2">Search Limit Reached</h3>
        <p className="text-zinc-400 mb-6">
          You have used all available searches. Upgrade your plan to continue identifying car parts.
        </p>
        <div className="flex gap-3">
          <a
            href="/pricing"
            className="flex-1 text-center rounded-xl bg-amber-400 px-4 py-3 font-bold text-black hover:bg-amber-300"
          >
            View Plans
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
