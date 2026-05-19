import { POST_SECTIONS, type PostSection } from "@/config/sections";

export function isPostSection(value: string | null | undefined): value is PostSection {
  if (!value) return false;
  return (POST_SECTIONS as readonly string[]).includes(value);
}

export function parsePostSection(
  raw: string | null | undefined,
): PostSection | null {
  const v = raw?.trim();
  return isPostSection(v) ? v : null;
}
