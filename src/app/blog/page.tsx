import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { BlogHeader } from "@/components/blog/blog-header";
import { MaterialIcon } from "@/components/dashboard/material-icon";
import { blogPosts } from "@/lib/blog-posts";

const featured = blogPosts[0];
const rest = blogPosts.slice(1);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-pf-background text-pf-on-surface">
      <BlogHeader active="blog" />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-pf-outline-variant/40"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #4f4633 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pf-primary-container/5 via-transparent to-pf-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pf-primary-container/25 bg-pf-primary-container/10 px-3 py-1">
            <MaterialIcon name="auto_stories" className="text-lg text-pf-primary-container" />
            <span className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-primary">
              Insights &amp; guides
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            US automotive part research, explained clearly
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-pf-on-surface-variant">
            Photo-based identification, OEM lookup workflows, and collision shop tips — written for DIYers, independents,
            and estimators.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-12">
        {/* Featured */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-12 grid overflow-hidden rounded-2xl border border-pf-outline-variant/50 bg-pf-surface-container-low transition-colors hover:border-pf-primary-container/40 md:grid-cols-2"
        >
          <div className="relative min-h-[220px] bg-gradient-to-br from-pf-surface-container-high via-pf-surface-container to-pf-surface-container-lowest md:min-h-[280px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <MaterialIcon name="center_focus_strong" className="text-[120px] text-pf-primary-container" />
            </div>
            <div className="absolute left-4 top-4 rounded-lg bg-pf-surface-container-lowest/90 px-2.5 py-1 font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-primary-container backdrop-blur-sm">
              Featured
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <span className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">
              {featured.category}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white transition-colors group-hover:text-pf-primary md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-pf-on-surface-variant">{featured.description}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-pf-on-surface-variant">
              <MaterialIcon name="schedule" className="text-base" />
              {featured.readMinutes} min read · {formatDate(featured.publishedAt)}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pf-primary-container">
              Read article
              <MaterialIcon name="arrow_forward" className="text-base transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-xl font-bold text-white">Latest articles</h3>
          <span className="font-dashboard-mono text-[10px] uppercase tracking-wider text-pf-on-surface-variant">
            {blogPosts.length} posts
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition-colors hover:border-pf-primary-container/50"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-pf-surface-container-high to-pf-surface-container-lowest">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MaterialIcon
                    name={post.category === "Collision" ? "minor_crash" : post.category === "OEM lookup" ? "sell" : "photo_camera"}
                    className="text-5xl text-pf-primary-container/40"
                  />
                </div>
                <span className="absolute left-3 top-3 rounded-md border border-pf-outline-variant/50 bg-pf-surface-container-lowest/90 px-2 py-0.5 font-dashboard-mono text-[10px] uppercase tracking-wide text-pf-primary-container">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-white group-hover:text-pf-primary-container">{post.title}</h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-pf-on-surface-variant">{post.description}</p>
                <p className="mt-4 font-dashboard-mono text-[10px] text-pf-on-surface-variant/80">
                  {post.readMinutes} min · {formatDate(post.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-14 rounded-2xl border border-pf-primary-container/30 bg-pf-primary-container/10 p-8 text-center md:p-12">
          <MaterialIcon name="bolt" className="mx-auto text-4xl text-pf-primary-container" />
          <h3 className="mt-4 text-2xl font-bold text-white">Identify any part in seconds</h3>
          <p className="mx-auto mt-2 max-w-lg text-pf-on-surface-variant">
            Upload a photo from the shop floor and get OEM-style codes, fitment hints, and US retailer links.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pf-primary-container px-8 py-3 text-sm font-bold text-pf-on-primary-container shadow-lg shadow-pf-primary-container/20"
          >
            Start free
            <MaterialIcon name="center_focus_strong" className="text-lg" />
          </Link>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
