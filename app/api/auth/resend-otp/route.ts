import { NextResponse } from "next/server";
import { formatRetryAfter } from "@/lib/server-auth";
import { connectToDatabase } from "@/lib/db";
import { issueEmailVerificationOtp } from "@/lib/server-email-verification";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Account not found for this email." }, { status: 404 });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ message: "This email is already verified." }, { status: 400 });
    }

    const result = await issueEmailVerificationOtp(user, { enforceResendRules: true });
    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: 429 });
    }

    return NextResponse.json({
      message: `A new verification code has been sent to your email. Resends left: ${result.resendAttemptsRemaining}. Window resets in ${formatRetryAfter(result.resendWindowRemainingMs)}.`,
      resendAttemptsRemaining: result.resendAttemptsRemaining,
      resendWindowRemainingMs: result.resendWindowRemainingMs,
      resendCooldownSeconds: result.resendCooldownSeconds,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to resend OTP." },
      { status: 500 },
    );
  }
}
