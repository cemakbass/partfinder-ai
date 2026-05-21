import Link from "next/link";
import { MaterialIcon } from "@/components/dashboard/material-icon";

export function BlogHeader({ active = "blog" }: { active?: "blog" | "article" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-pf-outline-variant/50 bg-pf-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-bold text-pf-primary">
          Part<span className="text-pf-primary-container">Finder</span> AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-pf-on-surface-variant md:flex">
          <Link href="/" className="transition-colors hover:text-pf-on-surface">
            Home
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-pf-on-surface">
            Pricing
          </Link>
          <Link
            href="/blog"
            className={active === "blog" ? "text-pf-primary-container" : "transition-colors hover:text-pf-on-surface"}
          >
            Blog
          </Link>
        </nav>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-xl bg-pf-primary-container px-4 py-2 text-sm font-bold text-pf-on-primary-container transition-transform active:scale-[0.98]"
        >
          Try free
          <MaterialIcon name="arrow_forward" className="text-base" />
        </Link>
      </div>
    </header>
  );
}
