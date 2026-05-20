import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { HomeJsonLd, homeFaqs } from "@/components/seo/home-json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { PLAN_CONFIG, PLANS } from "@/lib/plans";

export const metadata: Metadata = buildPageMetadata({
  title: "PartFinder AI — Identify Car Parts by Photo | OEM Codes & Fitment (USA)",
  description:
    "US-focused AI tool: snap a photo of any auto part, get OEM-style numbers, year/make/model fitment hints, and links to Amazon, RockAuto, AutoZone & more. Free monthly identifications.",
  path: "/",
  keywords: [
    "identify car parts by photo",
    "OEM part number lookup USA",
    "auto parts identification app",
    "collision repair parts finder",
    "RockAuto OEM lookup",
    "AutoZone part number search"
  ]
});

function IconCamera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  );
}

function IconChip({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function IconTruck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.25 2.25 0 00-1.227-1.054l-1.47-.613m0 0l-1.125-.45a1.125 1.125 0 01-1.13-1.204l.105-1.5M15 18.75H9.75m6 0v-1.125c0-1.621-1.152-3.026-2.76-3.286m0 0a2.25 2.25 0 00-1.48 0m2.76 3.286l.082.38m0 0l1.104 4.723m-1.104-4.723a2.25 2.25 0 01-.114-.774m0 0a2.246 2.246 0 00-.655-1.471M9.75 18.75v-1.125c0-1.621 1.152-3.026 2.76-3.286m0 0c.085.006.17.009.255.009m-.255-.009a2.25 2.25 0 011.318-1.063m0 0l.38-.136m0 0l4.723-1.104M15 8.25v4.5m0 0l-1.5-1.5M15 8.25l1.5-1.5"
      />
    </svg>
  );
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const features = [
  {
    title: "Photo → identified part",
    body: "Drop a picture of a worn, broken, or mystery component. Vision AI reads shape, markings, and context to suggest a part name, category, and OEM-style reference code.",
    icon: IconCamera
  },
  {
    title: "Fitment you can act on",
    body: "See likely compatible makes, models, and years—not just a guess—so you can double-check with your VIN or parts desk before you order.",
    icon: IconTruck
  },
  {
    title: "US retailer shortcuts",
    body: "Jump to Amazon, RockAuto, AutoZone, and O'Reilly with prefilled search context—built for how American DIYers and shops already buy parts.",
    icon: IconCart
  },
  {
    title: "Collision & listing context",
    body: "Optional damage notes, related parts to inspect, and up to three synthesized marketplace-style listings with prices and stock hints—always verify on the seller’s site.",
    icon: IconBolt
  },
  {
    title: "History on your account",
    body: "Signed-in users keep a rolling history of analyses so you can revisit a job site photo or share results with a shop or insurer.",
    icon: IconClock
  },
  {
    title: "Plans that match volume",
    body: "Start on a free monthly allowance, then scale with Stripe-backed subscriptions when you’re running regular estimates or fleet checks.",
    icon: IconShield
  }
] as const;

const steps = [
  {
    title: "Capture the part",
    body: "Use your phone in the bay or lot. Include part numbers or stampings when visible—optional vehicle fields sharpen results."
  },
  {
    title: "Run the analyzer",
    body: "Our engine calls a leading vision model, then structures OEM clues, fitment, links, and notes into a single readable report."
  },
  {
    title: "Verify & purchase",
    body: "Use the report as a lab notebook, not a warranty. Confirm with a pro, then follow retailer links or your preferred supplier."
  }
] as const;

const usAudiences = [
  {
    title: "DIY & weekend wrenchers",
    body: "Skip hours of forum scrolling. Get a starting OEM reference and fitment direction before you drive to the parts store or order online for delivery across the US."
  },
  {
    title: "Independent repair shops",
    body: "Front-counter teams use PartFinder AI to document mystery components, attach photos to estimates, and speed up calls to NAPA, O'Reilly, or your jobber."
  },
  {
    title: "Collision & body shops",
    body: "Estimators capture damaged parts on the lift, note related components to inspect, and produce shareable summaries for supplements and insurer review."
  },
  {
    title: "Salvage & fleet operations",
    body: "Yard staff and fleet managers label unknown inventory faster—especially when tags are missing but the casting or bracket profile is visible."
  }
] as const;

const usKeywordsBlock = [
  "car part identification by photo",
  "OEM part number lookup",
  "automotive fitment research",
  "collision parts catalog search",
  "aftermarket vs OEM cross-reference starting point"
];

function HeroMockCard() {
  return (
    <div className="relative rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-5 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">Sample output</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">Illustrative</span>
      </div>
      <p className="text-sm font-bold text-white">Front lower control arm — LH</p>
      <p className="mt-1 font-mono text-xs text-zinc-500">OEM-style ref · MC5Z-3078-B</p>
      <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        <p>
          <span className="text-zinc-500">Fitment · </span>
          F-150 2015–2020 (verify trim)
        </p>
        <p>
          <span className="text-zinc-500">Retail · </span>
          Amazon · RockAuto · AutoZone
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {["High confidence", "Damage note", "3 listing hints"].map((tag) => (
            <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <HomeJsonLd />
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-black tracking-tight sm:text-xl">
            Part<span className="text-amber-400">Finder</span>
            <span className="text-zinc-500"> AI</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="#features" className="hidden text-sm text-zinc-400 hover:text-white md:inline">
              Product
            </Link>
            <Link href="#pricing" className="hidden text-sm text-zinc-400 hover:text-white md:inline">
              Pricing
            </Link>
            <Link href="#faq" className="hidden text-sm text-zinc-400 hover:text-white md:inline">
              FAQ
            </Link>
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-bold text-black sm:px-4"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:pb-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(251,191,36,0.18),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
              <IconChip className="h-4 w-4" />
              AI auto part identification · United States
            </p>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Identify any car part
              <span className="block text-amber-400">from one photo.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              PartFinder AI helps US drivers and repair professionals turn a smartphone picture into OEM-style part numbers, vehicle fitment
              hints, damage notes, and quick links to major American retailers—so you spend less time guessing and more time ordering the right
              component.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/register"
                className="inline-flex justify-center rounded-xl bg-amber-400 px-8 py-3.5 text-center text-base font-black text-black transition hover:bg-amber-300"
              >
                Create free account
              </Link>
              <Link
                href="/pricing"
                className="inline-flex justify-center rounded-xl border border-zinc-600 bg-zinc-900/50 px-8 py-3.5 text-center text-base font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Compare plans
              </Link>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              {PLAN_CONFIG.free.searchLimit} included identifications per month on the free tier—no card required.
            </p>
          </div>
          <div className="relative lg:pl-4">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-zinc-800/30 blur-2xl" aria-hidden />
            <HeroMockCard />
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-t border-zinc-800/80 bg-zinc-900/20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Built for how you actually work</h2>
            <p className="mt-4 text-lg text-zinc-400">
              Every feature maps to something you already do today—just with less guesswork and fewer open browser tabs.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="mb-4 inline-flex rounded-xl bg-amber-400/10 p-3 text-amber-400 transition group-hover:bg-amber-400/15">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Built for the US automotive aftermarket</h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Whether you are in a home garage in Texas, a body shop in California, or a fleet yard in the Midwest, PartFinder AI speaks the
              language of American parts research: OEM references, domestic fitment years, and retailer shortcuts you already use.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {usAudiences.map(({ title, body }) => (
              <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6" aria-labelledby="seo-topics">
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-10">
          <h2 id="seo-topics" className="text-2xl font-black tracking-tight sm:text-3xl">
            Car part lookup by photo — how US teams use PartFinder AI
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            <p>
              Searching for an unknown component usually means bouncing between forums, PDF catalogs, and five open retailer tabs.
              PartFinder AI compresses that workflow: upload an image, receive a structured report with a suggested part name,{" "}
              <strong className="font-semibold text-zinc-200">OEM-style reference code</strong>, likely year/make/model fitment, and optional
              damage context for collision work.
            </p>
            <p>
              The platform is designed for the <strong className="font-semibold text-zinc-200">United States market</strong>: pricing in USD,
              monthly search allowances that match shop volume, and outbound shortcuts toward US ecommerce and parts chains. Results are
              research aids—always confirm against your VIN, trim level, and supplier catalog before install or warranty decisions.
            </p>
            <p className="text-zinc-500">Common searches we support: {usKeywordsBlock.join(" · ")}.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-400">
            Three short steps from photo to a shareable, shop-ready summary.
          </p>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((item, idx) => (
              <li key={item.title} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 pt-10">
                <span className="absolute left-6 top-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-black">
                  {idx + 1}
                </span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-t border-zinc-800/80 bg-zinc-900/25 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">Simple monthly pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-400">
            Transparent search allowances. Upgrade when your lane gets busier.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const cfg = PLAN_CONFIG[plan];
              const isFree = plan === "free";
              const isPopular = plan === "pro";
              return (
                <div
                  key={plan}
                  className={`flex flex-col rounded-2xl border p-6 ${
                    isPopular
                      ? "border-amber-400 bg-amber-400 text-black shadow-lg shadow-amber-500/10"
                      : "border-zinc-800 bg-zinc-950/80 text-white"
                  }`}
                >
                  {isPopular && (
                    <span className="mb-2 w-fit rounded-full bg-black/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
                      Most picked
                    </span>
                  )}
                  <h3 className="text-xl font-black">{cfg.name}</h3>
                  <p className={`mt-3 text-4xl font-black ${isPopular ? "" : "text-white"}`}>
                    {isFree ? "$0" : `$${cfg.monthlyPrice}`}
                  </p>
                  <p className={`mt-2 text-sm ${isPopular ? "text-black/80" : "text-zinc-400"}`}>
                    {cfg.searchLimit} identifications / month
                  </p>
                  <div className="mt-6 flex flex-1 flex-col justify-end gap-2">
                    {isFree ? (
                      <Link
                        href="/register"
                        className="block rounded-xl bg-amber-400 py-3 text-center text-sm font-bold text-black hover:bg-amber-300"
                      >
                        Start free
                      </Link>
                    ) : (
                      <Link
                        href="/pricing"
                        className={`block rounded-xl py-3 text-center text-sm font-bold ${
                          isPopular ? "bg-black text-white hover:bg-zinc-900" : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                      >
                        Subscribe
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Paid plans bill securely through Stripe. See full checkout details on the{" "}
            <Link href="/pricing" className="text-amber-400 underline-offset-2 hover:underline">
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black sm:text-3xl">Frequently asked questions</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-500">
            Answers for US drivers, DIYers, and repair shops using photo-based part identification.
          </p>
          <div className="mt-8 space-y-3">
            {homeFaqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 open:bg-zinc-900/60">
                <summary className="cursor-pointer list-none font-semibold text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {f.question}
                    <span className="text-zinc-500 transition group-open:rotate-180" aria-hidden>
                      ▼
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-gradient-to-b from-amber-500/10 to-zinc-950 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to name that part?</h2>
          <p className="mt-3 text-zinc-400">Create an account in under a minute and run your first identification today.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="rounded-xl bg-amber-400 px-8 py-3.5 font-black text-black hover:bg-amber-300">
              Get started free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-zinc-600 px-8 py-3.5 font-semibold text-white hover:border-zinc-500"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
