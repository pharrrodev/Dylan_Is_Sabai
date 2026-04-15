import Link from "next/link";

import { SidebarNav } from "@/components/intelligence-command/sidebar-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-[#131313] text-[#e5e2e1]">
      <aside
        className="flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-[#4D4635]/15 bg-[#1c1b1b]"
        aria-label="Pro-Studio navigation"
      >
        <div className="px-6 py-8">
          <p className="font-sans text-xl font-bold tracking-[-0.02em] text-[#e0ccab]">
            PRO-STUDIO
          </p>
          <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#99907c]">
            Dylan Is Sabai
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          <SidebarNav />
        </div>
        <div className="mt-auto border-t border-[#4D4635]/10 p-6">
          <Link
            href="/ledger"
            className="flex w-full items-center justify-center bg-[#e0ccab] py-3 font-sans text-xs font-bold uppercase tracking-widest text-[#3a2f18] transition-opacity hover:opacity-90"
          >
            Add entry
          </Link>
        </div>
      </aside>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
