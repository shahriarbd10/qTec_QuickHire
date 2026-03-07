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
  "Human Resource": "/icons/categories/icon8.png",
};

const categoryColors: Record<JobCategory, string> = {
  Design: "#4f46e5",
  Sales: "#4f46e5",
  Marketing: "#4f46e5",
  Finance: "#4f46e5",
  Technology: "#4f46e5",
  Engineering: "#4f46e5",
  Business: "#4f46e5",
  "Human Resource": "#2b3654",
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
        "group border p-6 transition hover:-translate-y-1 hover:border-[var(--card-accent)] hover:bg-[var(--card-accent)] hover:shadow-card",
        highlighted
          ? "text-white"
          : "border-border bg-white hover:text-white",
      )}
    >
      <div className="relative h-10 w-10">
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
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-[1.05rem] font-medium tracking-[-0.015em]">{name}</h3>
          <p
            className={cn(
              "mt-2 text-[0.95rem] font-normal tracking-[-0.01em]",
              highlighted ? "text-white/80" : "text-muted group-hover:text-white/80",
            )}
          >
            {jobsAvailable} jobs available
          </p>
        </div>
        <ArrowRight
          className={cn(
            "h-4 w-4",
            highlighted ? "text-white" : "text-ink group-hover:text-white",
          )}
        />
      </div>
    </div>
  );
}
