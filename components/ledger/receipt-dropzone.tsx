"use client";

import { Check, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export const RECEIPT_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif,image/bmp,image/svg+xml,application/pdf,.pdf,.jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.svg";

function isAllowedReceiptFile(f: File): boolean {
  const lower = f.name.toLowerCase();
  if (f.type === "application/pdf" || lower.endsWith(".pdf")) return true;
  if (f.type.startsWith("image/")) return true;
  return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp", ".svg"].some((ext) =>
    lower.endsWith(ext)
  );
}

type ReceiptDropzoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  className?: string;
};

export function ReceiptDropzone({ file, onFileChange, className }: ReceiptDropzoneProps) {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const applyFile = useCallback(
    (f: File | null) => {
      if (!f) {
        onFileChange(null);
        return;
      }
      if (!isAllowedReceiptFile(f)) {
        onFileChange(null);
        return;
      }
      onFileChange(f);
    },
    [onFileChange]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    e.target.value = "";
    applyFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) applyFile(f);
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer flex-col gap-2 border border-dashed border-[#3d4f6e]/80 bg-[#0e1219] p-3 transition-colors hover:border-[#5b8def]/60 hover:bg-[#121826]/90",
          dragActive && "border-[#5b8def] bg-[#121826]"
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        <input
          id={inputId}
          type="file"
          accept={RECEIPT_ACCEPT}
          className="sr-only"
          onChange={onInputChange}
        />
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center border border-[#2a3548] bg-[#0a0c10] text-[#5b8def]">
            <Upload className="size-4" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-[#e8eefc]">
              Attach Receipt (PDF, PNG, JPG)
            </p>
            <p className="mt-0.5 font-sans text-[10px] leading-snug text-[#8fa3c4]">
              All common image formats supported — drop or tap to choose
            </p>
          </div>
        </div>

        {file ? (
          <div className="flex items-center gap-2 border-t border-[#2a3548]/60 pt-2">
            {previewUrl ? (
              <div className="relative size-11 shrink-0 overflow-hidden border border-[#2a3548] bg-[#0a0c10]">
                <Image
                  src={previewUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="44px"
                />
              </div>
            ) : (
              <span className="flex size-11 shrink-0 items-center justify-center border border-[#1e7a4a]/40 bg-[#0f1a14] text-[#4ade80]">
                <Check className="size-5" strokeWidth={2} aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#4ade80]">
                File ready
              </p>
              <p className="truncate font-sans text-[11px] text-[#e8eefc]" title={file.name}>
                {file.name}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFileChange(null);
              }}
              className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-widest text-[#8fa3c4] underline-offset-2 hover:text-[#e8eefc] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5b8def]/50"
            >
              Clear
            </button>
          </div>
        ) : null}
      </label>
    </div>
  );
}
