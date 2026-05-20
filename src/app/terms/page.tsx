import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/lib/legal-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service — PartFinder AI",
  description: "Terms of use for PartFinder AI automotive part identification service.",
  path: "/terms",
  noIndex: false
});

export default function TermsPage() {
  return <LegalPage title="Terms of Service" sections={termsSections} />;
}
