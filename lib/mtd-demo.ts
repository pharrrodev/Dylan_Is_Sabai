/**
 * Dummy ledger for the Intelligence Command shell.
 * Scenario: April 2026 UK MTD — creator income above £50k (higher-rate band in play);
 * platform holds a 26% reserve toward Income Tax + Class 4 NI (illustrative blended rate).
 */
export const mtdDemoLedger = {
  /** Categorized inflows YTD used for the reserve model (demo). */
  incomeYtd: 54_000,
  /** Reserve rate applied to inflows for the Tax Vault (demo). */
  taxVaultRate: 0.26,
} as const;

export function taxVaultReserve(): number {
  return Math.round(mtdDemoLedger.incomeYtd * mtdDemoLedger.taxVaultRate * 100) / 100;
}

export function spendableCash(): number {
  return Math.round((mtdDemoLedger.incomeYtd - taxVaultReserve()) * 100) / 100;
}

export function formatGbp(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
