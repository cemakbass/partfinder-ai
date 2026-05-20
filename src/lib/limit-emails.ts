import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendLimitReachedEmail, sendLimitWarningEmail } from "@/lib/email";

export async function maybeSendLimitEmails(userId: string, email: string | undefined, used: number, limit: number) {
  if (!email || limit <= 0) return;

  const admin = getSupabaseAdmin();
  const warnThreshold = Math.max(1, Math.ceil(limit * 0.8));

  if (used >= limit) {
    const { data: row } = await admin.from("users").select("limit_reached_emailed_at").eq("id", userId).maybeSingle();
    if (!row?.limit_reached_emailed_at) {
      await sendLimitReachedEmail(email, limit);
      await admin.from("users").update({ limit_reached_emailed_at: new Date().toISOString() }).eq("id", userId);
    }
    return;
  }

  if (used >= warnThreshold) {
    const { data: row } = await admin.from("users").select("limit_warned_at").eq("id", userId).maybeSingle();
    if (!row?.limit_warned_at) {
      await sendLimitWarningEmail(email, used, limit);
      await admin.from("users").update({ limit_warned_at: new Date().toISOString() }).eq("id", userId);
    }
  }
}
