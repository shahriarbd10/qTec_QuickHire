import { NextResponse } from "next/server";
import {
  hashEmailVerificationOtp,
  hashPassword,
  verifyPassword,
} from "@/lib/server-auth";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/server-users";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { currentPassword, otp, newPassword } = (await request.json()) as {
      currentPassword?: string;
      otp?: string;
      newPassword?: string;
    };

    if (!currentPassword || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Current password, 6-digit code, and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 });
    }

    const normalizedOtp = otp.trim();
    if (!/^\d{6}$/.test(normalizedOtp)) {
      return NextResponse.json({ message: "Enter a valid 6-digit code." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(String(sessionUser._id));
    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }

    const currentPasswordMatches = await verifyPassword(currentPassword, user.passwordHash);
    if (!currentPasswordMatches) {
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return NextResponse.json({ message: "Request a new password-change code and try again." }, { status: 400 });
    }

    if (user.passwordResetOtpExpiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ message: "This code has expired. Request a new one." }, { status: 400 });
    }

    if (user.passwordResetOtpHash !== hashEmailVerificationOtp(normalizedOtp)) {
      return NextResponse.json({ message: "Invalid change-password code." }, { status: 400 });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    user.passwordResetSentAt = null;
    user.set("passwordResetSendAttempts", []);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to change password." },
      { status: 500 },
    );
  }
}
