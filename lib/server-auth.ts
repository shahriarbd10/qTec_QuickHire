// Copyright (c) Shahriar Hossain. All rights reserved. Contact: shahriarsgr@gmail.com
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "quickhire_session";
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  email: string;
};

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "quickhire-dev-secret";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifySession(token: string) {
  return jwt.verify(token, getJwtSecret()) as SessionPayload;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  } as const;
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionCookieMaxAgeSeconds() {
  return Math.floor(COOKIE_MAX_AGE_MS / 1000);
}

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 2;
const EMAIL_VERIFICATION_LIMIT_WINDOW_MS = 1000 * 60 * 60 * 2;

export function createEmailVerificationOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashEmailVerificationOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function createEmailVerificationExpiry() {
  return new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
}

export function getEmailVerificationExpirySeconds() {
  return Math.floor(EMAIL_VERIFICATION_TTL_MS / 1000);
}

export function pruneEmailVerificationAttempts(value: unknown) {
  const cutoff = Date.now() - EMAIL_VERIFICATION_LIMIT_WINDOW_MS;

  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (item instanceof Date ? item : new Date(String(item))))
    .filter((item) => !Number.isNaN(item.getTime()) && item.getTime() > cutoff);
}

export function formatRetryAfter(ms: number) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", !hours && !minutes ? `${seconds}s` : ""]
    .filter(Boolean)
    .join(" ");
}
