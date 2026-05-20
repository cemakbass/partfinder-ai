import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Free Account — PartFinder AI | US Car Part Photo ID",
  description:
    "Sign up free for PartFinder AI. Identify car parts from photos with OEM-style codes and US retailer links. Monthly identifications included on the free plan.",
  path: "/register",
  keywords: ["sign up car parts AI", "free auto part identification", "OEM lookup account USA"]
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
