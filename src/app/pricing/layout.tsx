import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — PartFinder AI | US Auto Part Identification Plans",
  description:
    "Simple monthly plans for US DIYers and repair shops. Free tier with included photo identifications, then Starter, Pro, and Ultra for higher volume OEM lookup and fitment research.",
  path: "/pricing",
  keywords: [
    "auto parts identification pricing",
    "car part lookup subscription",
    "collision shop software pricing",
    "OEM part number tool USA"
  ]
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-6 py-8 text-center">
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-500">
          Monthly plans for US DIYers, independent shops, and collision teams who identify automotive parts by photo. All prices in USD;
          billed securely through Stripe. Start on the free tier from the{" "}
          <a href="/register" className="text-amber-400 hover:underline">
            home page
          </a>
          .
        </p>
      </div>
      {children}
    </>
  );
}
