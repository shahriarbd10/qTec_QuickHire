"use client";

import { ComponentPropsWithoutRef, MouseEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PendingLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
  children: ReactNode;
  className?: string;
  pendingClassName?: string;
  spinnerClassName?: string;
  overlay?: boolean;
};

export function PendingLink({
  children,
  className,
  pendingClassName,
  spinnerClassName,
  overlay = false,
  onClick,
  href,
  ...props
}: PendingLinkProps) {
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [pathname]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    ) {
      return;
    }

    setIsPending(true);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={isPending}
      className={cn(
        "relative transition duration-200",
        isPending && "scale-[0.99]",
        className,
        isPending && pendingClassName,
      )}
      {...props}
    >
      {children}
      {isPending ? (
        overlay ? (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-white/72 backdrop-blur-[1px]">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-lg",
                spinnerClassName,
              )}
            >
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading
            </span>
          </span>
        ) : (
          <span
            className={cn(
              "pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg",
              spinnerClassName,
            )}
          >
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            Loading
          </span>
        )
      ) : null}
    </Link>
  );
}
