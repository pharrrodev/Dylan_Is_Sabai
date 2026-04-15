import {
  Banknote,
  ChevronRight,
  Lock,
  Shield,
  TreePine,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { HmrcSubmitWorkflow } from "@/components/intelligence-command/hmrc-submit-workflow";
import { IncomeExpenseDonut } from "@/components/intelligence-command/income-expense-donut";
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

export function ExecutiveSummary({
  hmrcConnected = false,
}: {
  hmrcConnected?: boolean;
}) {
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
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col gap-2 overflow-hidden px-3 py-2 sm:gap-3 sm:px-5 sm:py-3">
      <section className="flex shrink-0 flex-col items-end justify-between gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 space-y-0.5">
          <span className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b8def]">
            Consolidated performance
          </span>
          <h1 className="font-heading text-[clamp(1.35rem,4.2vw,2.65rem)] font-extrabold leading-none tracking-[-0.04em] text-[#e8eefc]">
            {profitMain}
            <span className="text-[#5b8def]">{profitFrac}</span>
          </h1>
          <div className="flex items-center gap-1.5 pt-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-[#7aa3f7]">
            <TrendingUp className="size-3.5 shrink-0" strokeWidth={1.5} />
            <span>Total profit • demo</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="font-sans text-[9px] font-medium uppercase tracking-widest text-[#8fa3c4]">
            Index
          </span>
          <div className="flex h-8 items-end gap-0.5">
            {[4, 6, 10, 8, 12, 5].map((h, i) => (
              <div
                key={i}
                className={`w-0.5 ${
                  i >= 2 && i <= 4 ? "bg-[#5b8def]" : "bg-[#2a3548]/60"
                }`}
                style={{ height: `${h * 6}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="glass-card-pro flex flex-col justify-between p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8fa3c4]">
                Total income
              </span>
              <div className="truncate font-sans text-lg font-bold tabular-nums tracking-tight text-[#e8eefc] sm:text-xl">
                {formatGbp(income)}
              </div>
            </div>
            <Banknote className="size-6 shrink-0 text-[#5b8def]/45" strokeWidth={1.25} />
          </div>
          <div className="mt-2 border-t border-[#2a3548]/40 pt-2">
            <div className="flex justify-between font-sans text-[9px] font-semibold uppercase tracking-widest">
              <span className="text-[#8fa3c4]">Margin</span>
              <span className="text-[#5b8def]">+{marginPct}%</span>
            </div>
            <div className="relative mt-1 h-0.5 w-full overflow-hidden bg-[#2a3548]">
              <div
                className="absolute inset-y-0 left-0 bg-[#5b8def]"
                style={{ width: `${Math.min(100, Math.max(0, Number(marginPct)))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card-pro flex flex-col justify-between p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8fa3c4]">
                Operating expenses
              </span>
              <div className="truncate font-sans text-lg font-bold tabular-nums tracking-tight text-[#e8eefc] sm:text-xl">
                {formatGbp(expenses)}
              </div>
            </div>
            <TreePine className="size-6 shrink-0 text-[#fca5a5]/50" strokeWidth={1.25} />
          </div>
          <div className="mt-2 border-t border-[#2a3548]/40 pt-2">
            <div className="flex justify-between font-sans text-[9px] font-semibold uppercase tracking-widest">
              <span className="text-[#8fa3c4]">Of income</span>
              <span className="text-[#fca5a5]">{burnPct}%</span>
            </div>
            <div className="relative mt-1 h-0.5 w-full overflow-hidden bg-[#2a3548]">
              <div
                className="absolute inset-y-0 left-0 bg-[#fca5a5]"
                style={{ width: `${Math.min(100, Number(burnPct))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card-pro flex flex-col justify-between p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8fa3c4]">
                Tax vault reserve
              </span>
              <div className="truncate font-sans text-lg font-bold tabular-nums tracking-tight text-[#e8eefc] sm:text-xl">
                {formatGbp(vault)}
              </div>
            </div>
            <Shield className="size-6 shrink-0 text-[#7aa3f7]/50" strokeWidth={1.25} />
          </div>
          <div className="mt-2 border-t border-[#2a3548]/40 pt-2">
            <div className="flex justify-between font-sans text-[9px] font-semibold uppercase tracking-widest">
              <span className="text-[#8fa3c4]">
                Est. ({Math.round(executiveDemo.taxEstimateRate * 100)}%)
              </span>
              <span className="truncate text-[#7aa3f7]">{formatGbp(estTax)}</span>
            </div>
            <div className="relative mt-1 h-0.5 w-full overflow-hidden bg-[#2a3548]">
              <div
                className="absolute inset-y-0 left-0 bg-[#7aa3f7]"
                style={{ width: `${vaultFill}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-3">
        <div className="sm:col-span-5">
          <IncomeExpenseDonut
            income={income}
            expenses={expenses}
            netProfit={profit}
          />
        </div>
        <div className="flex flex-col justify-center sm:col-span-7">
          <HmrcSubmitWorkflow
            hmrcConnected={hmrcConnected}
            totalIncome={income}
            totalExpenses={expenses}
            netProfit={profit}
          />
        </div>
      </section>

      <section className="shrink-0 space-y-1.5">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-[#e8eefc]">
              Personal allowance (demo)
            </h3>
            <p className="line-clamp-1 font-sans text-[10px] font-light tracking-wide text-[#8fa3c4]">
              Toward cap — {Math.round(progress * 100)}% used
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <span className="font-sans text-lg font-bold tabular-nums tracking-tight text-[#5b8def] sm:text-xl">
              {allowanceCapDisplay()}
            </span>
            <span className="mt-0.5 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#8fa3c4]">
              Limit
            </span>
          </div>
        </div>
        <div className="relative h-0.5 w-full bg-[#2a3548]">
          <div
            className="absolute inset-y-0 left-0 bg-[#5b8def] shadow-[0_0_8px_rgba(91,141,239,0.35)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-sans text-[8px] uppercase tracking-[0.18em] text-[#6b7c99]">
          <span>Baseline</span>
          <span>Cap</span>
          <span className="text-[#fca5a5]">Over</span>
        </div>
      </section>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden lg:grid-cols-12 lg:gap-3">
        <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-8">
          <div className="mb-1 flex shrink-0 items-center justify-between gap-2 px-0.5">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8fa3c4]">
              Recent activity
            </span>
            <Link
              href="/ledger"
              className="flex shrink-0 items-center gap-0.5 font-sans text-[9px] font-bold uppercase tracking-widest text-[#5b8def] hover:opacity-80"
            >
              Ledger
              <ChevronRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-0.5 overflow-hidden">
            <ActivityRow
              date="29 Mar"
              title="Beat sale — exclusive loop pack"
              meta="Income • Beat sale"
              amountDisplay={`+${formatGbp(200)}`}
              amountClass="text-[#5b8def]"
              status="Settled"
            />
            <ActivityRow
              date="27 Mar"
              title="Plugin / VST"
              meta="Expense • Software"
              amountDisplay={`−${formatGbp(149)}`}
              amountClass="text-[#e8eefc]"
              status="Pending"
            />
            <ActivityRow
              date="26 Mar"
              title="Royalties (streaming)"
              meta="Income • Streaming"
              amountDisplay={`+${formatGbp(412.6)}`}
              amountClass="text-[#5b8def]"
              status="Settled"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-2 overflow-hidden lg:col-span-4">
          <div className="glass-card-pro relative min-h-0 flex-1 overflow-hidden border-l border-[#5b8def]/25 bg-[#121826]/60 p-3">
            <div className="pointer-events-none absolute -right-8 -top-8 size-24 bg-[#5b8def]/10 blur-2xl" />
            <div className="relative z-[1] flex h-full min-h-0 flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Lock className="size-4 shrink-0 text-[#5b8def]" strokeWidth={1.25} />
                <span className="font-heading text-[9px] font-bold uppercase tracking-[0.18em] text-[#e8eefc]">
                  Spendable vault
                </span>
              </div>
              <p className="line-clamp-3 font-sans text-[10px] leading-snug text-[#8fa3c4]">
                Reserve{" "}
                <span className="font-bold text-[#5b8def]">
                  {Math.round(executiveDemo.taxEstimateRate * 100)}%
                </span>{" "}
                toward HMRC-ready totals.
              </p>
              <Link
                href="/ledger"
                className="mt-auto inline-flex w-fit border border-[#5b8def]/35 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-widest text-[#5b8def] hover:bg-[#5b8def] hover:text-[#0a0c10]"
              >
                Open ledger
              </Link>
            </div>
          </div>

          <p className="shrink-0 font-sans text-[9px] leading-snug text-[#6b7c99]">
            <span className="font-semibold text-[#8fa3c4]">Regions (demo):</span>{" "}
            UK/EU 65% · North America 22% · Rest 13%
          </p>
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
    <div className="group flex min-h-0 shrink-0 items-center justify-between gap-2 px-1 py-1.5 transition-colors duration-200 hover:bg-[#2a2a2a]/80 sm:px-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <span className="w-11 shrink-0 font-sans text-[9px] font-medium uppercase tracking-tighter text-[#6b7c99]">
          {date}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-xs font-semibold tracking-tight text-[#e8eefc]">
            {title}
          </div>
          <div className="truncate font-sans text-[9px] font-medium uppercase tracking-widest text-[#8fa3c4]">
            {meta}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
        <div className={`font-sans text-xs font-bold tabular-nums ${amountClass}`}>
          {amountDisplay}
        </div>
        <div className="flex items-center gap-0.5 font-sans text-[8px] font-medium uppercase tracking-widest text-[#7aa3f7]">
          <span className="size-0.5 shrink-0 bg-[#7aa3f7]" aria-hidden />
          {status}
        </div>
      </div>
    </div>
  );
}
