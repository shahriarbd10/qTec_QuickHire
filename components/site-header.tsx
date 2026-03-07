import Link from "next/link";
import { Menu } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";

export function SiteHeader() {
  return (
    <header className="container-shell flex items-center justify-between py-6">
      <div className="flex items-center gap-12 md:gap-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <LogoMark />
        </Link>
        <nav className="hidden items-center gap-6 text-[14px] tracking-[-0.01em] text-ink/80 md:flex">
          <Link href="/jobs">Find Jobs</Link>
          <a href="#companies">Browse Companies</a>
        </nav>
      </div>
      <div className="hidden items-center md:flex">
        <Link href="/login" className="pr-7 text-[14px] font-semibold tracking-[-0.01em] text-brand">
          Login
        </Link>
        <span className="mr-5 h-8 w-px bg-[#d9dbe5]" />
        <Link
          href="/register"
          className="rounded-sm bg-brand px-5 py-3 text-[14px] font-semibold tracking-[-0.01em] text-white"
        >
          Sign Up
        </Link>
      </div>
      <button
        type="button"
        aria-label="Open menu"
        className="rounded-full border border-border p-2 text-ink md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}
