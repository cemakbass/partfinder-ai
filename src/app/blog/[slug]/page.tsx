import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { blogPosts, getBlogPost } from "@/lib/blog-posts";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return buildPageMetadata({
    title: `${post.title} | PartFinder AI Blog`,
    description: post.description,
    path: `/blog/${post.slug}`
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-lg font-black">
            Part<span className="text-amber-400">Finder</span> AI
          </Link>
          <Link href="/blog" className="text-sm text-zinc-400 hover:text-white">
            ← Blog
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs text-zinc-500">
          {post.publishedAt} · {post.readMinutes} min read
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-zinc-400">{post.description}</p>
        <div className="mt-10 space-y-8">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-bold text-amber-400/90">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <p className="font-semibold">Try PartFinder AI free</p>
          <p className="mt-2 text-sm text-zinc-400">Upload a part photo and get OEM-style codes in seconds.</p>
          <Link
            href="/register"
            className="mt-4 inline-block rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-black"
          >
            Get started
          </Link>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
