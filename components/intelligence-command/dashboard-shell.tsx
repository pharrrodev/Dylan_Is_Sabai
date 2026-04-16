import Link from "next/link";

import { SabaiGuardian } from "@/components/intelligence-command/sabai-guardian";
import { SidebarNav } from "@/components/intelligence-command/sidebar-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] min-h-0 w-full overflow-hidden overscroll-none bg-[#0a0c10] text-[#e8eefc]">
      <aside
        className="flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-[#2a3548]/50 bg-[#121826]"
        aria-label="SabaiTax UK navigation"
      >
        <div className="shrink-0 px-5 py-5 sm:px-6 sm:py-6">
          <p className="font-heading text-xl font-bold tracking-[-0.02em] text-[#5b8def]">
            SabaiTax UK
          </p>
          <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b7c99]">
            Intelligence command
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-2 pb-3">
          <SidebarNav />
        </div>
        <div className="mt-auto shrink-0 border-t border-[#2a3548]/40 p-4">
          <Link
            href="/ledger"
            className="flex min-h-11 w-full items-center justify-center bg-[#5b8def] py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-[#0a0c10] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
          >
            Add entry
          </Link>
        </div>
      </aside>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
      <SabaiGuardian />
    </div>
  );
}
