import { createServerSupabase } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

export type AdminAuthResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; reason: "unauthorized" | "forbidden" };

export async function getAdminSession(): Promise<AdminAuthResult> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return { ok: false, reason: "unauthorized" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, reason: "unauthorized" };
  }
  if (!isAdminEmail(user.email)) {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true, userId: user.id, email: user.email };
}
