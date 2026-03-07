import { NextResponse } from "next/server";
import { getCurrentUser, sanitizeUser } from "@/lib/server-users";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({ user: sanitizeUser(user as Record<string, unknown>) });
}
