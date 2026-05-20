import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { blogPosts } from "@/lib/blog-posts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog — Car Part Identification Tips | PartFinder AI",
  description: "Guides for US DIYers, repair shops, and collision estimators on OEM lookup and photo-based part identification.",
  path: "/blog"
});

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-lg font-black">
            Part<span className="text-amber-400">Finder</span> AI
          </Link>
          <Link href="/register" className="text-sm font-semibold text-amber-400">
            Try free →
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-black">Blog</h1>
        <p className="mt-2 text-zinc-400">US-focused guides for photo-based automotive part research.</p>
        <ul className="mt-10 space-y-6">
          {blogPosts.map((post) => (
            <li key={post.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-xl font-bold group-hover:text-amber-400">{post.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{post.description}</p>
                <p className="mt-3 text-xs text-zinc-500">
                  {post.readMinutes} min read · {post.publishedAt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <SiteFooter />
    </main>
  );
}
