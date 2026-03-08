import {
  createEmailVerificationOtp,
  formatRetryAfter,
  hashEmailVerificationOtp,
  pruneEmailVerificationAttempts,
} from "@/lib/server-auth";
import { sendPasswordResetOtpEmail } from "@/lib/server-email";

const PASSWORD_RESET_TTL_MS = 1000 * 60 * 10;
const PASSWORD_RESET_COOLDOWN_MS = 1000 * 60 * 2;
const PASSWORD_RESET_WINDOW_MS = 1000 * 60 * 60 * 2;
const PASSWORD_RESET_MAX_RESENDS_IN_WINDOW = 5;

type PasswordResetUser = {
  name: string;
  email: string;
  passwordResetOtpHash?: string | null;
  passwordResetOtpExpiresAt?: Date | null;
  passwordResetSentAt?: Date | null;
  passwordResetSendAttempts?: unknown;
  save: () => Promise<unknown>;
};

export async function issuePasswordResetOtp(
  user: PasswordResetUser,
  options: { enforceResendRules?: boolean } = {},
) {
  const attempts = pruneEmailVerificationAttempts(user.passwordResetSendAttempts);
  const resendAttemptsUsed = Math.max(0, attempts.length - 1);
  const resendAttemptsRemaining = Math.max(
    0,
    PASSWORD_RESET_MAX_RESENDS_IN_WINDOW - resendAttemptsUsed,
  );
  const oldest = attempts[0];
  const resendWindowRemainingMs = oldest
    ? Math.max(0, oldest.getTime() + PASSWORD_RESET_WINDOW_MS - Date.now())
    : 0;
  const lastSentAt = user.passwordResetSentAt ? new Date(user.passwordResetSentAt).getTime() : 0;
  const cooldownRemainingMs = Math.max(0, lastSentAt + PASSWORD_RESET_COOLDOWN_MS - Date.now());

  if (options.enforceResendRules && cooldownRemainingMs > 0) {
    return {
      ok: false as const,
      message: `Please wait ${formatRetryAfter(cooldownRemainingMs)} before requesting another reset code.`,
      resendAttemptsRemaining,
      resendWindowRemainingMs,
    };
  }

  if (options.enforceResendRules && resendAttemptsRemaining <= 0) {
    return {
      ok: false as const,
      message: `Reset code limit exceeded. Try after ${formatRetryAfter(resendWindowRemainingMs)}.`,
      resendAttemptsRemaining: 0,
      resendWindowRemainingMs,
    };
  }

  const otp = createEmailVerificationOtp();
  user.passwordResetOtpHash = hashEmailVerificationOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
  user.passwordResetSentAt = new Date();
  user.passwordResetSendAttempts = [...attempts, new Date()];
  const updatedAttempts = pruneEmailVerificationAttempts(user.passwordResetSendAttempts);
  await user.save();
  await sendPasswordResetOtpEmail(user.email, user.name, otp);

  return {
    ok: true as const,
    expiresInSeconds: Math.floor(PASSWORD_RESET_TTL_MS / 1000),
    resendAttemptsRemaining: Math.max(
      0,
      PASSWORD_RESET_MAX_RESENDS_IN_WINDOW - Math.max(0, updatedAttempts.length - 1),
    ),
    resendWindowRemainingMs,
    resendCooldownSeconds: Math.floor(PASSWORD_RESET_COOLDOWN_MS / 1000),
  };
}
