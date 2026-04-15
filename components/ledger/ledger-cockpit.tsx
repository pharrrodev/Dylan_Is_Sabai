"use client";

import { Paperclip, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { formatGbp, spendableCash } from "@/lib/mtd-demo";

const DEMO_RECEIPT_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
      <rect fill="#141414" width="100%" height="100%"/>
      <rect fill="#e9c349" fill-opacity="0.08" x="24" y="24" width="312" height="172"/>
      <text x="32" y="56" fill="#e9c349" font-family="system-ui,sans-serif" font-size="11" letter-spacing="0.12em">ATTACHMENT</text>
      <text x="32" y="88" fill="#ffffff" font-family="system-ui,sans-serif" font-size="14">DIS — Receipt</text>
    </svg>`
  );

const INCOME_CATEGORIES = [
  { value: "beat_sale", label: "Beat Sale" },
  { value: "royalties_streaming", label: "Royalties (Streaming)" },
  { value: "live_fee", label: "Live Performance Fee" },
  { value: "teaching", label: "Teaching / Workshops" },
  { value: "merch", label: "Merchandise" },
  { value: "sync", label: "Sync / Placement" },
  { value: "other_income", label: "Other Income" },
] as const;

const EXPENSE_CATEGORIES = [
  { value: "studio_hire", label: "Studio Hire" },
  { value: "rehearsal", label: "Rehearsal Space" },
  { value: "mixing", label: "Mixing Engineer" },
  { value: "new_gear", label: "New Gear / Instrument" },
  { value: "cables", label: "Cables / Accessories" },
  { value: "plugin", label: "Plugin / VST" },
  { value: "daw_sub", label: "DAW Subscription" },
  { value: "travel", label: "Travel / Transport" },
  { value: "ads", label: "Facebook Ads / Marketing" },
  { value: "software", label: "Software / Subscriptions" },
  { value: "other_expense", label: "Other Expense" },
] as const;

const QUICK_CHIPS = [
  "Studio Session",
  "New Plugin",
  "Uber",
  "Facebook Ads",
] as const;

type AttachmentMeta = {
  kind: "image" | "pdf";
  url: string;
  name: string;
};

type LedgerKind = "income" | "expense";

type LedgerEntry = {
  id: string;
  description: string;
  amount: number;
  kind: LedgerKind;
  categoryLabel: string;
  dateIso: string;
  attachment?: AttachmentMeta;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const SEED_ENTRIES: LedgerEntry[] = [
  {
    id: "s1",
    description: "Studio Hire",
    amount: 50,
    kind: "expense",
    categoryLabel: "Studio Hire",
    dateIso: "2026-03-29",
    attachment: { kind: "image", url: DEMO_RECEIPT_SVG, name: "studio.pdf" },
  },
  {
    id: "s2",
    description: "Beat Sale — exclusive loop pack",
    amount: 200,
    kind: "income",
    categoryLabel: "Beat Sale",
    dateIso: "2026-03-28",
  },
  {
    id: "s3",
    description: "Plugin / VST",
    amount: 149,
    kind: "expense",
    categoryLabel: "Plugin / VST",
    dateIso: "2026-03-27",
  },
  {
    id: "s4",
    description: "Royalties (Streaming)",
    amount: 412.6,
    kind: "income",
    categoryLabel: "Royalties (Streaming)",
    dateIso: "2026-03-26",
  },
  {
    id: "s5",
    description: "Uber — late session",
    amount: 24.5,
    kind: "expense",
    categoryLabel: "Travel / Transport",
    dateIso: "2026-03-25",
  },
];

const ACCEPT =
  "image/jpeg,image/jpg,image/png,application/pdf,.pdf,.jpg,.jpeg,.png";

function parseAmount(raw: string): number | null {
  const n = Number.parseFloat(raw.replace(/,/g, "").trim());
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function formatLogDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LedgerCockpit() {
  const [entries, setEntries] = useState<LedgerEntry[]>(SEED_ENTRIES);
  const [kind, setKind] = useState<LedgerKind>("expense");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0].value);
  const [description, setDescription] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [dateInput, setDateInput] = useState(todayIso);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewEntry, setPreviewEntry] = useState<LedgerEntry | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<string[]>([]);

  const descId = useId();
  const amountId = useId();
  const dateId = useId();
  const catId = useId();

  const spendable = useMemo(() => formatGbp(spendableCash()), []);

  const netSigned = useMemo(() => {
    let t = 0;
    entries.forEach((e) => {
      t += e.kind === "income" ? e.amount : -e.amount;
    });
    return t;
  }, [entries]);

  const categoryOptions =
    kind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewEntry(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categoryLabelFor = (value: string) =>
    [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find((c) => c.value === value)
      ?.label ?? "General";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setPendingFile(null);
      return;
    }
    const lower = f.name.toLowerCase();
    const ok =
      f.type.startsWith("image/") ||
      f.type === "application/pdf" ||
      [".pdf", ".jpg", ".jpeg", ".png"].some((ext) => lower.endsWith(ext));
    if (!ok) {
      e.target.value = "";
      return;
    }
    setPendingFile(f);
    e.target.value = "";
  };

  const logEntry = () => {
    const amount = parseAmount(amountInput);
    if (amount === null || amount === 0) return;
    const desc = description.trim() || categoryLabelFor(category);

    let attachment: AttachmentMeta | undefined;
    if (pendingFile) {
      const isPdf =
        pendingFile.type === "application/pdf" ||
        pendingFile.name.toLowerCase().endsWith(".pdf");
      const url = URL.createObjectURL(pendingFile);
      blobUrlsRef.current.push(url);
      attachment = {
        kind: isPdf ? "pdf" : "image",
        url,
        name: pendingFile.name,
      };
    }

    const entry: LedgerEntry = {
      id: `e-${Date.now()}`,
      description: desc,
      amount,
      kind,
      categoryLabel: categoryLabelFor(category),
      dateIso: dateInput || todayIso(),
      attachment,
    };
    setEntries((prev) => [entry, ...prev]);
    setAmountInput("");
    setDescription("");
    setPendingFile(null);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const openPreview = (entry: LedgerEntry) => {
    if (!entry.attachment) return;
    setPreviewEntry(entry);
  };

  const applyChip = (text: string) => {
    setDescription(text);
  };

  const preview = previewEntry?.attachment;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden sm:gap-4">
      {/* Top stats — Pharrrolyfe rail */}
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:gap-4">
        <div className="vault-glow-pill bg-[#0E0E0E] px-4 py-3 text-center shadow-[inset_0_2px_0_0_rgba(233,195,73,0.55)]">
          <p className="catalog-label text-[#c6c6c6]">Running total</p>
          <p
            className={`mt-1 font-sans text-lg font-semibold tabular-nums sm:text-xl ${
              netSigned >= 0 ? "text-[#4ade80]" : "text-[#f87171]"
            }`}
          >
            {formatGbp(netSigned)}
          </p>
        </div>
        <div className="vault-glow-pill bg-[#0E0E0E] px-4 py-3 text-center shadow-[inset_0_2px_0_0_rgba(233,195,73,0.55)]">
          <p className="catalog-label text-[#c6c6c6]">Spendable Cash</p>
          <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-[#e9c349] sm:text-xl">
            {spendable}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-4 overflow-hidden lg:gap-6">
        {/* Recent Log */}
        <div className="col-span-12 flex min-h-0 flex-col lg:col-span-7">
          <div
            className="vault-glow-card flex min-h-0 flex-1 flex-col overflow-hidden bg-[#141414] shadow-[inset_0_2px_0_0_rgba(233,195,73,0.65)]"
          >
            <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
              <h2 className="editorial-serif-headline text-xl text-[#e9c349] sm:text-2xl">
                Recent Log
              </h2>
              <span className="catalog-label shadow-[0_0_0_0.5px_#e9c349] bg-transparent px-2 py-1 text-[#e9c349]">
                Live
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 sm:px-4">
              <ul className="flex flex-col gap-3">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <div className="flex flex-col gap-2 bg-[#0E0E0E] px-4 py-3 shadow-[inset_0_0_0_0.5px_rgba(233,195,73,0.12)] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-sm font-medium text-[#FFFFFF] sm:text-base">
                          {entry.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="font-sans text-xs text-[#c6c6c6]">
                            {formatLogDate(entry.dateIso)}
                          </span>
                          <span className="catalog-label shadow-[0_0_0_0.5px_#e9c349] px-2 py-0.5 text-[10px] text-[#e9c349] sm:text-xs">
                            {entry.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                        <span
                          className={`font-sans text-base font-semibold tabular-nums sm:text-lg ${
                            entry.kind === "income"
                              ? "text-[#4ade80]"
                              : "text-[#f87171]"
                          }`}
                        >
                          {entry.kind === "income" ? "+" : "−"}
                          {formatGbp(entry.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          {entry.attachment ? (
                            <button
                              type="button"
                              onClick={() => openPreview(entry)}
                              className="flex size-9 items-center justify-center text-[#e9c349] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]/40"
                              aria-label="View attachment"
                            >
                              <Paperclip className="size-4" strokeWidth={1.5} />
                            </button>
                          ) : (
                            <span className="size-9" aria-hidden />
                          )}
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.id)}
                            className="flex size-9 items-center justify-center text-[#c6c6c6] hover:text-[#f87171] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f87171]/40"
                            aria-label="Remove entry"
                          >
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Add Entry */}
        <div className="col-span-12 flex min-h-0 flex-col lg:col-span-5">
          <div
            className="vault-glow-card flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0E0E0E] shadow-[inset_0_2px_0_0_rgba(233,195,73,0.65)]"
          >
            <div className="shrink-0 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
              <h2 className="catalog-label text-[#e9c349]">+ Add Entry</h2>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 sm:px-5">
              <div className="flex shrink-0 gap-0">
                <button
                  type="button"
                  onClick={() => {
                    if (kind === "income") return;
                    setKind("income");
                    setCategory(INCOME_CATEGORIES[0].value);
                  }}
                  className={`min-h-11 flex-1 font-sans text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm ${
                    kind === "income"
                      ? "bg-[#142818] text-[#4ade80] shadow-[inset_0_0_0_0.5px_rgba(74,222,128,0.35)]"
                      : "bg-[#131313] text-[#c6c6c6] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.06)]"
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (kind === "expense") return;
                    setKind("expense");
                    setCategory(EXPENSE_CATEGORIES[0].value);
                  }}
                  className={`min-h-11 flex-1 font-sans text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm ${
                    kind === "expense"
                      ? "bg-[#3a1215] text-[#FFFFFF] shadow-[inset_0_0_0_0.5px_rgba(248,113,113,0.35)]"
                      : "bg-[#131313] text-[#c6c6c6] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.06)]"
                  }`}
                >
                  Expense
                </button>
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <p className="catalog-label text-[#e9c349]">Quick chips</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => applyChip(chip)}
                      className="catalog-label bg-transparent px-3 py-2 text-[#e9c349] shadow-[0_0_0_0.5px_#e9c349] transition-colors hover:bg-[#e9c349]/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={descId}
                  className="catalog-label text-[#e9c349]"
                >
                  Description
                </label>
                <input
                  id={descId}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this?"
                  className="min-h-11 w-full border-0 bg-[#131313] px-3 py-2 font-sans text-sm text-[#FFFFFF] outline-none placeholder:text-[#c6c6c6]/35 focus-visible:ring-2 focus-visible:ring-[#e9c349]/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={amountId}
                    className="catalog-label text-[#e9c349]"
                  >
                    Amount
                  </label>
                  <div className="flex min-h-11 items-center bg-[#131313] px-3 shadow-[inset_0_0_0_0.5px_rgba(233,195,73,0.25)]">
                    <span className="mr-1 font-sans text-sm text-[#e9c349]">
                      £
                    </span>
                    <input
                      id={amountId}
                      type="text"
                      inputMode="decimal"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="0.00"
                      className="min-w-0 flex-1 border-0 bg-transparent py-2 font-sans text-sm tabular-nums text-[#FFFFFF] outline-none placeholder:text-[#c6c6c6]/35"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={catId}
                    className="catalog-label text-[#e9c349]"
                  >
                    Category
                  </label>
                  <select
                    id={catId}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="min-h-11 w-full cursor-pointer border-0 bg-[#131313] px-3 font-sans text-sm text-[#FFFFFF] outline-none shadow-[inset_0_0_0_0.5px_rgba(233,195,73,0.25)] focus-visible:ring-2 focus-visible:ring-[#e9c349]/40"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={dateId}
                  className="catalog-label text-[#e9c349]"
                >
                  Date
                </label>
                <input
                  id={dateId}
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="min-h-11 w-full border-0 bg-[#131313] px-3 font-sans text-sm text-[#FFFFFF] outline-none shadow-[inset_0_0_0_0.5px_rgba(233,195,73,0.25)] focus-visible:ring-2 focus-visible:ring-[#e9c349]/40"
                />
              </div>

              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex min-h-10 shrink-0 items-center gap-2 self-start font-sans text-xs text-[#e9c349] hover:underline sm:text-sm"
              >
                <Paperclip className="size-4" strokeWidth={1.5} />
                {pendingFile ? pendingFile.name : "Attach proof (optional)"}
              </button>

              <button
                type="button"
                onClick={logEntry}
                className="mt-auto min-h-12 w-full shrink-0 bg-[#e9c349] font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#241a00] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9c349] sm:min-h-14 sm:text-base"
              >
                Log Entry +
              </button>
            </div>
          </div>
        </div>
      </div>

      {preview && previewEntry ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E0E]/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewEntry(null)}
        >
          <div
            className="vault-glow-card flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-between gap-3">
              <p className="catalog-label text-[#e9c349]">Proof</p>
              <button
                type="button"
                onClick={() => setPreviewEntry(null)}
                className="catalog-label text-[#c6c6c6] hover:text-[#FFFFFF]"
              >
                Close
              </button>
            </div>
            <p className="mb-2 truncate font-sans text-xs text-[#c6c6c6]">
              {preview.name}
            </p>
            <div className="min-h-0 flex-1 overflow-hidden">
              {preview.kind === "pdf" ? (
                <iframe
                  title={preview.name}
                  src={preview.url}
                  className="h-full min-h-[12rem] w-full border-0 bg-[#0E0E0E]"
                />
              ) : (
                <div className="relative h-full min-h-[12rem] w-full overflow-hidden">
                  <Image
                    src={preview.url}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain object-left-top"
                    sizes="(max-width: 32rem) 100vw, 32rem"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
