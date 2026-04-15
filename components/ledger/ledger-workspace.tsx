"use client";

import { useState } from "react";

import { ProStudioTopBar } from "@/components/intelligence-command/pro-studio-top-bar";
import { LedgerCockpit } from "@/components/ledger/ledger-cockpit";

export function LedgerWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#131313]">
      <ProStudioTopBar
        title="Ledger"
        breadcrumb={
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-[#a0a0a0]">
            Studio / <span className="font-bold text-[#e0ccab]">Ledger</span>
          </p>
        }
        showSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6">
        <LedgerCockpit searchFilter={searchQuery} />
      </main>
    </div>
  );
}
