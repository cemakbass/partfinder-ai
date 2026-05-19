const VISITOR_COOKIE = "pf_vid";
const MAX_LEN = 500;

export function shouldTrackPath(path: string): boolean {
  if (!path || !path.startsWith("/")) return false;
  if (path.startsWith("/api")) return false;
  if (path.startsWith("/_next")) return false;
  if (path.startsWith("/admin")) return false;
  return true;
}

export function truncateField(value: string | null | undefined, max = MAX_LEN): string | null {
  if (!value) return null;
  const t = value.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

export { VISITOR_COOKIE };
