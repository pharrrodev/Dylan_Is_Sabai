"use client";

import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { ReceiptDropzone } from "@/components/ledger/receipt-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const MAX_VISIBLE = 7;
  const displayEntries = useMemo(
    () => filteredEntries.slice(0, MAX_VISIBLE),
    [filteredEntries]
  );
  const hiddenEntryCount = filteredEntries.length - displayEntries.length;

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
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-2 overflow-hidden sm:gap-3">
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3">
        <div className="border-b border-[#4d4635]/20 bg-[#1c1b1b] px-3 py-2 text-center">
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
        <div className="border-b border-[#4d4635]/20 bg-[#1c1b1b] px-3 py-2 text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#d0c5af]">
            Spendable Cash
          </p>
          <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-[#e0ccab] sm:text-xl">
            {spendable}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12 lg:gap-5">
        <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-7">
          <div className="mb-2 flex shrink-0 flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-sans text-lg font-bold tracking-tight text-[#e5e2e1] sm:text-xl">
                Recent Log
              </h2>
              <p className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
                Live telemetry
              </p>
            </div>
            <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
              Sync
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ul className="flex min-h-0 flex-1 flex-col justify-start gap-1.5 overflow-hidden">
              {displayEntries.map((entry) => {
                const dm = formatLedgerDayMonth(entry.dateIso);
                const showWave = entry.id === waveformEntryId;
                return (
                  <li key={entry.id}>
                    <div
                      className={`relative flex min-h-0 shrink-0 flex-col gap-2 bg-[#1c1b1b] p-3 transition-colors duration-300 hover:bg-[#393939] sm:flex-row sm:items-center sm:justify-between ${
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
                      <div className="relative z-[1] flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex shrink-0 flex-col items-center text-center sm:w-10">
                          <span className="font-sans text-[11px] font-bold text-[#e5e2e1]">
                            {dm.day}
                          </span>
                          <span className="font-sans text-[8px] font-bold uppercase tracking-tighter text-[#99907c]">
                            {dm.mon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-sans text-xs font-medium tracking-tight text-[#e5e2e1] sm:text-sm">
                            {entry.description}
                          </h3>
                          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
                            <span className="max-w-[10rem] truncate bg-[#353534] px-1.5 py-0.5 font-sans text-[8px] font-bold uppercase tracking-widest text-[#e0ccab] sm:max-w-[12rem]">
                              {entry.categoryLabel}
                            </span>
                            <span className="font-sans text-[8px] font-semibold uppercase tracking-widest text-[#99907c]">
                              {entry.kind === "income" ? "In" : "Out"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-[1] flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-center">
                        <span
                          className={`font-sans text-xs font-bold tabular-nums sm:text-sm ${
                            entry.kind === "income"
                              ? "text-[#e0ccab]"
                              : "text-[#ffb4ab]"
                          }`}
                        >
                          {entry.kind === "income" ? "+" : "−"}
                          {formatGbp(entry.amount)}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {entry.attachment ? (
                            <button
                              type="button"
                              onClick={() => openPreview(entry)}
                              className="flex size-8 items-center justify-center text-[#5b8def] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5b8def]/40"
                              aria-label="Preview receipt"
                            >
                              <Eye className="size-3.5" strokeWidth={1.5} />
                            </button>
                          ) : (
                            <span className="size-8" aria-hidden />
                          )}
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.id)}
                            className="flex size-8 items-center justify-center text-[#99907c] hover:text-[#ffb4ab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb4ab]/40"
                            aria-label="Remove entry"
                          >
                            <Trash2 className="size-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {hiddenEntryCount > 0 ? (
              <p className="shrink-0 pt-1 font-sans text-[9px] leading-tight text-[#99907c]">
                Showing the latest {MAX_VISIBLE} entries. Refine search or clear
                older rows to see more without leaving this screen.
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-5">
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#1c1b1b]">
            <div className="shrink-0 px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
              <h2 className="font-sans text-lg font-bold tracking-tight text-[#e0ccab]">
                Add Entry
              </h2>
              <p className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
                Log income or expense
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 pb-3 sm:px-5 sm:pb-4">
              <div>
                <label className="mb-1.5 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
                  Transaction type
                </label>
                <div className="grid grid-cols-2 border border-[#4d4635]/10 bg-[#0e0e0e] p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (kind === "income") return;
                      setKind("income");
                      setCategory(INCOME_CATEGORIES[0].value);
                    }}
                    className={`min-h-9 py-1.5 font-sans text-[9px] font-bold uppercase tracking-widest transition-colors ${
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
                    className={`min-h-9 py-1.5 font-sans text-[9px] font-bold uppercase tracking-widest transition-colors ${
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
                  className="mb-1 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Amount (GBP)
                </label>
                <div className="relative border-b border-[#4d4635]/30 focus-within:border-[#e0ccab]">
                  <span className="absolute bottom-2 left-0 font-sans text-xl font-bold text-[#e0ccab] sm:text-2xl">
                    £
                  </span>
                  <input
                    id={amountId}
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full border-0 bg-transparent py-2 pl-7 font-sans text-xl font-bold tracking-tight text-[#e5e2e1] outline-none placeholder:text-[#4d4635]/40 focus:ring-0 sm:pl-8 sm:text-2xl"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={descId}
                  className="mb-1 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Reference / entity
                </label>
                <input
                  id={descId}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Beatport settlement"
                  className="w-full border-0 border-b border-[#4d4635]/30 bg-transparent py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#e5e2e1] outline-none placeholder:text-[#4d4635]/40 focus:border-[#e0ccab] focus:ring-0"
                />
              </div>

              <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                <label
                  htmlFor={catId}
                  className="mb-1 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]"
                >
                  Category
                </label>
                <select
                  id={catId}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-h-9 cursor-pointer border-0 border-b border-[#4d4635]/30 bg-[#0e0e0e] px-0 py-1.5 font-sans text-[11px] text-[#e5e2e1] outline-none focus:border-[#e0ccab] focus:ring-0"
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
                    className="mb-1 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]"
                  >
                    Date
                  </label>
                  <input
                    id={dateId}
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full min-h-9 border-0 border-b border-[#4d4635]/30 bg-[#0e0e0e] py-1.5 font-sans text-[11px] text-[#e5e2e1] outline-none focus:border-[#e0ccab] focus:ring-0"
                  />
                </div>
              </div>

              <div className="shrink-0">
                <label className="mb-1.5 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#99907c]">
                  Quick categories
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => applyChip(chip)}
                      className="min-h-8 border border-[#4d4635]/20 px-2 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-[#e5e2e1] transition-all duration-200 hover:bg-[#e0ccab] hover:text-[#3a2f18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e0ccab]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <ReceiptDropzone
                className="shrink-0"
                file={pendingFile}
                onFileChange={setPendingFile}
              />

              <button
                type="button"
                onClick={logEntry}
                className="mt-auto flex min-h-10 w-full shrink-0 items-center justify-center bg-[#e0ccab] font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#3a2f18] transition-all hover:bg-[#c3b191] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0ccab]"
              >
                Log entry
              </button>

              <div className="shrink-0 border-l-2 border-[#e0ccab]/20 bg-[#0e0e0e] p-2.5">
                <p className="line-clamp-2 font-sans text-[9px] leading-snug text-[#d0c5af]">
                  <span className="font-semibold text-[#e0ccab]">Note:</span> Demo
                  session only. Production syncs after HMRC consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={!!previewEntry}
        onOpenChange={(open) => {
          if (!open) setPreviewEntry(null);
        }}
      >
        <DialogContent className="max-w-lg gap-0 p-0">
          {preview && previewEntry ? (
            <div className="flex min-h-0 flex-col">
              <DialogHeader>
                <DialogTitle>Receipt preview</DialogTitle>
                <DialogDescription>
                  Double-check this matches your records before any HMRC submission.
                </DialogDescription>
                <p
                  className="truncate pr-10 font-sans text-[11px] text-[#8fa3c4]"
                  title={preview.name}
                >
                  {preview.name}
                </p>
              </DialogHeader>
              <div className="scrollbar-hide max-h-[min(70dvh,28rem)] min-h-[12rem] overflow-y-auto px-5 pb-5">
                {preview.kind === "pdf" ? (
                  <iframe
                    title={preview.name}
                    src={preview.url}
                    className="h-[min(60dvh,24rem)] w-full border border-[#2a3548] bg-[#0a0c10]"
                  />
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#2a3548] bg-[#0a0c10]">
                    <Image
                      src={preview.url}
                      alt=""
                      fill
                      unoptimized
                      className="object-contain object-center"
                      sizes="(max-width: 32rem) 100vw, 32rem"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
