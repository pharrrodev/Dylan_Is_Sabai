import { LedgerCockpit } from "@/components/ledger/ledger-cockpit";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LedgerPage({ searchParams }: PageProps) {
  await searchParams;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#0E0E0E]">
      <header className="shrink-0 bg-[#1B1B1B] px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="editorial-headline text-xl font-semibold text-[#FFFFFF] sm:text-2xl">
          Ledger
        </h1>
        <p className="mt-1 max-w-2xl font-sans text-xs leading-snug text-[#c6c6c6] sm:text-sm">
          Recent log and add entry — proof, categories, and live totals. No-line
          cockpit.
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3">
        <LedgerCockpit />
      </main>
    </div>
  );
}
