import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogStitchNav } from "@/components/blog/blog-stitch-nav";
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
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-on-surface">
      <BlogStitchNav />

      <article className="mx-auto max-w-3xl px-4 py-10 md:px-margin-desktop md:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="arrow_back" />
          Back to blog
        </Link>

        <div className="relative mb-8 mt-6 aspect-[21/9] overflow-hidden rounded-2xl border border-outline-variant bg-white">
          <img src={post.coverImage} alt={post.coverAlt} className="h-full w-full object-contain p-4" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-primary-container px-2 py-1 font-dashboard-mono text-[10px] uppercase text-on-primary-container">
            {post.category}
          </span>
          <span className="text-sm text-on-surface-variant">
            {formatDate(post.publishedAt)} · {post.readMinutes} min read
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-on-surface md:text-4xl">{post.title}</h1>
        <p className="mt-4 text-body-lg leading-relaxed text-on-surface-variant">{post.description}</p>

        <div className="my-10 h-px bg-outline-variant/40" />

        <div className="space-y-10">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
                <MaterialIcon name="chevron_right" className="text-primary-container" />
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mt-4 text-base leading-relaxed text-on-surface-variant">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-primary-container/30 bg-primary-container/10 p-8 text-center">
          <p className="text-lg font-bold text-on-surface">Try PartFinder AI free</p>
          <p className="mt-2 text-sm text-on-surface-variant">Upload a part photo and get OEM-style codes in seconds.</p>
          <Link
            href="/register"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container"
          >
            Get started
            <MaterialIcon name="arrow_forward" />
          </Link>
        </div>

        {related.length > 0 ? (
          <div className="mt-14 border-t border-outline-variant/40 pt-10">
            <h3 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">More to read</h3>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container p-4 transition-colors hover:border-primary/40"
                  >
                    <div>
                      <p className="font-semibold text-on-surface group-hover:text-primary">{r.title}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">{r.readMinutes} min read</p>
                    </div>
                    <MaterialIcon name="north_east" className="shrink-0 text-on-surface-variant group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      <footer className="border-t border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-margin-desktop">
          <span className="font-bold text-primary">PartFinder AI</span>
          <div className="flex gap-6 text-sm text-on-surface-variant">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
