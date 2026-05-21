import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { buildPageMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-dashboard",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-dashboard-mono",
  display: "swap"
});

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard — PartFinder AI",
  description: "Run automotive part identifications from your PartFinder AI account.",
  path: "/dashboard",
  noIndex: true
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        rel="stylesheet"
      />
      <div className={`${inter.variable} ${jetbrainsMono.variable} font-dashboard`}>{children}</div>
    </>
  );
}
