import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

function redirectToLogin(request: NextRequest, pathname: string) {
  const login = new URL("/login", request.url);
  login.searchParams.set(
    "from",
    `${pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(login);
}

function redirectForbidden(request: NextRequest) {
  const home = new URL("/", request.url);
  home.searchParams.set("forbidden", "1");
  return NextResponse.redirect(home);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isGestione =
    pathname === "/gestione" || pathname.startsWith("/gestione/");
  const isRedazione =
    pathname === "/redazione" || pathname.startsWith("/redazione/");
  const isDecapAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isGestione) {
    if (!session) return redirectToLogin(request, pathname);
    if (session.role !== "OWNER") return redirectForbidden(request);
    return NextResponse.next();
  }

  if (isRedazione || isDecapAdmin) {
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
    "/admin",
    "/admin/:path*",
  ],
};
