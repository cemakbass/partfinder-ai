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
  title: "Blog — Car Part Identification Tips | PartFinder AI",
  description:
    "Guides for US DIYers, repair shops, and collision estimators on OEM lookup and photo-based part identification.",
  path: "/blog"
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        rel="stylesheet"
      />
      <div className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen font-dashboard`}>
        {children}
      </div>
    </>
  );
}
