import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  if (p.get("secret") !== "kurtar-2026-xyz") {
    return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const list = await fetch(`${url}/auth/v1/admin/users?per_page=200`, { headers: h }).then(r => r.json());
  const user = list.users?.find((x: any) => x.email === p.get("email"));
  if (!user) return NextResponse.json({ bulunamadi: list.users?.map((x: any) => x.email) });

  await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: "PUT", headers: h,
    body: JSON.stringify({ ban_duration: "none", password: p.get("pw") }),
  });

  // profiles tablosundaki kaydı oku
  const prof = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}&select=*`, { headers: h })
    .then(r => r.json()).catch(() => null);

  return NextResponse.json({ ban: "kaldirildi", profil: prof });
}
