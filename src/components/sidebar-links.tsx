"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavProgressLink } from "@/components/nav-progress-link";

type NavItem = {
  href: string;
  label: string;
};

type SidebarNavProps = {
  items: NavItem[];
};

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <nav className="mt-8 grid gap-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const isPending = pendingHref === item.href && !isActive;

        return (
          <NavProgressLink
            key={item.href}
            href={item.href}
            isActive={isActive}
            isPending={isPending}
            onClick={(event) => {
              if (
                isActive ||
                event.defaultPrevented ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }

              setPendingHref(item.href);
            }}
          >
            {item.label}
          </NavProgressLink>
        );
      })}
    </nav>
  );
}
