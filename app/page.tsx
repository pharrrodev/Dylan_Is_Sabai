import { ExecutiveSummary } from "@/components/intelligence-command/executive-summary";
import { ProStudioTopBar } from "@/components/intelligence-command/pro-studio-top-bar";

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  await searchParams;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#131313]">
      <ProStudioTopBar
        title="Executive"
        breadcrumb={
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-[#a0a0a0]">
            Summary / <span className="font-bold text-[#e0ccab]">Executive</span>
          </p>
        }
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ExecutiveSummary />
      </main>
    </div>
  );
}
