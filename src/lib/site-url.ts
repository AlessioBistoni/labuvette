import "server-only";

export function getSiteUrl(): URL {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return new URL(configured);

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelDomain) return new URL(`https://${vercelDomain}`);

  return new URL("http://localhost:3000");
}
