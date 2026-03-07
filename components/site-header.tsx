import Link from "next/link";
import { Menu } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";

export function SiteHeader() {
  return (
    <header className="container-shell flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
        <LogoMark />
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
        <Link href="/jobs">Find Jobs</Link>
        <a href="#companies">Browse Companies</a>
      </nav>
      <div className="hidden items-center gap-4 md:flex">
        <Link href="/login" className="text-sm font-semibold text-brand">
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-sm bg-brand px-5 py-3 text-sm font-semibold text-white"
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
