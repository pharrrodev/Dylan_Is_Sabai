"use client";

import {
  Landmark,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Executive Summary", icon: LayoutDashboard },
  { href: "/ledger", label: "Ledger", icon: Receipt },
  { href: "/hmrc-auth", label: "HMRC Auth", icon: Landmark },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 px-2" aria-label="Primary">
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 font-sans text-sm font-medium uppercase tracking-tight transition-colors duration-200",
              active
                ? "scale-[0.98] border-r-2 border-[#e0ccab] bg-[#2a2a2a] text-[#e0ccab]"
                : "text-[#a0a0a0] hover:bg-[#2a2a2a]"
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.35} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
