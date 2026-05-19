export const POST_SECTIONS = ["Economia", "Cultura", "Cucina"] as const;

export type PostSection = (typeof POST_SECTIONS)[number];

export const SECTION_NAV = [
  {
    id: "Economia" as const,
    label: "Economia",
    icon: "/brand/sections/economia.png",
  },
  {
    id: "Cultura" as const,
    label: "Cultura",
    icon: "/brand/sections/cultura.png",
  },
  {
    id: "Cucina" as const,
    label: "Cucina",
    icon: "/brand/sections/cucina.png",
  },
] as const;
