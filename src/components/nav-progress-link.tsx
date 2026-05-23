"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavProgressLinkProps = {
  href: string;
  isActive: boolean;
  isPending?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
};

export function NavProgressLink({
  href,
  isActive,
  isPending = false,
  onClick,
  children,
}: NavProgressLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border px-4 py-3 text-sm transition",
        isActive
          ? "border-sky-400/40 bg-sky-400/15 text-white"
          : "border-slate-800/80 bg-slate-950/50 text-slate-300 hover:border-sky-400/30 hover:bg-slate-950/80 hover:text-white",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 rounded-[inherit] bg-sky-400/15 transition-transform duration-500 ease-out",
          isPending ? "w-full scale-x-100" : "w-full scale-x-0",
        )}
        style={{ transformOrigin: "left center" }}
      />
      <span
        className={cn(
          "relative z-10 transition-colors duration-300",
          isPending && !isActive ? "text-white" : undefined,
        )}
      >
        {children}
      </span>
    </Link>
  );
}
