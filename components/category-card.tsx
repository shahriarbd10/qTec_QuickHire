import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobCategory } from "@/lib/types";

const icons: Record<JobCategory, string> = {
  Design: "/icons/categories/icon1.png",
  Sales: "/icons/categories/icon2.png",
  Marketing: "/icons/categories/icon3.png",
  Finance: "/icons/categories/icon4.png",
  Technology: "/icons/categories/icon5.png",
  Engineering: "/icons/categories/icon6.png",
  Business: "/icons/categories/icon7.png",
  "Human Resource": "/icons/categories/Icon8.png",
};

const categoryColors: Record<JobCategory, string> = {
  Design: "#4f46e5",
  Sales: "#4f46e5",
  Marketing: "#4f46e5",
  Finance: "#4f46e5",
  Technology: "#4f46e5",
  Engineering: "#4f46e5",
  Business: "#4f46e5",
  "Human Resource": "#4f46e5",
};

export function CategoryCard({
  name,
  jobsAvailable,
  highlighted,
}: {
  name: JobCategory;
  jobsAvailable: number;
  highlighted?: boolean;
}) {
  const iconSrc = icons[name];
  const accentColor = categoryColors[name];

  return (
    <div
      style={{
        ["--card-accent" as string]: accentColor,
        backgroundColor: highlighted ? accentColor : undefined,
        borderColor: highlighted ? accentColor : undefined,
      }}
      className={cn(
        "group border p-4 transition hover:-translate-y-1 hover:border-[var(--card-accent)] hover:bg-[var(--card-accent)] hover:shadow-card sm:min-h-[214px] sm:p-8",
        highlighted
          ? "text-white"
          : "border-border bg-white hover:text-white",
      )}
    >
      <div className="flex items-center gap-4 sm:block">
        <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
          <Image
            src={iconSrc}
            alt={name}
            fill
            className={cn(
              "object-contain opacity-100",
              highlighted
                ? "brightness-0 invert"
                : "brightness-100 saturate-100 group-hover:brightness-0 group-hover:invert",
            )}
            sizes="40px"
          />
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 sm:mt-8 sm:block">
          <div>
            <h3 className="whitespace-nowrap text-[20px] font-semibold leading-[1.2] tracking-normal sm:text-[24px]">
              {name}
            </h3>
            <Link
              href={`/jobs?category=${encodeURIComponent(name)}`}
              className={cn(
                "mt-1.5 inline-flex items-center gap-3 rounded-full transition sm:mt-3",
                highlighted ? "text-white/80" : "text-muted group-hover:text-white/80",
              )}
            >
              <p
                className="text-[16px] font-normal leading-[1.6] tracking-normal sm:text-[18px]"
                style={{ fontFamily: '"Epilogue", sans-serif' }}
              >
                {jobsAvailable} jobs available
              </p>
              <ArrowRight
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1",
                  highlighted ? "text-white" : "text-ink group-hover:text-white",
                )}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
