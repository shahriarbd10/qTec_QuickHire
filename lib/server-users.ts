import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "@/lib/server-auth";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/user";
import { AuthUser } from "@/lib/types";

export function sanitizeUser(user: Record<string, unknown>): AuthUser {
  return {
    id: String(user._id || ""),
    name: String(user.name || ""),
    email: String(user.email || ""),
    role: (String(user.role || "user") as AuthUser["role"]),
    avatarUrl: String(user.avatarUrl || ""),
    company: String(user.company || ""),
    emailVerified: Boolean(user.emailVerifiedAt),
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;

  try {
    const session = verifySession(token);
    await connectToDatabase();
    return await UserModel.findById(session.userId).lean();
  } catch {
    return null;
  }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  return user ? sanitizeUser(user as Record<string, unknown>) : null;
}

export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return UserModel.findOne({ email: email.trim().toLowerCase() });
}
