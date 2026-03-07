import { NextResponse } from "next/server";
import {
  getSessionCookieMaxAgeSeconds,
  getSessionCookieName,
  getSessionCookieOptions,
  hashEmailVerificationOtp,
  signSession,
} from "@/lib/server-auth";
import { connectToDatabase } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/server-email";
import { sanitizeUser } from "@/lib/server-users";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, otp } = (await request.json()) as { email?: string; otp?: string };
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and verification code are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!/^\d{6}$/.test(normalizedOtp)) {
      return NextResponse.json({ message: "Enter a valid 6-digit verification code." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "Account not found for this email." }, { status: 404 });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ message: "This email is already verified." }, { status: 400 });
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
      return NextResponse.json({ message: "Request a new verification code and try again." }, { status: 400 });
    }

    if (user.emailVerificationOtpExpiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ message: "This verification code has expired. Request a new code." }, { status: 400 });
    }

    if (user.emailVerificationOtpHash !== hashEmailVerificationOtp(normalizedOtp)) {
      return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
    }

    user.emailVerifiedAt = new Date();
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpiresAt = null;
    await user.save();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      await sendWelcomeEmail(user.email, user.name, `${appUrl}/admin`);
    } catch {}

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
      { message: error instanceof Error ? error.message : "Unable to verify email." },
      { status: 500 },
    );
  }
}
