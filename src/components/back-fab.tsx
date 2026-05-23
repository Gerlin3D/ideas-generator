"use client";

import { useRouter } from "next/navigation";

type BackFabProps = {
  fallbackHref?: string;
};

export function BackFab({ fallbackHref = "/ideas" }: BackFabProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(fallbackHref);
      }}
      className="group fixed bottom-8 left-1/2 z-40 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-sky-400/20 bg-slate-950/50 text-sky-100 shadow-[0_18px_45px_rgba(2,6,23,0.5)] backdrop-blur opacity-50 transition hover:border-sky-300/70 hover:bg-slate-900 hover:text-white "
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_62%)] opacity-70 transition group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 h-5 w-5 transition duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      >
        <path d="M14.5 5.5L8 12l6.5 6.5" />
        <path d="M13 12h7" />
      </svg>
    </button>
  );
}
