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
  "Studio",
  "Touring",
  "Plugin",
  "Legal",
  "Marketing",
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

function formatLedgerDayMonth(iso: string): { day: string; mon: string } {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return { day: "—", mon: "" };
  const dt = new Date(y, m - 1, d);
  return {
    day: String(dt.getDate()),
    mon: dt.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
  };
}

export function LedgerCockpit({
  searchFilter = "",
}: {
  searchFilter?: string;
}) {
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

  const filteredEntries = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.description.toLowerCase().includes(q) ||
        e.categoryLabel.toLowerCase().includes(q)
    );
  }, [entries, searchFilter]);

  const waveformEntryId = useMemo(() => {
    let best: LedgerEntry | null = null;
    for (const e of entries) {
      if (e.kind !== "income") continue;
      if (!best || e.amount > best.amount) best = e;
    }
    return best?.id ?? null;
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

  const WAVEFORM_HEIGHTS = [20, 40, 30, 60, 20, 80, 40, 90, 20, 50, 30, 10, 70, 40];

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-4 overflow-hidden sm:gap-6">
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:gap-4">
        <div className="border-b border-[#4d4635]/20 bg-[#1c1b1b] px-4 py-3 text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
            Running total
          </p>
          <p
            className={`mt-1 font-sans text-lg font-semibold tabular-nums sm:text-xl ${
              netSigned >= 0 ? "text-[#e0ccab]" : "text-[#ffb4ab]"
            }`}
          >
            {formatGbp(netSigned)}
          </p>
        </div>
        <div className="border-b border-[#4d4635]/20 bg-[#1c1b1b] px-4 py-3 text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
            Spendable Cash
          </p>
          <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-[#e0ccab] sm:text-xl">
            {spendable}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12 lg:gap-8">
        <div className="flex min-h-0 flex-col lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-sans text-2xl font-bold tracking-tight text-[#e5e2e1]">
                Recent Log
              </h2>
              <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]">
                Real-time financial telemetry
              </p>
            </div>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]">
              Live sync
            </span>
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <ul className="flex flex-col gap-4">
              {filteredEntries.map((entry) => {
                const dm = formatLedgerDayMonth(entry.dateIso);
                const showWave = entry.id === waveformEntryId;
                return (
                  <li key={entry.id}>
                    <div
                      className={`relative flex flex-col gap-3 bg-[#1c1b1b] p-5 transition-colors duration-300 hover:bg-[#393939] sm:flex-row sm:items-center sm:justify-between ${
                        showWave ? "overflow-hidden" : ""
                      }`}
                    >
                      {showWave ? (
                        <div
                          className="pointer-events-none absolute inset-0 flex items-end justify-center gap-0.5 px-8 pb-4 opacity-10"
                          aria-hidden
                        >
                          {WAVEFORM_HEIGHTS.map((h, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-[#e0ccab]"
                              style={{ height: `${h * 0.32}px` }}
                            />
                          ))}
                        </div>
                      ) : null}
                      <div className="relative z-[1] flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex shrink-0 flex-col items-center text-center sm:w-12">
                          <span className="font-sans text-xs font-bold text-[#e5e2e1]">
                            {dm.day}
                          </span>
                          <span className="font-sans text-[9px] font-bold uppercase tracking-tighter text-[#99907c]">
                            {dm.mon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-sans text-sm font-medium tracking-tight text-[#e5e2e1]">
                            {entry.description}
                          </h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className="bg-[#353534] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-widest text-[#e0ccab]">
                              {entry.categoryLabel}
                            </span>
                            <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
                              {entry.kind === "income" ? "Income" : "Expense"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-[1] flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <span
                          className={`font-sans text-sm font-bold tabular-nums ${
                            entry.kind === "income"
                              ? "text-[#e0ccab]"
                              : "text-[#ffb4ab]"
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
                              className="flex size-9 items-center justify-center text-[#e0ccab] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e0ccab]/40"
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
                            className="flex size-9 items-center justify-center text-[#99907c] hover:text-[#ffb4ab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb4ab]/40"
                            aria-label="Remove entry"
                          >
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex min-h-0 flex-col lg:col-span-5">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#1c1b1b] lg:sticky lg:top-0 lg:max-h-[calc(100dvh-8rem)]">
            <div className="shrink-0 p-6 pb-2 sm:p-8 sm:pb-2">
              <h2 className="font-sans text-xl font-bold tracking-tight text-[#e0ccab]">
                Add Entry
              </h2>
              <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]">
                Financial input interface
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              <div>
                <label className="mb-3 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]">
                  Transaction type
                </label>
                <div className="grid grid-cols-2 border border-[#4d4635]/10 bg-[#0e0e0e] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (kind === "income") return;
                      setKind("income");
                      setCategory(INCOME_CATEGORIES[0].value);
                    }}
                    className={`py-2 font-sans text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      kind === "income"
                        ? "bg-[#2a2a2a] text-[#e0ccab]"
                        : "text-[#99907c] hover:text-[#e5e2e1]"
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
                    className={`py-2 font-sans text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      kind === "expense"
                        ? "bg-[#2a2a2a] text-[#e0ccab]"
                        : "text-[#99907c] hover:text-[#e5e2e1]"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor={amountId}
                  className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Amount (GBP)
                </label>
                <div className="relative border-b border-[#4d4635]/30 focus-within:border-[#e0ccab]">
                  <span className="absolute bottom-3 left-0 font-sans text-2xl font-bold text-[#e0ccab]">
                    £
                  </span>
                  <input
                    id={amountId}
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full border-0 bg-transparent py-3 pl-8 font-sans text-2xl font-bold tracking-tight text-[#e5e2e1] outline-none placeholder:text-[#4d4635]/40 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={descId}
                  className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Reference / entity
                </label>
                <input
                  id={descId}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Beatport settlement"
                  className="w-full border-0 border-b border-[#4d4635]/30 bg-transparent py-2 font-sans text-xs font-semibold uppercase tracking-widest text-[#e5e2e1] outline-none placeholder:text-[#4d4635]/40 focus:border-[#e0ccab] focus:ring-0"
                />
              </div>

              <div>
                <label
                  htmlFor={catId}
                  className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Category
                </label>
                <select
                  id={catId}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full cursor-pointer border-0 border-b border-[#4d4635]/30 bg-[#0e0e0e] px-0 py-2 font-sans text-xs text-[#e5e2e1] outline-none focus:border-[#e0ccab] focus:ring-0"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={dateId}
                  className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Date
                </label>
                <input
                  id={dateId}
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full border-0 border-b border-[#4d4635]/30 bg-[#0e0e0e] py-2 font-sans text-xs text-[#e5e2e1] outline-none focus:border-[#e0ccab] focus:ring-0"
                />
              </div>

              <div>
                <label className="mb-3 block font-sans text-[10px] font-semibold uppercase tracking-widest text-[#99907c]">
                  Quick categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => applyChip(chip)}
                      className="border border-[#4d4635]/20 px-3 py-1.5 font-sans text-[9px] font-bold uppercase tracking-widest text-[#e5e2e1] transition-all duration-200 hover:bg-[#e0ccab] hover:text-[#3a2f18]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
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
                className="flex min-h-10 shrink-0 items-center gap-2 self-start font-sans text-xs text-[#e0ccab] hover:underline"
              >
                <Paperclip className="size-4" strokeWidth={1.5} />
                {pendingFile ? pendingFile.name : "Attach proof (optional)"}
              </button>

              <button
                type="button"
                onClick={logEntry}
                className="mt-auto flex min-h-12 w-full shrink-0 items-center justify-center gap-2 bg-[#e0ccab] font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#3a2f18] transition-all hover:bg-[#c3b191] active:scale-[0.98]"
              >
                <span>Log entry</span>
              </button>

              <div className="border-l-2 border-[#e0ccab]/20 bg-[#0e0e0e] p-4">
                <div className="flex items-start gap-3">
                  <span className="font-sans text-sm text-[#e0ccab]" aria-hidden>
                    ℹ
                  </span>
                  <p className="font-sans text-[10px] leading-relaxed text-[#d0c5af]">
                    Data integrity: entries stay in your session for this demo;
                    production will sync to your vault after HMRC consent.
                  </p>
                </div>
              </div>
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
            className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden border border-[#4d4635]/15 bg-[#1c1b1b] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex justify-between gap-3">
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e0ccab]">
                Proof
              </p>
              <button
                type="button"
                onClick={() => setPreviewEntry(null)}
                className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#d0c5af] hover:text-[#e5e2e1]"
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
