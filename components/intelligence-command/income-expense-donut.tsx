import { formatGbp } from "@/lib/mtd-demo";

type IncomeExpenseDonutProps = {
  income: number;
  expenses: number;
  netProfit: number;
};

/** Compact income vs expense ring — no extra chart dependencies. */
export function IncomeExpenseDonut({ income, expenses, netProfit }: IncomeExpenseDonutProps) {
  const sum = income + expenses;
  const incomeAngle = sum > 0 ? (income / sum) * 360 : 180;
  const incomePct = sum > 0 ? Math.round((income / sum) * 100) : 0;
  const expensePct = sum > 0 ? 100 - incomePct : 0;

  return (
    <div
      className="flex items-center gap-4 border border-[#2a3548]/80 bg-[#0e1219]/90 px-4 py-3"
      role="img"
      aria-label={`Income versus expenses: income ${incomePct} percent, expenses ${expensePct} percent of combined flow.`}
    >
      <div
        className="relative size-[4.5rem] shrink-0"
        style={{
          background: `conic-gradient(from -90deg, #5b8def 0deg ${incomeAngle}deg, #f87171 ${incomeAngle}deg 360deg)`,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px))",
        }}
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-heading text-[9px] font-bold uppercase tracking-[0.14em] text-[#8fa3c4]">
          Flow split
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans text-[10px] tabular-nums text-[#e8eefc]">
          <span>
            <span className="text-[#5b8def]">In</span> {incomePct}%
          </span>
          <span>
            <span className="text-[#fca5a5]">Out</span> {expensePct}%
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden bg-[#2a3548]">
          <div
            className="absolute inset-y-0 left-0 bg-[#5b8def]"
            style={{ width: `${incomePct}%` }}
          />
          <div
            className="absolute inset-y-0 bg-[#f87171]"
            style={{ left: `${incomePct}%`, width: `${expensePct}%` }}
          />
        </div>
        <p className="font-sans text-xs font-semibold tabular-nums text-[#e8eefc]">
          Net <span className="text-[#5b8def]">{formatGbp(netProfit)}</span>
        </p>
      </div>
    </div>
  );
}
