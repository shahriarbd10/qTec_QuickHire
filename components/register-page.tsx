"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";

export function RegisterPage() {
  const router = useRouter();
  const [otpStep, setOtpStep] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email, password }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.message || "Registration failed.");
      return;
    }

    setMessage(result.message);
    setOtpStep(true);
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.message || "Verification failed.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleResend() {
    setLoading(true);
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    setLoading(false);
    setMessage(result.message || "OTP resent.");
  }

  return (
    <AuthShell
      title={otpStep ? "Confirm your email" : "Create admin account"}
      subtitle={
        otpStep
          ? "Enter the 6-digit code sent to your email. Your account stays locked until verification is complete."
          : "Create the QuickHire admin account that will manage jobs, uploads, and applications."
      }
      footerText={otpStep ? "Already verified?" : "Already have an account?"}
      footerLink="/login"
      footerLabel="Login"
    >
      {otpStep ? (
        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            value={email}
            readOnly
            className="h-14 w-full rounded-2xl border border-border bg-surface px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          />
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="6-digit code"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
          <button
            className="h-14 w-full rounded-2xl bg-brand text-[16px] font-bold leading-[1.6] tracking-normal text-white"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="text-[15px] font-semibold leading-[1.6] tracking-normal text-brand"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            Resend code
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
        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Company name"
            className="h-14 w-full rounded-2xl border border-border px-5 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
            required
          />
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
          <button
            className="h-14 w-full rounded-2xl bg-brand text-[16px] font-bold leading-[1.6] tracking-normal text-white"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {loading ? "Creating..." : "Create account"}
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
