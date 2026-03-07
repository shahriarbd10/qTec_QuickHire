import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

export function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LogoMark />
            </Link>
            <p className="max-w-xs text-sm leading-7 text-white/65">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/72">
            <h3 className="font-semibold text-white">About</h3>
            <p>Companies</p>
            <p>Pricing</p>
            <p>Terms</p>
            <p>Advice</p>
            <p>Privacy Policy</p>
          </div>
          <div className="space-y-3 text-sm text-white/72">
            <h3 className="font-semibold text-white">Resources</h3>
            <p>Help Docs</p>
            <p>Guide</p>
            <p>Updates</p>
            <p>Contact Us</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Get job notifications</h3>
            <p className="max-w-xs text-sm leading-7 text-white/65">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="h-11 flex-1 border border-white/10 bg-white px-4 text-sm text-ink outline-none"
                placeholder="Email Address"
              />
              <button className="h-11 bg-brand px-6 text-sm font-semibold text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>2021 @ QuickHire. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
              <span
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
