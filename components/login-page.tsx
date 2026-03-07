"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(false);

    if (!response.ok) {
      setMessage(result.message || "Login failed.");
      if (result.verificationRequired) {
        router.push("/register");
      }
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <AuthShell
      title="Login to QuickHire"
      subtitle="Access the admin dashboard with the same cookie-based authentication flow used in lets-connect."
      footerText="Need an account?"
      footerLink="/register"
      footerLabel="Register"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" className="h-12 w-full rounded-xl border border-border px-4 outline-none" required />
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="h-12 w-full rounded-xl border border-border px-4 outline-none" required />
        <button className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white">
          {loading ? "Logging in..." : "Login"}
        </button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </form>
    </AuthShell>
  );
}
