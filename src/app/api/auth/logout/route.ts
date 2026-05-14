import { NextResponse } from "next/server";
import { SESSION_COOKIE, getSessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/login", request.url), 303);
  res.cookies.set(SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
  return res;
}
