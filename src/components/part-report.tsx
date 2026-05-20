import type { PartAnalysisResult } from "@/lib/types";

export function PartReport({
  result,
  vehicle,
  createdAt,
  showDisclaimer = true
}: {
  result: PartAnalysisResult;
  vehicle?: { make: string | null; model: string | null; year: string | null };
  createdAt?: string;
  showDisclaimer?: boolean;
}) {
  const vehicleLine = [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(" ");

  return (
    <div className="space-y-4 text-sm">
      {createdAt && (
        <p className="text-xs text-zinc-500">Report date: {new Date(createdAt).toLocaleString()}</p>
      )}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
        <p className="text-lg font-bold text-white">{result.partName}</p>
        <p className="mt-1 font-mono text-amber-400">{result.oemCode}</p>
        <p className="mt-2 text-zinc-400">{result.category}</p>
        <p className="mt-2 text-zinc-300">{result.description}</p>
        <p className="mt-2 text-xs text-zinc-500">Confidence: {result.confidence}</p>
      </div>

      {vehicleLine && (
        <p>
          <span className="text-zinc-500">Vehicle: </span>
          {vehicleLine}
        </p>
      )}

      {result.compatibleVehicles?.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">Compatible vehicles</p>
          <ul className="list-inside list-disc text-zinc-300">
            {result.compatibleVehicles.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      {result.estimatedDamage && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-xs font-semibold uppercase text-amber-400">Estimated damage</p>
          <p className="mt-1 text-zinc-200">{result.estimatedDamage}</p>
        </div>
      )}

      {result.damageRelatedParts && result.damageRelatedParts.length > 0 && (
        <div>
          <p className="mb-1 text-xs text-zinc-500">Related parts to inspect</p>
          <div className="flex flex-wrap gap-1">
            {result.damageRelatedParts.map((p) => (
              <span key={p} className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-zinc-500">Retailer search links</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(result.searchLinks).map(([site, url]) => (
            <a
              key={site}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-600 px-3 py-1 text-xs text-amber-400 hover:bg-zinc-800"
            >
              {site}
            </a>
          ))}
        </div>
      </div>

      {result.additionalNotes && (
        <p className="text-zinc-400">
          <span className="text-zinc-500">Notes: </span>
          {result.additionalNotes}
        </p>
      )}

      {showDisclaimer && (
        <p className="border-t border-zinc-700 pt-4 text-xs text-zinc-500">
          AI-generated research aid only. Verify OEM numbers, fitment, and safety with a qualified technician before ordering or
          installing parts.
        </p>
      )}
    </div>
  );
}
