import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashEmailVerificationOtp, hashPassword } from "@/lib/server-auth";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = (await request.json()) as {
      email?: string;
      otp?: string;
      password?: string;
    };

    if (!email || !otp || !password) {
      return NextResponse.json(
        { message: "Email, reset code, and new password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!/^\d{6}$/.test(normalizedOtp)) {
      return NextResponse.json({ message: "Enter a valid 6-digit reset code." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "Invalid reset request." }, { status: 400 });
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return NextResponse.json({ message: "Request a new reset code and try again." }, { status: 400 });
    }

    if (user.passwordResetOtpExpiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ message: "This reset code has expired. Request a new one." }, { status: 400 });
    }

    if (user.passwordResetOtpHash !== hashEmailVerificationOtp(normalizedOtp)) {
      return NextResponse.json({ message: "Invalid reset code." }, { status: 400 });
    }

    user.passwordHash = await hashPassword(password);
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    user.passwordResetSentAt = null;
    user.set("passwordResetSendAttempts", []);
    await user.save();

    return NextResponse.json({ message: "Password reset successful. You can log in now." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to reset password." },
      { status: 500 },
    );
  }
}
