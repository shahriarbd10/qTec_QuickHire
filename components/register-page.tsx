"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";

async function fileToDataUri(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function RegisterPage() {
  const router = useRouter();
  const [otpStep, setOtpStep] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [companyLogoDataUri, setCompanyLogoDataUri] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingLogo, setReadingLogo] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email, password, companyLogoDataUri }),
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
          <div className="rounded-2xl border border-border bg-white px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
                  {companyLogoDataUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={companyLogoDataUri} alt="Company logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-epilogue text-xs font-semibold text-muted">Logo</span>
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-semibold leading-[1.4] tracking-normal text-ink" style={{ fontFamily: '"Epilogue", sans-serif' }}>
                    Company logo (optional)
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.5] tracking-normal text-muted" style={{ fontFamily: '"Epilogue", sans-serif' }}>
                    You can change it later in the dashboard settings.
                  </p>
                </div>
              </div>

              <label
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-border bg-white px-4 py-2 text-[14px] font-semibold leading-[1.6] tracking-normal text-ink transition hover:bg-surface"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={loading || readingLogo}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    event.currentTarget.value = "";
                    if (!file) return;

                    setReadingLogo(true);
                    try {
                      const dataUri = await fileToDataUri(file);
                      setCompanyLogoDataUri(dataUri);
                    } catch (readError) {
                      setMessage(readError instanceof Error ? readError.message : "Could not read the selected file.");
                    } finally {
                      setReadingLogo(false);
                    }
                  }}
                />
                {readingLogo ? "Reading..." : companyLogoDataUri ? "Change logo" : "Upload logo"}
              </label>
            </div>
            {companyLogoDataUri ? (
              <button
                type="button"
                onClick={() => setCompanyLogoDataUri("")}
                className="mt-3 text-[14px] font-semibold leading-[1.6] tracking-normal text-brand"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                Remove logo
              </button>
            ) : null}
          </div>
          <button
            disabled={loading}
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
