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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2a3548]/50 bg-[#0f1218]/90 px-4 backdrop-blur-xl shadow-[0_48px_48px_rgba(91,141,239,0.06)] sm:px-8">
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        {breadcrumb ?? (
          <h1 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#8fa3c4]">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        {showSearch ? (
          <div className="relative hidden max-w-[12rem] items-center border-b border-[#2a3548]/60 bg-[#0a0c10] px-3 py-2 sm:flex md:max-w-[16rem]">
            <Search
              className="mr-2 size-4 shrink-0 text-[#6b7c99]"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="SEARCH TRANSACTIONS…"
              className="w-full min-w-0 border-0 bg-transparent font-sans text-[10px] font-semibold uppercase tracking-widest text-[#e8eefc] outline-none placeholder:text-[#6b7c99]/50"
              aria-label="Search transactions"
            />
          </div>
        ) : null}
        <div className="flex items-center gap-3 text-[#8fa3c4]">
          <button
            type="button"
            className="p-1 transition-opacity hover:text-[#5b8def]"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            className="hidden p-1 transition-opacity hover:text-[#5b8def] sm:block"
            aria-label="Preferences"
          >
            <SlidersHorizontal className="size-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>
  );
}
