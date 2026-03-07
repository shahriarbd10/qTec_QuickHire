"use client";

import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLabel,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLabel: string;
}) {
  return (
    <main className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-white shadow-card lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden rounded-l-[2rem] bg-night p-10 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">QuickHire</p>
          <h1 className="mt-6 max-w-sm text-5xl font-bold leading-tight tracking-[-0.05em]">
            Secure access for job board admins
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-white/70">
            Register, verify your email, and manage jobs with the same OTP and session architecture used in your lets-connect project.
          </p>
        </section>
        <section className="p-6 sm:p-10">
          <Link href="/" className="text-sm font-semibold text-brand">
            ← Back to home
          </Link>
          <h2 className="mt-8 text-4xl font-bold tracking-[-0.04em] text-ink">{title}</h2>
          <p className="mt-3 max-w-xl text-base leading-8 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-muted">
            {footerText}{" "}
            <Link href={footerLink} className="font-semibold text-brand">
              {footerLabel}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
