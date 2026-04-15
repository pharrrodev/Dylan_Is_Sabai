import { ExecutiveSummary } from "@/components/intelligence-command/executive-summary";

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  await searchParams;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#0E0E0E]">
      <header className="shrink-0 bg-[#1B1B1B] px-4 py-2 sm:px-6 sm:py-3">
        <p className="catalog-label text-[#e9c349]">Executive cockpit</p>
        <p className="mt-0.5 font-sans text-[10px] text-[#8a8a8a] sm:text-xs">
          Live totals and threshold — no scroll.
        </p>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
        <ExecutiveSummary />
      </main>
    </div>
  );
}
