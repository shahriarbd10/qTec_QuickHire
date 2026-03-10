import { NextResponse } from "next/server";
import { ensureCompanyForAdmin } from "@/lib/data";
import { connectToDatabase } from "@/lib/db";
import { issueEmailVerificationOtp } from "@/lib/server-email-verification";
import { formatRetryAfter, hashPassword } from "@/lib/server-auth";
import { uploadCompanyLogoToCloudinary } from "@/lib/server-cloudinary";
import { UserModel } from "@/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, email, password, company, companyLogoDataUri } = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      company?: string;
      companyLogoDataUri?: string;
    };

    if (!name || !email || !password || !company) {
      return NextResponse.json(
        { message: "Name, company, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectToDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const companyName = company.trim();
    const logoDataUri = typeof companyLogoDataUri === "string" ? companyLogoDataUri.trim() : "";
    if (logoDataUri && !logoDataUri.startsWith("data:image/")) {
      return NextResponse.json({ message: "Invalid company logo format." }, { status: 400 });
    }
    const uploadedLogo = logoDataUri ? await uploadCompanyLogoToCloudinary(logoDataUri) : null;
    const companyRecord = await ensureCompanyForAdmin({
      companyName,
      ...(uploadedLogo
        ? {
            logoUrl: uploadedLogo.secure_url,
            logoPublicId: uploadedLogo.public_id,
          }
        : {}),
    });
    const existing = await UserModel.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.emailVerifiedAt) {
        return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
      }

      existing.name = name.trim();
      existing.set("companyId", companyRecord._id);
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
      companyId: companyRecord._id as never,
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
