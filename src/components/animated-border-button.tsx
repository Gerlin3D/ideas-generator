"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimatedBorderButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  borderActive?: boolean;
  children: ReactNode;
  innerClassName?: string;
};

export function AnimatedBorderButton({
  borderActive = false,
  children,
  className,
  disabled,
  innerClassName,
  type = "button",
  ...props
}: AnimatedBorderButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex overflow-hidden rounded-full p-px transition disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          borderActive
            ? "animate-[spin_2.2s_linear_infinite] bg-[conic-gradient(from_0deg,rgba(56,189,248,0)_0deg,rgba(56,189,248,0)_220deg,rgba(56,189,248,0.95)_300deg,rgba(125,211,252,1)_332deg,rgba(56,189,248,0)_360deg)] opacity-100"
            : "bg-sky-400 opacity-100 group-hover:bg-sky-300",
        )}
      />
      <span
        className={cn(
          "relative z-10 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition",
          borderActive
            ? "bg-slate-950 text-sky-50"
            : "bg-sky-400 text-slate-950 group-hover:bg-sky-300",
          innerClassName,
        )}
      >
        {children}
      </span>
    </button>
  );
}
