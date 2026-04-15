"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Executive Summary" },
  { href: "/ledger", label: "Ledger" },
  { href: "/hmrc-auth", label: "HMRC Auth" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-col gap-[1.4rem]"
      aria-label="Primary"
    >
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "catalog-label relative block px-4 py-3 text-[#ffffff] transition-colors hover:text-[#e9c349]",
              active
                ? "smoky-glass text-[#e9c349] shadow-[inset_0.5px_0_0_0_#e9c349]"
                : ""
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
