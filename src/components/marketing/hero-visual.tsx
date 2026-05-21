import Image from "next/image";
import { MARKETING_IMAGES } from "@/lib/marketing-images";

function HeroMockCard() {
  return (
    <div className="relative z-10 rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-5 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">Sample output</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">Illustrative</span>
      </div>
      <p className="text-sm font-bold text-white">Front lower control arm — LH</p>
      <p className="mt-1 font-mono text-xs text-zinc-500">OEM-style ref · MC5Z-3078-B</p>
      <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        <p>
          <span className="text-zinc-500">Fitment · </span>
          F-150 2015–2020 (verify trim)
        </p>
        <p>
          <span className="text-zinc-500">Retail · </span>
          Amazon · RockAuto · AutoZone
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {["High confidence", "Damage note", "3 listing hints"].map((tag) => (
            <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const img = MARKETING_IMAGES.heroWorkshop;
  return (
    <div className="relative lg:pl-4">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-zinc-800/30 blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-zinc-700/60 shadow-2xl shadow-black/50">
        <div className="relative aspect-[4/3] sm:aspect-[16/11]">
          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 520px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
        </div>
        <div className="relative -mt-16 mx-4 mb-4 sm:-mt-20">
          <HeroMockCard />
        </div>
      </div>
    </div>
  );
}
