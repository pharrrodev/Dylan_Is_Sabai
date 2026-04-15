import {
  Banknote,
  ChevronRight,
  Lock,
  Shield,
  TreePine,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import {
  allowanceCapDisplay,
  allowanceProgress,
  estimatedTax,
  executiveDemo,
  totalProfit,
} from "@/lib/executive-summary-demo";
import { formatGbp, taxVaultReserve } from "@/lib/mtd-demo";

function splitGbpDisplay(amount: number): { main: string; frac: string } {
  const full = formatGbp(amount);
  const i = full.lastIndexOf(".");
  if (i === -1) return { main: full, frac: "" };
  return { main: full.slice(0, i), frac: full.slice(i) };
}

export function ExecutiveSummary() {
  const income = executiveDemo.incomeYtd;
  const expenses = executiveDemo.expensesYtd;
  const profit = totalProfit();
  const estTax = estimatedTax();
  const vault = taxVaultReserve();
  const progress = allowanceProgress();
  const { main: profitMain, frac: profitFrac } = splitGbpDisplay(profit);

  const marginPct =
    income > 0 ? ((profit / income) * 100).toFixed(1) : "0.0";
  const burnPct =
    income > 0 ? ((expenses / income) * 100).toFixed(1) : "0.0";
  const vaultFill = income > 0 ? Math.min(100, (vault / income) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-10 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-8 sm:py-8 md:gap-12 md:py-10">
      <section className="flex flex-col items-end justify-between gap-6 md:flex-row">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e0ccab]">
            Consolidated performance
          </span>
          <h1 className="font-sans text-5xl font-extrabold leading-none tracking-[-0.04em] text-[#e5e2e1] sm:text-7xl md:text-8xl">
            {profitMain}
            <span className="text-[#e0ccab]">{profitFrac}</span>
          </h1>
          <div className="flex items-center gap-2 pt-2 font-sans text-xs font-bold uppercase tracking-widest text-[#e0ccab]">
            <TrendingUp className="size-4 shrink-0" strokeWidth={1.5} />
            <span>Total profit • rolling demo</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#d0c5af]">
            Performance index
          </span>
          <div className="flex h-12 items-end gap-1">
            {[4, 6, 10, 8, 12, 5].map((h, i) => (
              <div
                key={i}
                className={`w-1 ${
                  i >= 2 && i <= 4 ? "bg-[#e0ccab]" : "bg-[#4d4635]/25"
                }`}
                style={{ height: `${h * 8}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-card-pro flex min-h-[200px] flex-col justify-between p-6 sm:p-8 md:min-h-[220px]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d0c5af]">
                Gross income
              </span>
              <div className="font-sans text-2xl font-bold tracking-tight text-[#e5e2e1] sm:text-3xl">
                {formatGbp(income)}
              </div>
            </div>
            <Banknote className="size-8 text-[#e0ccab]/40" strokeWidth={1.25} />
          </div>
          <div className="mt-6 border-t border-[#4d4635]/10 pt-6">
            <div className="flex justify-between font-sans text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-[#d0c5af]">Margin</span>
              <span className="text-[#e0ccab]">+{marginPct}%</span>
            </div>
            <div className="relative mt-2 h-1 w-full overflow-hidden bg-[#353534]">
              <div
                className="absolute inset-y-0 left-0 bg-[#e0ccab]"
                style={{ width: `${Math.min(100, Math.max(0, Number(marginPct)))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card-pro flex min-h-[200px] flex-col justify-between p-6 sm:p-8 md:min-h-[220px]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d0c5af]">
                Operating expenses
              </span>
              <div className="font-sans text-2xl font-bold tracking-tight text-[#e5e2e1] sm:text-3xl">
                {formatGbp(expenses)}
              </div>
            </div>
            <TreePine className="size-8 text-[#ffb4ab]/50" strokeWidth={1.25} />
          </div>
          <div className="mt-6 border-t border-[#4d4635]/10 pt-6">
            <div className="flex justify-between font-sans text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-[#d0c5af]">Of income</span>
              <span className="text-[#ffb4ab]">{burnPct}%</span>
            </div>
            <div className="relative mt-2 h-1 w-full overflow-hidden bg-[#353534]">
              <div
                className="absolute inset-y-0 left-0 bg-[#ffb4ab]"
                style={{ width: `${Math.min(100, Number(burnPct))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card-pro flex min-h-[200px] flex-col justify-between p-6 sm:p-8 md:min-h-[220px]">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d0c5af]">
                Tax vault reserve
              </span>
              <div className="font-sans text-2xl font-bold tracking-tight text-[#e5e2e1] sm:text-3xl">
                {formatGbp(vault)}
              </div>
            </div>
            <Shield className="size-8 text-[#bfcdff]/45" strokeWidth={1.25} />
          </div>
          <div className="mt-6 border-t border-[#4d4635]/10 pt-6">
            <div className="flex justify-between font-sans text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-[#d0c5af]">Est. slice ({Math.round(executiveDemo.taxEstimateRate * 100)}%)</span>
              <span className="text-[#bfcdff]">{formatGbp(estTax)}</span>
            </div>
            <div className="relative mt-2 h-1 w-full overflow-hidden bg-[#353534]">
              <div
                className="absolute inset-y-0 left-0 bg-[#bfcdff]"
                style={{ width: `${vaultFill}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.1em] text-[#e5e2e1]">
              Personal allowance (demo)
            </h3>
            <p className="font-sans text-xs font-light tracking-wide text-[#d0c5af]">
              Income toward allowance cap — {Math.round(progress * 100)}% used
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-sans text-2xl font-bold tracking-tight text-[#e0ccab]">
              {allowanceCapDisplay()}
            </span>
            <span className="mt-1 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#d0c5af]">
              Limit
            </span>
          </div>
        </div>
        <div className="relative h-0.5 w-full bg-[#353534]">
          <div
            className="absolute inset-y-0 left-0 bg-[#e0ccab] shadow-[0_0_8px_rgba(224,204,171,0.35)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between pt-1 font-sans text-[9px] uppercase tracking-[0.2em] text-[#99907c]">
          <span>Baseline</span>
          <span>Mid</span>
          <span>Cap</span>
          <span className="text-[#ffb4ab]">Over allowance</span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-2 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#d0c5af]">
              Recent ledger activity
            </span>
            <Link
              href="/ledger"
              className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-widest text-[#e0ccab] hover:opacity-80"
            >
              View full ledger
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
          <ActivityRow
            date="29 Mar"
            title="Beat sale — exclusive loop pack"
            meta="Income • Beat sale"
            amountDisplay={`+${formatGbp(200)}`}
            amountClass="text-[#e0ccab]"
            status="Settled"
          />
          <ActivityRow
            date="27 Mar"
            title="Plugin / VST"
            meta="Expense • Software"
            amountDisplay={`−${formatGbp(149)}`}
            amountClass="text-[#e5e2e1]"
            status="Pending"
          />
          <ActivityRow
            date="26 Mar"
            title="Royalties (streaming)"
            meta="Income • Streaming"
            amountDisplay={`+${formatGbp(412.6)}`}
            amountClass="text-[#e0ccab]"
            status="Settled"
          />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="glass-card-pro relative overflow-hidden border-l border-[#e0ccab]/20 bg-[#1c1b1b]/50 p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 bg-[#e0ccab]/5 blur-3xl" />
            <div className="relative z-[1] space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-[#e0ccab]" strokeWidth={1.25} />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5e2e1]">
                  Spendable cash vault
                </span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#d0c5af]">
                Reserve model holds{" "}
                <span className="font-bold text-[#e0ccab]">
                  {Math.round(executiveDemo.taxEstimateRate * 100)}%
                </span>{" "}
                toward HMRC-ready totals. Ledger logs feed this view on deploy.
              </p>
              <div className="pt-2">
                <Link
                  href="/ledger"
                  className="inline-block border border-[#e0ccab]/20 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-[#e0ccab] transition-colors duration-300 hover:bg-[#e0ccab] hover:text-[#3a2f18]"
                >
                  Open ledger
                </Link>
              </div>
            </div>
          </div>

          <div className="border border-[#4d4635]/15 bg-[#0e0e0e] p-6">
            <h4 className="mb-5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5e2e1]">
              Regional revenue (illustrative)
            </h4>
            <div className="space-y-4">
              <RegionBar label="UK & EU" pct={65} tone="primary" />
              <RegionBar label="North America" pct={22} tone="container" />
              <RegionBar label="Rest of world" pct={13} tone="outline" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityRow({
  date,
  title,
  meta,
  amountDisplay,
  amountClass,
  status,
}: {
  date: string;
  title: string;
  meta: string;
  amountDisplay: string;
  amountClass: string;
  status: string;
}) {
  return (
    <div className="group flex flex-col gap-2 p-4 transition-colors duration-200 hover:bg-[#2a2a2a] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <span className="w-16 shrink-0 font-sans text-[10px] font-medium uppercase tracking-tighter text-[#99907c]">
          {date}
        </span>
        <div>
          <div className="font-sans text-sm font-semibold tracking-tight text-[#e5e2e1]">
            {title}
          </div>
          <div className="font-sans text-[10px] font-medium uppercase tracking-widest text-[#d0c5af]">
            {meta}
          </div>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <div className={`font-sans text-sm font-bold tabular-nums ${amountClass}`}>
          {amountDisplay}
        </div>
        <div className="mt-1 flex items-center justify-start gap-1 font-sans text-[10px] font-medium uppercase tracking-widest text-[#bfcdff] sm:justify-end">
          <span className="size-1 shrink-0 bg-[#bfcdff]" aria-hidden />
          {status}
        </div>
      </div>
    </div>
  );
}

function RegionBar({
  label,
  pct,
  tone,
}: {
  label: string;
  pct: number;
  tone: "primary" | "container" | "outline";
}) {
  const bar =
    tone === "primary"
      ? "bg-[#e0ccab]"
      : tone === "container"
        ? "bg-[#c3b191]"
        : "bg-[#4d4635]";
  const text =
    tone === "primary"
      ? "text-[#e0ccab]"
      : tone === "container"
        ? "text-[#c3b191]"
        : "text-[#99907c]";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 font-sans text-[10px] font-medium uppercase tracking-widest text-[#d0c5af]">
        {label}
      </div>
      <div className="relative h-1 w-24 bg-[#353534]">
        <div className={`absolute inset-y-0 left-0 ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={`w-8 text-right font-sans text-[10px] font-bold ${text}`}>
        {pct}%
      </div>
    </div>
  );
}
