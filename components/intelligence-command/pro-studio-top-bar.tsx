"use client";

import { Bell, Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

type ProStudioTopBarProps = {
  title: string;
  breadcrumb?: ReactNode;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

export function ProStudioTopBar({
  title,
  breadcrumb,
  showSearch = false,
  searchQuery = "",
  onSearchChange,
}: ProStudioTopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#4D4635]/15 bg-[#131313]/80 px-4 backdrop-blur-xl shadow-[0_48px_48px_rgba(224,204,171,0.06)] sm:px-8">
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        {breadcrumb ?? (
          <h1 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#d0c5af]">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        {showSearch ? (
          <div className="relative hidden max-w-[12rem] items-center border-b border-[#4D4635]/30 bg-[#0E0E0E] px-3 py-2 sm:flex md:max-w-[16rem]">
            <Search
              className="mr-2 size-4 shrink-0 text-[#99907c]"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="SEARCH TRANSACTIONS…"
              className="w-full min-w-0 border-0 bg-transparent font-sans text-[10px] font-semibold uppercase tracking-widest text-[#e5e2e1] outline-none placeholder:text-[#99907c]/50"
              aria-label="Search transactions"
            />
          </div>
        ) : null}
        <div className="flex items-center gap-3 text-[#d0c5af]">
          <button
            type="button"
            className="p-1 transition-opacity hover:text-[#e0ccab]"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            className="hidden p-1 transition-opacity hover:text-[#e0ccab] sm:block"
            aria-label="Preferences"
          >
            <SlidersHorizontal className="size-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>
  );
}
