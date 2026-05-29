"use client";

export function ScrollTopFab() {
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => {
        const scrollContainer = document.querySelector<HTMLElement>(
          '[data-scroll-container="app-main"]',
        );

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className="group fixed bottom-8 left-1/2 z-40 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-sky-400/20 bg-slate-950/50 text-sky-100 shadow-[0_18px_45px_rgba(2,6,23,0.5)] backdrop-blur opacity-50 transition hover:border-sky-300/70 hover:bg-slate-900 hover:text-white"
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_62%)] opacity-70 transition group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 h-5 w-5 transition duration-200 group-hover:-translate-y-0.5"
        aria-hidden="true"
      >
        <path d="M12 18V7" />
        <path d="M6.5 12.5L12 7l5.5 5.5" />
      </svg>
    </button>
  );
}
