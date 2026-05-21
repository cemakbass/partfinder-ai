import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { BlogHeader } from "@/components/blog/blog-header";
import { MaterialIcon } from "@/components/dashboard/material-icon";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col bg-pf-background text-pf-on-surface">
      <BlogHeader active="article" />

      <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-pf-on-surface-variant transition-colors hover:text-pf-primary-container"
        >
          <MaterialIcon name="arrow_back" className="text-lg" />
          Back to blog
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-pf-primary-container/30 bg-pf-primary-container/10 px-3 py-1 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-primary-container">
            {post.category}
          </span>
          <span className="text-sm text-pf-on-surface-variant">
            {formatDate(post.publishedAt)} · {post.readMinutes} min read
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-pf-on-surface-variant">{post.description}</p>

        <div className="my-10 h-px bg-pf-outline-variant/40" />

        <div className="space-y-10">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="flex items-center gap-2 text-xl font-bold text-pf-primary">
                <MaterialIcon name="chevron_right" className="text-pf-primary-container" />
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-pf-on-surface-variant">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-pf-primary-container/30 bg-pf-primary-container/10 p-8 text-center">
          <p className="text-lg font-bold text-white">Try PartFinder AI free</p>
          <p className="mt-2 text-sm text-pf-on-surface-variant">Upload a part photo and get OEM-style codes in seconds.</p>
          <Link
            href="/register"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pf-primary-container px-6 py-3 text-sm font-bold text-pf-on-primary-container"
          >
            Get started
            <MaterialIcon name="arrow_forward" className="text-lg" />
          </Link>
        </div>

        {related.length > 0 ? (
          <div className="mt-14 border-t border-pf-outline-variant/40 pt-10">
            <h3 className="text-sm font-bold uppercase tracking-wide text-pf-on-surface-variant">More to read</h3>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-pf-primary-container/40"
                  >
                    <div>
                      <p className="font-semibold text-white group-hover:text-pf-primary-container">{r.title}</p>
                      <p className="mt-1 text-xs text-pf-on-surface-variant">{r.readMinutes} min read</p>
                    </div>
                    <MaterialIcon name="north_east" className="shrink-0 text-pf-on-surface-variant group-hover:text-pf-primary-container" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      <SiteFooter />
    </div>
  );
}
