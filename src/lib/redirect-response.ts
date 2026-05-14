import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Origine pubblica vista dal browser (tunnel Cloudflare, Vercel, locale). */
export function getPublicOrigin(request: NextRequest | Request): string {
  const headers = request.headers;
  const forwardedHost = headers.get("x-forwarded-host");
  const forwardedProto = headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]!.trim();
    const proto =
      forwardedProto?.split(",")[0]?.trim() ??
      (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }

  const host = headers.get("host");
  if (host) {
    const proto =
      forwardedProto?.split(",")[0]?.trim() ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

export function redirectToPath(
  request: NextRequest | Request,
  path: string,
  status = 303,
) {
  return NextResponse.redirect(new URL(path, getPublicOrigin(request)), status);
}
