import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  const disallow = ["/dashboard", "/dashboard/", "/admin", "/admin/", "/api/", "/update-password", "/forgot-password"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow
      },
      // Common AI / search crawlers — same public access as Googlebot (no block unless you add one later).
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "anthropic-ai", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
