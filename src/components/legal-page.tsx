import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-content";

export function LegalPage({
  title,
  sections
}: {
  title: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-lg font-black">
            Part<span className="text-amber-400">Finder</span> AI
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Home
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {LEGAL_LAST_UPDATED}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-amber-400/90">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
