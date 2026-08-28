import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  if (p.get("secret") !== "kurtar-2026-xyz") {
    return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const email = (p.get("email") ?? "").toLowerCase();

  const list = await fetch(`${url}/auth/v1/admin/users?per_page=200`, { headers: h }).then(r => r.json());
  const user = list.users?.find((x: any) => x.email?.toLowerCase() === email);
  if (!user) return NextResponse.json({ bulunamadi: list.users?.map((x: any) => x.email) });

  const del = await fetch(`${url}/rest/v1/login_throttle?user_id=eq.${user.id}`, {
    method: "DELETE", headers: h,
  });

  const upd = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: "PUT", headers: h,
    body: JSON.stringify({ ban_duration: "none", password: p.get("pw") }),
  });

  return NextResponse.json({ sayacSilindi: del.ok, banKaldirildi: upd.ok });
}
