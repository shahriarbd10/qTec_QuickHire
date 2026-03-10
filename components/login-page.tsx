"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";

export function LoginPage() {
  const router = useRouter();
  const [forgotMode, setForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(result.message || "Login failed.");
      if (result.verificationRequired) {
        router.push("/register");
      }
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    setLoading(false);
    setMessage(result.message || "If an account exists, a reset code has been sent.");
    setResetStep(true);
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password: newPassword }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.message || "Could not reset password.");
      return;
    }

    setMessage(result.message);
    setForgotMode(false);
    setResetStep(false);
    setOtp("");
    setNewPassword("");
    setPassword("");
  }

  return (
    <AuthShell
      title={forgotMode ? "Reset your password" : "Login to QuickHire"}
      subtitle={
        forgotMode
          ? resetStep
            ? "Enter the 6-digit reset code from your email and choose a new password."
            : "Request a 6-digit reset code to recover your QuickHire admin account."
          : "Access the QuickHire admin dashboard to manage jobs, applications, and uploads."
      }
      footerText="Need an account?"
      footerLink="/register"
      footerLabel="Register"
    >
      {forgotMode ? (
        <form className="space-y-4" onSubmit={resetStep ? handleResetPassword : handleForgotPassword}>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email address"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
          {resetStep ? (
            <>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="6-digit reset code"
                className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
                required
              />
              <input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                placeholder="New password"
                className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
                required
              />
            </>
          ) : null}
          <button
            className="h-14 w-full rounded-2xl bg-brand text-[16px] font-bold leading-[1.6] tracking-normal text-white"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {loading
              ? resetStep
                ? "Resetting..."
                : "Sending..."
              : resetStep
                ? "Reset password"
                : "Send reset code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotMode(false);
              setResetStep(false);
              setOtp("");
              setNewPassword("");
              setMessage(null);
            }}
            className="text-[15px] font-semibold leading-[1.6] tracking-normal text-brand"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            Back to login
          </button>
          {message ? (
            <p
              className="text-[15px] leading-[1.6] tracking-normal text-muted"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              {message}
            </p>
          ) : null}
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email address"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setForgotMode(true);
                setResetStep(false);
                setMessage(null);
              }}
              className="text-[15px] font-semibold leading-[1.6] tracking-normal text-brand"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Forgot password?
            </button>
          </div>
          <button
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-brand text-[16px] font-bold leading-[1.6] tracking-normal text-white"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
          {message ? (
            <p
              className="text-[15px] leading-[1.6] tracking-normal text-muted"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              {message}
            </p>
          ) : null}
        </form>
      )}
    </AuthShell>
  );
}
