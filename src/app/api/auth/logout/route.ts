import { redirectToPath } from "@/lib/redirect-response";
import { SESSION_COOKIE, getSessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const res = redirectToPath(request, "/login");
  res.cookies.set(SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
  return res;
}
