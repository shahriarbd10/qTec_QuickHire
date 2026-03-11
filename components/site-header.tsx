"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { PendingLink } from "@/components/ui/pending-link";
import { LogoMark } from "@/components/ui/logo-mark";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="container-shell py-4 lg:py-0">
      <div className="flex items-center justify-between lg:h-[78px]">
        <div className="flex items-center gap-12 lg:gap-12">
          <PendingLink href="/" className="flex items-center gap-2 font-semibold text-ink">
            <LogoMark />
          </PendingLink>
          <nav
            className="hidden items-center gap-12 text-[16px] font-medium leading-[1.6] tracking-normal text-[#515b6f] md:flex"
            style={{ fontFamily: '"Epilogue", sans-serif' }}
          >
            <Link href="/jobs">Find Jobs</Link>
            <a href="#companies">Browse Companies</a>
          </nav>
        </div>
        <div
          className="hidden items-center md:flex"
          style={{ fontFamily: '"Epilogue", sans-serif' }}
        >
          <Link
            href="/login"
            className="inline-flex h-[50px] items-center px-6 text-[16px] font-bold leading-[1.6] tracking-normal text-brand"
          >
            Login
          </Link>
          <span className="mx-3 h-12 w-px bg-[#d6ddeb]" />
          <Link
            href="/register"
            className="inline-flex h-[50px] items-center justify-center rounded-[4px] bg-brand px-8 text-[16px] font-bold leading-[1.6] tracking-normal text-white"
          >
            Sign Up
          </Link>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink md:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <span className="flex w-4 flex-col items-start justify-center gap-[3px]">
              <span className="block h-[2.5px] w-4 rounded-full bg-[#6f7687]" />
              <span className="block h-[2.5px] w-4 rounded-full bg-[#6f7687]" />
              <span className="block h-[2.5px] w-2 rounded-full bg-[#6f7687]" />
            </span>
          )}
        </button>
      </div>
      {menuOpen ? (
        <div className="mt-4 rounded-2xl border border-border bg-white p-4 shadow-card md:hidden">
          <nav className="flex flex-col gap-4 text-[15px] font-medium text-ink">
            <Link href="/jobs" onClick={() => setMenuOpen(false)}>
              Find Jobs
            </Link>
            <a href="#companies" onClick={() => setMenuOpen(false)}>
              Browse Companies
            </a>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit rounded-sm bg-brand px-5 py-3 text-white"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
