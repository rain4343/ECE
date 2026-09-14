import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { USER_ROLES } from "../../../src/lib/rbac";

const COOKIE_NAME = "un_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  role: string;
  homeKindergartenId: string | null;
  assignedKindergartenIds: string[];
  educationDirectorateId: string | null;
  exp: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters");
  }
  return value;
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSession(payload: Omit<SessionPayload, "exp">) {
  const body = encode(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  );
  return `${body}.${signature(body)}`;
}

export function readSession(value: string | undefined): SessionPayload | undefined {
  if (!value) return undefined;
  const [body, provided] = value.split(".");
  if (!body || !provided) return undefined;
  const expected = signature(body);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  try {
    const payload = JSON.parse(decode(body)) as SessionPayload;
    if (!payload.sub || !USER_ROLES.includes(payload.role as (typeof USER_ROLES)[number]) || payload.exp < Math.floor(Date.now() / 1000)) return undefined;
    return payload;
  } catch {
    return undefined;
  }
}

export function sessionCookie(value: string, secure: boolean) {
  return `${COOKIE_NAME}=${value}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function clearSessionCookie(secure: boolean) {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, expectedHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function parseCookie(header: string | undefined, name: string) {
  return header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export type { SessionPayload };
