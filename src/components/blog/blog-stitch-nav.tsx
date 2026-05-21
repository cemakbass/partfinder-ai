"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/dashboard/material-icon";

export function BlogStitchNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-margin-desktop">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="text-headline-md font-bold text-primary">
            PartFinder AI
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/dashboard" className="text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Identification
            </Link>
            <Link href="/pricing" className="text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Pricing
            </Link>
            <span className="border-b-2 border-primary pb-1 text-body-md font-bold text-primary">Blog</span>
            <Link href="/privacy" className="text-body-md text-on-surface-variant transition-colors hover:text-primary">
              Documentation
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden items-center rounded-full border border-outline-variant bg-surface-container px-4 py-1.5 lg:flex">
            <MaterialIcon name="search" className="text-[20px] text-on-surface-variant" />
            <span className="ml-2 w-40 text-sm text-on-surface-variant">Search on blog page</span>
          </div>
          <Link
            href="/register"
            className="rounded-full bg-primary-container px-5 py-2 text-button font-semibold text-on-primary-container transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
