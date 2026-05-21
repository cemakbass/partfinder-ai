"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/dashboard/material-icon";
import { BlogStitchNav } from "@/components/blog/blog-stitch-nav";
import { blogPosts, type BlogPost } from "@/lib/blog-posts";

const CATEGORIES = ["All Articles", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

const TAGS = ["#ComputerVision", "#OEM_Data", "#NeuralArchitecture", "#SupplyChain", "#AutoTech"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function matchesSearch(post: BlogPost, q: string) {
  if (!q.trim()) return true;
  const hay = `${post.title} ${post.description} ${post.category}`.toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

function PostCard({ post, showNew }: { post: BlogPost; showNew?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-2xl border border-outline-variant bg-surface-container p-2 transition-all hover:border-primary/30"
    >
      <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
        <img src={post.coverImage} alt={post.coverAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {showNew ? (
          <span className="absolute right-2 top-2 rounded bg-error-container px-2 py-0.5 text-[10px] font-bold text-on-error-container">
            NEW
          </span>
        ) : null}
      </div>
      <div className="px-2 pb-2">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="font-dashboard-mono text-label-sm uppercase text-primary">{post.category}</span>
        </div>
        <h3 className="mb-2 text-headline-md font-semibold text-on-surface transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="font-dashboard-mono text-label-sm text-on-surface-variant">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  );
}

export function BlogIndexClient() {
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [category, setCategory] = useState("All Articles");
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const catOk = category === "All Articles" || p.category === category;
      return catOk && matchesSearch(p, sidebarQuery);
    });
  }, [category, sidebarQuery]);

  const featured = filtered[0];
  const gridPosts = filtered.slice(1);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Articles": blogPosts.length };
    for (const p of blogPosts) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-lowest font-body-md text-on-surface">
      <BlogStitchNav />

      <main className="relative">
        <section className="technical-grid relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-margin-desktop">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-[2px] w-12 bg-primary-container" />
                <span className="font-dashboard-mono text-label-sm uppercase tracking-widest text-primary">Engineering Blog</span>
              </div>
              <h1 className="mb-6 text-display font-extrabold tracking-tight text-on-surface">Engineering Insights</h1>
              <p className="max-w-2xl text-body-lg text-on-surface-variant">
                Deep dives into photo-based part identification, OEM lookup workflows, and collision research for US shops
                and DIYers.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-margin-desktop md:pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-10 lg:col-span-8">
              {featured ? (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container transition-all duration-300 hover:border-primary/50"
                >
                  <div className="aspect-[21/9] overflow-hidden">
                    <img
                      src={featured.coverImage}
                      alt={featured.coverAlt}
                      className="h-full w-full scale-105 object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="relative p-6 md:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="rounded bg-primary-container px-2 py-1 font-dashboard-mono text-[10px] uppercase text-on-primary-container">
                        {featured.category}
                      </span>
                      <span className="font-dashboard-mono text-label-sm text-on-surface-variant">
                        {featured.readMinutes} min read
                      </span>
                    </div>
                    <h2 className="mb-3 text-headline-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                      {featured.title}
                    </h2>
                    <p className="mb-6 line-clamp-2 text-on-surface-variant">{featured.description}</p>
                    <span className="inline-flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3">
                      Read article
                      <MaterialIcon name="arrow_forward" />
                    </span>
                  </div>
                </Link>
              ) : (
                <p className="rounded-2xl border border-dashed border-outline-variant p-12 text-center text-on-surface-variant">
                  No articles match your filters.
                </p>
              )}

              {gridPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {gridPosts.map((post, i) => (
                    <PostCard key={post.slug} post={post} showNew={i === 0 && category === "All Articles"} />
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="space-y-8 lg:col-span-4">
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6">
                <h4 className="mb-4 text-headline-md font-semibold text-on-surface">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={sidebarQuery}
                    onChange={(e) => setSidebarQuery(e.target.value)}
                    placeholder="Topics, keywords..."
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <MaterialIcon name="search" className="pointer-events-none absolute right-3 top-3 text-on-surface-variant" />
                </div>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6">
                <h4 className="mb-4 text-headline-md font-semibold text-on-surface">Categories</h4>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const active = category === cat;
                    return (
                      <li key={cat}>
                        <button
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-button transition-colors ${
                            active
                              ? "bg-primary-container text-on-primary-container"
                              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="font-dashboard-mono text-label-sm">{categoryCounts[cat] ?? 0}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container">
                <MaterialIcon
                  name="alternate_email"
                  className="pointer-events-none absolute -right-8 -top-8 text-[120px] opacity-10"
                />
                <h4 className="relative z-10 mb-2 text-headline-md font-semibold">Technical Updates</h4>
                <p className="relative z-10 mb-6 text-sm text-on-primary-container/80">
                  Product news and identification tips. We&apos;ll only email when there is something useful.
                </p>
                <form
                  className="relative z-10 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewsletterMsg("Thanks — newsletter signup is coming soon. Try PartFinder free today.");
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="work@company.com"
                    className="w-full rounded-xl border border-on-primary-container/20 bg-on-primary-container/10 px-4 py-2.5 text-on-primary-container placeholder-on-primary-container/50 outline-none focus:border-on-primary-container"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-on-primary-container py-2.5 text-button font-semibold text-primary-container transition-colors hover:bg-on-primary-container/90"
                  >
                    Subscribe
                  </button>
                  {newsletterMsg ? <p className="text-xs text-on-primary-container/90">{newsletterMsg}</p> : null}
                </form>
              </div>

              <div className="p-2">
                <h4 className="mb-4 font-dashboard-mono text-label-sm uppercase text-on-surface-variant">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSidebarQuery(tag.replace("#", ""))}
                      className="cursor-pointer rounded-full border border-outline-variant bg-surface-container px-2.5 py-1 text-xs text-on-surface-variant transition-colors hover:border-primary"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row md:px-margin-desktop">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-headline-md font-bold text-primary">PartFinder AI</span>
            <p className="max-w-md text-center font-dashboard-mono text-label-sm text-on-surface-variant md:text-left">
              © {new Date().getFullYear()} PartFinder AI. Precision engineering for automotive intelligence.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="font-dashboard-mono text-label-sm text-on-surface-variant transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-dashboard-mono text-label-sm text-on-surface-variant transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/pricing" className="font-dashboard-mono text-label-sm text-on-surface-variant transition-colors hover:text-primary">
              Pricing
            </Link>
            <a
              href="mailto:support@avtopartfinder.com"
              className="font-dashboard-mono text-label-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
