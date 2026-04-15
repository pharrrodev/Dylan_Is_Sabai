import { LedgerWorkspace } from "@/components/ledger/ledger-workspace";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LedgerPage({ searchParams }: PageProps) {
  await searchParams;

  return <LedgerWorkspace />;
}
