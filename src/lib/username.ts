export function sanitizeUsername(raw: string): string | null {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/_+/g, "_")
    .replace(/^[-_]|[-_]$/g, "");
  if (s.length < 3 || s.length > 32) return null;
  return s;
}

export function usernameFromEmail(email: string): string {
  const local = email.includes("@") ? email.split("@")[0]! : email;
  return sanitizeUsername(local) ?? local.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);
}
