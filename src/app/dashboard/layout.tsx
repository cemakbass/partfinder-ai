import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard — PartFinder AI",
  description: "Run automotive part identifications from your PartFinder AI account.",
  path: "/dashboard",
  noIndex: true
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
