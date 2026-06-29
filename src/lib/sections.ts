import { POST_SECTIONS, type PostSection } from "@/config/sections";

export function isPostSection(value: string | null | undefined): value is PostSection {
  if (!value) return false;
  return value.trim().length > 0;
}

export function parsePostSection(
  raw: string | null | undefined,
): PostSection | null {
  const v = raw?.trim();
  return isPostSection(v) ? v : null;
}

export function defaultPostSections(): string[] {
  return [...POST_SECTIONS];
}
