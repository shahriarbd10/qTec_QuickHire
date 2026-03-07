import { NextResponse } from "next/server";
import {
  getSessionCookieMaxAgeSeconds,
  getSessionCookieName,
  getSessionCookieOptions,
  signSession,
  verifyPassword,
} from "@/lib/server-auth";
import { connectToDatabase } from "@/lib/db";
import { sanitizeUser } from "@/lib/server-users";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          message: "Please verify your email with the 6-digit code before logging in.",
          verificationRequired: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = signSession({ userId: String(user._id), email: user.email });
    const response = NextResponse.json({ user: sanitizeUser(user.toObject()) });
    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      ...getSessionCookieOptions(),
      maxAge: getSessionCookieMaxAgeSeconds(),
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed." },
      { status: 500 },
    );
  }
}
