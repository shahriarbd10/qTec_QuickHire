import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { issueEmailVerificationOtp } from "@/lib/server-email-verification";
import { formatRetryAfter, hashPassword } from "@/lib/server-auth";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, email, password, company } = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      company?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectToDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.emailVerifiedAt) {
        return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
      }

      existing.name = name.trim();
      existing.company = company?.trim() || "";
      existing.passwordHash = await hashPassword(password);

      const verificationResult = await issueEmailVerificationOtp(existing);
      if (!verificationResult.ok) {
        return NextResponse.json({ message: verificationResult.message }, { status: 429 });
      }

      return NextResponse.json({
        verificationRequired: true,
        email: existing.email,
        expiresInSeconds: verificationResult.expiresInSeconds,
        resendAttemptsRemaining: verificationResult.resendAttemptsRemaining,
        resendWindowRemainingMs: verificationResult.resendWindowRemainingMs,
        resendCooldownSeconds: verificationResult.resendCooldownSeconds,
        message: `A verification code has been sent to your email. You can resend after 2 minutes. Resends left: ${verificationResult.resendAttemptsRemaining}. Window resets in ${formatRetryAfter(verificationResult.resendWindowRemainingMs)}.`,
      });
    }

    const user = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      company: company?.trim() || "",
      passwordHash: await hashPassword(password),
    });

    const verificationResult = await issueEmailVerificationOtp(user);
    if (!verificationResult.ok) {
      return NextResponse.json({ message: verificationResult.message }, { status: 429 });
    }

    return NextResponse.json(
      {
        verificationRequired: true,
        email: user.email,
        expiresInSeconds: verificationResult.expiresInSeconds,
        resendAttemptsRemaining: verificationResult.resendAttemptsRemaining,
        resendWindowRemainingMs: verificationResult.resendWindowRemainingMs,
        resendCooldownSeconds: verificationResult.resendCooldownSeconds,
        message: `A verification code has been sent to your email. You can resend after 2 minutes. Resends left: ${verificationResult.resendAttemptsRemaining}. Window resets in ${formatRetryAfter(verificationResult.resendWindowRemainingMs)}.`,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registration failed." },
      { status: 500 },
    );
  }
}
