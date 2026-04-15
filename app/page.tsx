import { cookies } from "next/headers";

import { ExecutiveSummary } from "@/components/intelligence-command/executive-summary";
import { ProStudioTopBar } from "@/components/intelligence-command/pro-studio-top-bar";

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  await searchParams;

  const jar = await cookies();
  const hmrcConnected = jar.get("hmrc_demo_connected")?.value === "1";

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden overscroll-none bg-[#0f1218]">
      <ProStudioTopBar
        title="Executive"
        breadcrumb={
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-[#6b7c99]">
            Summary / <span className="font-bold text-[#5b8def]">Executive</span>
          </p>
        }
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ExecutiveSummary hmrcConnected={hmrcConnected} />
      </main>
    </div>
  );
}
