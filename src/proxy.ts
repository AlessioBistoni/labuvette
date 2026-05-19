import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redirectToPath } from "@/lib/redirect-response";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

function redirectToLogin(request: NextRequest, pathname: string) {
  const from = `${pathname}${request.nextUrl.search}`;
  const qs = new URLSearchParams({ from });
  return redirectToPath(request, `/login?${qs.toString()}`);
}

function redirectForbidden(request: NextRequest) {
  return redirectToPath(request, "/?forbidden=1");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isGestione =
    pathname === "/gestione" || pathname.startsWith("/gestione/");
  const isRedazione =
    pathname === "/redazione" || pathname.startsWith("/redazione/");

  if (isGestione) {
    if (!session) return redirectToLogin(request, pathname);
    if (session.role !== "OWNER") return redirectForbidden(request);
    return NextResponse.next();
  }

  if (isRedazione) {
    if (!session) return redirectToLogin(request, pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/gestione",
    "/gestione/:path*",
    "/redazione",
    "/redazione/:path*",
  ],
};
