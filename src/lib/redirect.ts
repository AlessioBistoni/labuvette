/**
 * Reindirizzamento dopo login: solo path relativi interni.
 */
export function safeInternalPath(candidate: string | null | undefined): string {
  if (!candidate || !candidate.startsWith("/")) return "/";
  if (candidate.startsWith("//")) return "/";
  if (candidate.includes("://")) return "/";
  return candidate;
}
