import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendPasswordChangeOtpEmail } from "@/lib/server-email";
import { issuePasswordResetOtp } from "@/lib/server-password-reset";
import { getCurrentUser } from "@/lib/server-users";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(String(sessionUser._id));
    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }

    const result = await issuePasswordResetOtp(user, {
      enforceResendRules: true,
      sendEmail: sendPasswordChangeOtpEmail,
    });

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: 429 });
    }

    return NextResponse.json({
      message: "A 6-digit code has been sent to your email.",
      expiresInSeconds: result.expiresInSeconds,
      resendCooldownSeconds: result.resendCooldownSeconds,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to send change-password code." },
      { status: 500 },
    );
  }
}
