import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { issuePasswordResetOtp } from "@/lib/server-password-reset";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

const GENERIC_MESSAGE =
  "If an account exists for that email, a 6-digit reset code has been sent.";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    const result = await issuePasswordResetOtp(user, { enforceResendRules: true });
    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: 429 });
    }

    return NextResponse.json({
      message: GENERIC_MESSAGE,
      expiresInSeconds: result.expiresInSeconds,
      resendCooldownSeconds: result.resendCooldownSeconds,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to send reset code." },
      { status: 500 },
    );
  }
}
