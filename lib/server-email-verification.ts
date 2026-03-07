import {
  createEmailVerificationExpiry,
  createEmailVerificationOtp,
  formatRetryAfter,
  getEmailVerificationExpirySeconds,
  hashEmailVerificationOtp,
  pruneEmailVerificationAttempts,
} from "@/lib/server-auth";
import { sendEmailVerificationOtpEmail } from "@/lib/server-email";

type VerificationUser = {
  name: string;
  email: string;
  emailVerificationOtpHash?: string | null;
  emailVerificationOtpExpiresAt?: Date | null;
  emailVerificationSentAt?: Date | null;
  emailVerificationSendAttempts?: unknown;
  save: () => Promise<unknown>;
};

const OTP_RESEND_COOLDOWN_MS = 1000 * 60 * 2;
const OTP_RESEND_WINDOW_MS = 1000 * 60 * 60 * 2;
const OTP_MAX_RESENDS_IN_WINDOW = 5;

export async function issueEmailVerificationOtp(
  user: VerificationUser,
  options: { enforceResendRules?: boolean } = {},
) {
  const attempts = pruneEmailVerificationAttempts(user.emailVerificationSendAttempts);
  const resendAttemptsUsed = Math.max(0, attempts.length - 1);
  const resendAttemptsRemaining = Math.max(0, OTP_MAX_RESENDS_IN_WINDOW - resendAttemptsUsed);
  const oldest = attempts[0];
  const resendWindowRemainingMs = oldest
    ? Math.max(0, oldest.getTime() + OTP_RESEND_WINDOW_MS - Date.now())
    : 0;
  const lastSentAt = user.emailVerificationSentAt ? new Date(user.emailVerificationSentAt).getTime() : 0;
  const cooldownRemainingMs = Math.max(0, lastSentAt + OTP_RESEND_COOLDOWN_MS - Date.now());

  if (options.enforceResendRules && cooldownRemainingMs > 0) {
    return {
      ok: false as const,
      message: `Please wait ${formatRetryAfter(cooldownRemainingMs)} before resending OTP. Resends left: ${resendAttemptsRemaining}. Window resets in ${formatRetryAfter(resendWindowRemainingMs)}.`,
      resendAttemptsRemaining,
      resendWindowRemainingMs,
    };
  }

  if (options.enforceResendRules && resendAttemptsRemaining <= 0) {
    return {
      ok: false as const,
      message: `OTP limit exceeded. Try after ${formatRetryAfter(resendWindowRemainingMs)}.`,
      resendAttemptsRemaining: 0,
      resendWindowRemainingMs,
    };
  }

  const otp = createEmailVerificationOtp();
  user.emailVerificationOtpHash = hashEmailVerificationOtp(otp);
  user.emailVerificationOtpExpiresAt = createEmailVerificationExpiry();
  user.emailVerificationSentAt = new Date();
  user.emailVerificationSendAttempts = [...attempts, new Date()];
  const updatedAttempts = pruneEmailVerificationAttempts(user.emailVerificationSendAttempts);
  await user.save();
  await sendEmailVerificationOtpEmail(user.email, user.name, otp);

  return {
    ok: true as const,
    expiresInSeconds: getEmailVerificationExpirySeconds(),
    resendAttemptsRemaining: Math.max(0, OTP_MAX_RESENDS_IN_WINDOW - Math.max(0, updatedAttempts.length - 1)),
    resendWindowRemainingMs,
    resendCooldownSeconds: Math.floor(OTP_RESEND_COOLDOWN_MS / 1000),
  };
}
