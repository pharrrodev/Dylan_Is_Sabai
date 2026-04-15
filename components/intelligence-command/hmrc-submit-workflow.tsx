"use client";

import { Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleSubmitToHMRC } from "@/lib/hmrc-submit-placeholder";
import { formatGbp } from "@/lib/mtd-demo";
import { cn } from "@/lib/utils";

type HmrcSubmitWorkflowProps = {
  hmrcConnected: boolean;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
};

export function HmrcSubmitWorkflow({
  hmrcConnected,
  totalIncome,
  totalExpenses,
  netProfit,
}: HmrcSubmitWorkflowProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const onConfirmSend = async () => {
    setSubmitting(true);
    try {
      const res = await handleSubmitToHMRC();
      setReviewOpen(false);
      if (res.ok) {
        showToast("Success: Data sent to HMRC");
      } else {
        showToast(res.message);
      }
    } catch {
      showToast("Could not reach HMRC. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-[#8fa3c4]">
            HMRC MTD
          </p>
          <p className="mt-0.5 font-sans text-[10px] text-[#6b7c99]">
            Double-check figures, then send when your connection is live.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!hmrcConnected}
          onClick={() => setReviewOpen(true)}
          className={cn(
            "inline-flex min-h-9 shrink-0 gap-2 border-[#5b8def] text-[#5b8def] hover:bg-[rgba(91,141,239,0.12)]",
            !hmrcConnected && "opacity-40"
          )}
        >
          <Send className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          Submit to HMRC
        </Button>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          <DialogHeader>
            <DialogTitle>Final review</DialogTitle>
            <DialogDescription>
              Confirm totals match your records before sending to HMRC Making Tax Digital.
            </DialogDescription>
          </DialogHeader>
          <div className="scrollbar-hide max-h-[min(52vh,22rem)] space-y-3 overflow-y-auto px-5 py-2">
            <div className="grid grid-cols-2 gap-2 font-sans text-xs">
              <div className="border border-[#2a3548] bg-[#0a0c10] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3c4]">
                  Total income
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#5b8def]">
                  {formatGbp(totalIncome)}
                </p>
              </div>
              <div className="border border-[#2a3548] bg-[#0a0c10] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8fa3c4]">
                  Total expenses
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#fca5a5]">
                  {formatGbp(totalExpenses)}
                </p>
              </div>
            </div>
            <div className="border border-[#5b8def]/35 bg-[#121826] p-3">
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8fa3c4]">
                Net profit
              </p>
              <p className="mt-1 font-sans text-lg font-bold tabular-nums text-[#e8eefc]">
                {formatGbp(netProfit)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReviewOpen(false)}
              disabled={submitting}
              className="border-[#2a3548] text-[#e8eefc]"
            >
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onConfirmSend}
              disabled={submitting}
              className="inline-flex gap-2 bg-[#5b8def] text-[#0a0c10] hover:bg-[#7aa3f7]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                "Confirm & send"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast ? (
        <div
          className="fixed bottom-6 right-6 z-[100] max-w-sm border border-[#1e7a4a]/50 bg-[#0f1a14] px-4 py-3 font-sans text-xs font-medium text-[#bbf7d0] shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
