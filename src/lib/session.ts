import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "labuvette_session";

const SESSION_DURATION = "7d";

const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-min-32-chars!!";

export type AdminRoleClaim = "OWNER" | "ADMIN";

export type SessionPayload = {
  sub: string;
  username: string;
  name: string;
  role: AdminRoleClaim;
};

export function hasProductionAuthConfig(): boolean {
  const s = process.env.AUTH_SECRET;
  return Boolean(s && s.length >= 32);
}

function resolveSecretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return null;
}

function parseRole(value: unknown): AdminRoleClaim {
  return value === "OWNER" ? "OWNER" : "ADMIN";
}

export async function createSessionToken(
  session: SessionPayload,
): Promise<string | null> {
  const key = resolveSecretKey();
  if (!key) return null;
  return new SignJWT({
    username: session.username,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(key);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  const key = resolveSecretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    const sub = payload.sub;
    if (typeof sub !== "string" || !sub) return null;
    const username = payload.username;
    const name = payload.name;
    if (typeof username !== "string" || typeof name !== "string") return null;
    return {
      sub,
      username,
      name,
      role: parseRole(payload.role),
    };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
