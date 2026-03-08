import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";

const footerLinkClass =
  'text-[16px] font-normal leading-[1.6] tracking-normal text-[#d6ddeb]';

export function Footer() {
  return (
    <footer className="bg-[#202430] text-white">
      <div className="container-shell pt-16 lg:min-h-[497px] lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[376px_105px_97px_362px] lg:gap-[88px]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <LogoMark src="/images/footer/logo.png" />
            </Link>
            <p
              className="mt-8 max-w-[376px] text-[16px] font-normal leading-[1.6] tracking-normal text-[#d6ddeb]"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          <div>
            <h3
              className="text-[18px] font-semibold leading-[1.6] tracking-normal text-white"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              About
            </h3>
            <div
              className="mt-4 flex flex-col gap-4"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              <Link href="/jobs" className={footerLinkClass}>
                Companies
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Pricing
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Terms
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Advice
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Privacy Policy
              </Link>
            </div>
          </div>

          <div>
            <h3
              className="text-[18px] font-semibold leading-[1.6] tracking-normal text-white"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Resources
            </h3>
            <div
              className="mt-4 flex flex-col gap-4"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              <Link href="/jobs" className={footerLinkClass}>
                Help Docs
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Guide
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Updates
              </Link>
              <Link href="/jobs" className={footerLinkClass}>
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3
              className="text-[18px] font-semibold leading-[1.6] tracking-normal text-white"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              Get job notifications
            </h3>
            <p
              className="mt-4 max-w-[306px] text-[16px] font-normal leading-[1.6] tracking-normal text-[#d6ddeb]"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="mt-10 flex flex-col gap-2 sm:flex-row">
              <input
                className="h-[50px] w-full border border-[#d6ddeb] bg-white px-4 text-[16px] font-normal leading-[1.6] tracking-normal text-ink outline-none placeholder:text-[#a8adb7] sm:w-[223px]"
                placeholder="Email Address"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              />
              <button
                className="h-[50px] bg-brand px-6 text-[16px] font-bold leading-[1.6] tracking-normal text-white sm:w-[131px]"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t-2 border-white/10 pt-10 pb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p
              className="text-[16px] font-medium leading-[1.6] tracking-normal text-white/50"
              style={{ fontFamily: '"Epilogue", sans-serif' }}
            >
              2021 @ QuickHire. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
