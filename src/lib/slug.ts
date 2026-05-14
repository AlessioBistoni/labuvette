const RESERVED_SLUGS = new Set([
  "nuovo",
  "gestione",
  "login",
  "api",
  "admin",
  "redazione",
  "_next",
]);

export function sanitizeSlug(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (s.length < 2 || s.length > 96) return null;
  if (RESERVED_SLUGS.has(s)) return null;
  return s;
}
