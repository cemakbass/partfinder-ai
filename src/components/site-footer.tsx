import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-white">
            Part<span className="text-amber-400">Finder</span> AI
          </p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
            AI part identification for reference only. Always verify fitment with a qualified technician and official OEM data.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white">
            Contact
          </a>
          <Link href="/login" className="hover:text-white">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
