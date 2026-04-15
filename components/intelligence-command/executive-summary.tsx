import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  allowanceCapDisplay,
  allowanceProgress,
  allowanceUsedDisplay,
  estimatedTax,
  executiveDemo,
  totalProfit,
} from "@/lib/executive-summary-demo";
import { formatGbp } from "@/lib/mtd-demo";

const taxPct = Math.round(executiveDemo.taxEstimateRate * 100);

export function ExecutiveSummary() {
  const income = executiveDemo.incomeYtd;
  const expenses = executiveDemo.expensesYtd;
  const profit = totalProfit();
  const estTax = estimatedTax();
  const progress = allowanceProgress();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden sm:gap-4">
      <h1 className="editorial-serif-headline shrink-0 text-center text-lg uppercase tracking-[0.12em] text-[#e9c349] sm:text-xl md:text-2xl">
        Executive Summary
      </h1>

      <div className="grid min-h-0 shrink-0 grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        <SummaryCard
          label="Income"
          value={formatGbp(income)}
          icon={<ArrowUpRight className="size-5 text-[#4ade80]" strokeWidth={1.5} />}
          tone="neutral"
        />
        <SummaryCard
          label="Expenses"
          value={formatGbp(expenses)}
          icon={<ArrowDownRight className="size-5 text-[#f87171]" strokeWidth={1.5} />}
          tone="neutral"
        />
        <SummaryCard
          label="Total Profit"
          value={formatGbp(profit)}
          icon={<ArrowRight className="size-5 text-[#e9c349]" strokeWidth={1.5} />}
          tone="neutral"
        />
        <SummaryCard
          label={`Est. Tax (${taxPct}%)`}
          value={formatGbp(estTax)}
          icon={<Calendar className="size-5 text-[#e9c349]" strokeWidth={1.5} />}
          tone="tax"
          subline={
            profit <= 0
              ? "No profit generated"
              : "Reserve held toward your slice"
          }
        />
      </div>

      <section
        className="shrink-0 px-1"
        aria-labelledby="threshold-label"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p
            id="threshold-label"
            className="catalog-label text-[#e9c349]"
          >
            Tax-Free Threshold Status
          </p>
          <p className="font-sans text-xs tabular-nums text-[#e9c349] sm:text-sm">
            {allowanceUsedDisplay()} / {allowanceCapDisplay()}
          </p>
        </div>
        <div
          className="h-2 w-full bg-[#1B1B1B] shadow-[inset_0_0_0_0.5px_rgba(233,195,73,0.12)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-labelledby="threshold-label"
        >
          <div
            className="h-full bg-[#e9c349] shadow-[0_0_12px_rgba(233,195,73,0.45)] transition-[width] duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden lg:grid-cols-2 lg:gap-3">
        <section className="interactive-smoky-card flex min-h-0 flex-col p-4 sm:p-5">
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <FileText className="size-5 shrink-0 text-[#e9c349]" strokeWidth={1.25} />
              <h2 className="editorial-serif-headline text-base text-[#FFFFFF] sm:text-lg">
                Ledger Snapshot
              </h2>
            </div>
            <p className="mt-2 font-sans text-xs leading-relaxed text-[#c6c6c6] sm:text-sm">
              You have securely logged {executiveDemo.ledgerActionsLogged}{" "}
              financial actions. Open the Ledger to declare income and expenses
              with guided categories.
            </p>
            <Link
              href="/ledger"
              className="catalog-label mt-auto inline-flex w-fit px-4 py-2.5 text-[#e9c349] shadow-[0_0_0_0.5px_#e9c349] transition-colors hover:bg-[#e9c349]/10"
            >
              Access Ledger →
            </Link>
          </div>
        </section>

        <section className="hero-noir-card flex min-h-0 flex-col p-4 sm:p-5">
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <Target className="size-5 shrink-0 text-[#e9c349]" strokeWidth={1.25} />
              <h2 className="editorial-serif-headline text-base text-[#FFFFFF] sm:text-lg">
                Next Milestone
              </h2>
            </div>
            <p className="mt-2 font-sans text-xs leading-relaxed text-[#c6c6c6] sm:text-sm">
              Spendable Cash stays honest against your reserve. Connect HMRC
              sandbox next so pulses stay in sync with your compliance path.
            </p>
            <Link
              href="/hmrc-auth"
              className="catalog-label mt-auto inline-flex w-fit bg-gradient-to-r from-[#1a1208] to-[#e9c349] px-4 py-2.5 text-[#FFFFFF] shadow-[0_0_24px_rgba(233,195,73,0.25)] transition-opacity hover:opacity-90"
            >
              View Goals →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
  subline,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "neutral" | "tax";
  subline?: string;
}) {
  const glow =
    tone === "tax"
      ? "vault-glow-card shadow-[0_0_0_0.5px_rgba(233,195,73,0.45),0_0_40px_rgba(233,195,73,0.2)]"
      : "bg-[#141414] shadow-[inset_0_2px_0_0_rgba(233,195,73,0.35)]";

  return (
    <div className={`flex min-h-0 flex-col p-3 sm:p-4 ${glow}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="catalog-label text-[#c6c6c6]">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-sans text-xl font-semibold tabular-nums tracking-tight text-[#FFFFFF] sm:text-2xl">
        {value}
      </p>
      {subline ? (
        <p className="catalog-label mt-2 text-[#e9c349]">{subline}</p>
      ) : null}
    </div>
  );
}
