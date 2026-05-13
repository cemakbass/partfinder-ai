import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-lg font-black tracking-tight">
              Part<span className="text-amber-400">Finder</span> Admin
            </Link>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">{user.email}</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/admin" className="text-zinc-400 hover:text-white">
              Overview
            </Link>
            <Link href="/admin/users" className="text-zinc-400 hover:text-white">
              Users
            </Link>
            <Link href="/admin/searches" className="text-zinc-400 hover:text-white">
              Searches
            </Link>
            <Link href="/dashboard" className="font-semibold text-amber-400 hover:text-amber-300">
              Back to app
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
