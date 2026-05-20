import type { Metadata } from "next";
import { VisitTracker } from "@/components/visit-tracker";
import { buildPageMetadata, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  ...buildPageMetadata({}),
  title: {
    default: "PartFinder AI — Identify Car Parts by Photo (USA)",
    template: `%s | ${SITE_NAME}`
  },
  category: "Automotive",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  verification: {
    google: "X4rQjE7t__Ju9P6t9nCihh9Hq_XzytijlCLDkyyAYns"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
