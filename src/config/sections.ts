export const POST_SECTIONS = ["Economia", "Cultura", "Cucina"] as const;

export type PostSection = (typeof POST_SECTIONS)[number];

export const SECTION_NAV = POST_SECTIONS.map((id) => ({
  id,
  label: id,
  icon: `/brand/sections/${id.toLowerCase()}.png`,
}));
