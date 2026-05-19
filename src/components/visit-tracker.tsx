"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function trackPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("/api") || path.startsWith("/admin")) {
    return;
  }

  const referrer = typeof document !== "undefined" ? document.referrer || null : null;

  void fetch("/api/track-visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body: JSON.stringify({ path, referrer })
  }).catch(() => undefined);
}

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackPath(pathname);
  }, [pathname]);

  return null;
}
