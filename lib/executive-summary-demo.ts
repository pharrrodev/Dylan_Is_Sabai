import { formatGbp } from "@/lib/mtd-demo";

/** UK personal allowance (demo static; not tax advice). */
export const PERSONAL_ALLOWANCE = 12_570;

/** Bare-bones MVP demo figures for Executive Summary (replace with live data later). */
export const executiveDemo = {
  incomeYtd: 54_000,
  expensesYtd: 18_000,
  taxEstimateRate: 0.26,
  ledgerActionsLogged: 5,
} as const;

export function totalProfit(): number {
  return (
    Math.round(
      (executiveDemo.incomeYtd - executiveDemo.expensesYtd) * 100
    ) / 100
  );
}

export function estimatedTax(): number {
  const p = totalProfit();
  if (p <= 0) return 0;
  return Math.round(p * executiveDemo.taxEstimateRate * 100) / 100;
}

/** Progress toward personal allowance (0–1) using income YTD as proxy. */
export function allowanceProgress(): number {
  if (PERSONAL_ALLOWANCE <= 0) return 0;
  return Math.min(1, executiveDemo.incomeYtd / PERSONAL_ALLOWANCE);
}

export function allowanceUsedDisplay(): string {
  const used = Math.min(executiveDemo.incomeYtd, PERSONAL_ALLOWANCE);
  return formatGbp(used);
}

export function allowanceCapDisplay(): string {
  return formatGbp(PERSONAL_ALLOWANCE);
}
