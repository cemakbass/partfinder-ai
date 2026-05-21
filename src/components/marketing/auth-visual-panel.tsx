import Image from "next/image";
import Link from "next/link";
import { MARKETING_IMAGES } from "@/lib/marketing-images";

export function AuthVisualPanel({ variant = "register" }: { variant?: "login" | "register" }) {
  const image = variant === "login" ? MARKETING_IMAGES.engineScan : MARKETING_IMAGES.heroWorkshop;
  return (
    <div className="relative hidden min-h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 lg:flex">
      <div className="absolute inset-0">
        <Image src={image.src} alt={image.alt} fill className="object-cover opacity-60" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
      </div>
      <div className="relative z-10 p-8">
        <Link href="/" className="text-xl font-black text-white">
          Part<span className="text-amber-400">Finder</span> AI
        </Link>
        <p className="mt-6 max-w-sm text-lg font-bold leading-snug text-white">
          Identify automotive parts from a single photo.
        </p>
        <p className="mt-3 max-w-sm text-sm text-zinc-400">
          OEM-style codes, fitment hints, and US retailer links — built for shops, estimators, and DIYers.
        </p>
      </div>
      <div className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Trusted workflow</p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          <li>· Photo upload with optional year / make / model</li>
          <li>· Shareable 7-day report links</li>
          <li>· Secure Stripe subscriptions</li>
        </ul>
      </div>
    </div>
  );
}
