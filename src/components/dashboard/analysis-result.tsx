import type { PartAnalysisResult } from "@/lib/types";

interface AnalysisResultProps {
  result: PartAnalysisResult;
  currentSearchId: string | null;
  shareUrl: string | null;
  shareLoading: boolean;
  shareCopied: boolean;
  onCreateShare: () => void;
  onCopyShare: () => void;
}

export function AnalysisResult({
  result,
  currentSearchId,
  shareUrl,
  shareLoading,
  shareCopied,
  onCreateShare,
  onCopyShare
}: AnalysisResultProps) {
  return (
    <div className="space-y-4 text-sm text-pf-on-surface">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Part</p>
          <p className="mt-1 font-semibold text-white">{result.partName}</p>
        </div>
        <div>
          <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">OEM</p>
          <p className="mt-1 font-mono text-pf-primary">{result.oemCode}</p>
        </div>
        <div>
          <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Category</p>
          <p className="mt-1">{result.category}</p>
        </div>
        <div>
          <p className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Confidence</p>
          <p className="mt-1 capitalize">{result.confidence}</p>
        </div>
      </div>

      <p className="leading-relaxed text-pf-on-surface-variant">{result.description}</p>

      {result.estimatedDamage ? (
        <div className="rounded-xl border border-pf-primary-container/30 bg-pf-primary-container/10 p-4">
          <p className="mb-1 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-primary-container">
            Estimated damage
          </p>
          <p className="text-pf-on-surface">{result.estimatedDamage}</p>
        </div>
      ) : null}

      {result.damageRelatedParts && result.damageRelatedParts.length > 0 ? (
        <div>
          <p className="mb-2 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">
            Likely related parts
          </p>
          <div className="flex flex-wrap gap-2">
            {result.damageRelatedParts.map((p) => (
              <span key={p} className="rounded-lg bg-pf-surface-container-high px-2.5 py-1 text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {(result.marketplaceListings ?? []).length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold text-pf-on-surface-variant">Sample listings</p>
          <p className="mb-3 text-[11px] text-pf-on-surface-variant/80">
            AI-assisted estimates — confirm on the retailer&apos;s site.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {(result.marketplaceListings ?? []).slice(0, 3).map((listing, idx) => (
              <a
                key={`${idx}-${listing.site}`}
                href={listing.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-xl border border-pf-outline-variant/40 bg-pf-surface-container-high transition-colors hover:border-pf-primary-container/50"
              >
                <div className="relative aspect-[4/3] bg-pf-surface-container-lowest">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-pf-on-surface-variant">No image</div>
                  )}
                  <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold">
                    {listing.site}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-2 text-xs font-medium">{listing.title}</p>
                  <p className="mt-1 text-sm font-bold text-pf-primary-container">{listing.priceDisplay}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-4">
        <a href={result.searchLinks.amazon} target="_blank" rel="noreferrer" className="text-pf-primary-container hover:underline">
          Amazon
        </a>
        <a href={result.searchLinks.rockauto} target="_blank" rel="noreferrer" className="text-pf-primary-container hover:underline">
          RockAuto
        </a>
        <a href={result.searchLinks.autozone} target="_blank" rel="noreferrer" className="text-pf-primary-container hover:underline">
          AutoZone
        </a>
      </div>

      {result.additionalNotes ? (
        <p className="rounded-lg border border-pf-outline-variant/30 bg-pf-surface-container-high/50 p-3 text-xs text-pf-on-surface-variant">
          {result.additionalNotes}
        </p>
      ) : null}

      {currentSearchId ? (
        <div className="rounded-xl border border-pf-outline-variant/40 bg-pf-surface-container-high p-4">
          <p className="mb-2 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">Share report</p>
          <p className="mb-3 text-[11px] text-pf-on-surface-variant">Read-only link, valid 7 days. Recipient can print or save as PDF.</p>
          {!shareUrl ? (
            <button
              type="button"
              disabled={shareLoading}
              onClick={onCreateShare}
              className="rounded-xl bg-pf-surface-container-high px-4 py-2 text-xs font-bold text-white ring-1 ring-pf-outline-variant hover:ring-pf-primary-container disabled:opacity-50"
            >
              {shareLoading ? "Creating link…" : "Create share link"}
            </button>
          ) : (
            <div className="space-y-2">
              <input readOnly value={shareUrl} className="w-full rounded-lg border border-pf-outline-variant/50 bg-pf-surface-container-lowest px-3 py-2 text-[11px]" />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCopyShare}
                  className="flex-1 rounded-xl bg-pf-primary-container py-2 text-xs font-bold text-pf-on-primary-container"
                >
                  {shareCopied ? "Copied" : "Copy link"}
                </button>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-pf-outline-variant py-2 text-center text-xs font-semibold"
                >
                  Open
                </a>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
