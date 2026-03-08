"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";

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
    <main className="min-h-screen bg-surface px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto grid max-w-[1120px] gap-0 overflow-hidden rounded-[2rem] bg-white shadow-card lg:min-h-[720px] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-[#141b34] text-white lg:block">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(70,64,222,0.16),rgba(20,27,52,0))]" />
          <div className="pointer-events-none absolute -right-24 top-8 h-[520px] w-[480px] opacity-30">
            <div className="absolute left-12 top-0 h-[190px] w-[88px] rotate-[64deg] border-4 border-[#ccccf5]" />
            <div className="absolute left-20 top-28 h-[360px] w-[132px] rotate-[64deg] border-4 border-[#ccccf5]" />
            <div className="absolute left-[-12px] top-72 h-[340px] w-[124px] rotate-[64deg] border-4 border-[#ccccf5]" />
          </div>
          <div className="relative p-10 lg:p-11">
            <LogoMark src="/images/footer/logo.png" />
            <h1
              className="mt-10 max-w-[340px] text-[44px] font-semibold leading-[1.18] tracking-[0.028em]"
              style={{ fontFamily: '"Clash Display", sans-serif' }}
            >
              Secure access for job board admins
            </h1>
            <p
              className="mt-5 max-w-[360px] text-[17px] font-normal leading-[1.65] tracking-normal text-white/70"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Register, verify your email, and manage jobs securely inside QuickHire.
            </p>
          </div>
        </section>
        <section className="bg-white p-6 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[15px] font-semibold leading-[1.6] tracking-normal text-brand"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <h2
            className="mt-6 text-[36px] font-semibold leading-[1.14] tracking-[0.028em] text-ink sm:text-[44px]"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            {title}
          </h2>
          <p
            className="mt-4 max-w-[540px] text-[16px] font-normal leading-[1.65] tracking-normal text-muted sm:text-[17px]"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {subtitle}
          </p>
          <div className="mt-7 sm:mt-8">{children}</div>
          <p
            className="mt-7 text-[15px] leading-[1.6] tracking-normal text-muted"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            {footerText}{" "}
            <Link
              href={footerLink}
              className="font-semibold text-brand"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              {footerLabel}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
