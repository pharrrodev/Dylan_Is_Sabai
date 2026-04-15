import { SidebarNav } from "@/components/intelligence-command/sidebar-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-[#0E0E0E] text-[#FFFFFF]">
      {/*
        No-Line (design.md §2): no border-r — separation from main is tonal only.
        Sidebar: surface_container_low (#1b1b1b). Brand slab: surface_container_lowest (#0e0e0e).
        Token 16 / 5.5rem negative space replaces horizontal rules before nav.
      */}
      <aside
        className="flex h-full min-h-0 w-60 shrink-0 flex-col overflow-hidden bg-[#1B1B1B] py-8"
        aria-label="Command navigation"
      >
        <div className="bg-[#0E0E0E] px-4 py-6">
          <p className="catalog-label text-[#e9c349]">Dylan Is Sabai</p>
          <p className="catalog-label mt-3 text-[#c6c6c6]">LaaS</p>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-0 pt-[5.5rem]">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
