"use client";

import { MessageCircle, Send, X, Loader2, ShieldCheck } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "guardian";
  text: string;
};

export function SabaiGuardian() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || thinking) return;

      const userMsg: ChatMessage = { role: "user", text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setThinking(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg.text }),
        });

        const data: { reply?: string; error?: string } = await res.json();

        const guardianMsg: ChatMessage = {
          role: "guardian",
          text: data.reply ?? data.error ?? "Something went wrong.",
        };
        setMessages((prev) => [...prev, guardianMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "guardian", text: "Network error — try again." },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Sabai Guardian" : "Open Sabai Guardian"}
        className={cn(
          "fixed bottom-5 right-5 z-[200] flex size-12 items-center justify-center border border-[#5b8def]/40 bg-[#121826] text-[#5b8def] shadow-[0_4px_24px_rgba(91,141,239,0.25)] transition-all hover:bg-[#1a2438] hover:shadow-[0_4px_32px_rgba(91,141,239,0.35)] active:scale-95 sm:size-14",
        )}
      >
        {open ? (
          <X className="size-5 sm:size-6" strokeWidth={1.5} />
        ) : (
          <MessageCircle className="size-5 sm:size-6" strokeWidth={1.5} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[200] flex h-[min(70vh,32rem)] w-[min(92vw,24rem)] flex-col overflow-hidden border border-[#2a3548] bg-[#0f1218] shadow-[0_8px_48px_rgba(0,0,0,0.6)] sm:bottom-[5.5rem]">
          {/* Header */}
          <div className="flex shrink-0 items-center gap-2.5 border-b border-[#2a3548]/60 bg-[#121826] px-4 py-3">
            <ShieldCheck className="size-5 shrink-0 text-[#5b8def]" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-[#e8eefc]">
                Sabai Guardian
              </p>
              <p className="font-sans text-[9px] font-medium uppercase tracking-widest text-[#6b7c99]">
                UK Tax &amp; App Assistant
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-3 py-3"
          >
            {messages.length === 0 && !thinking && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
                <ShieldCheck className="size-8 text-[#5b8def]/30" strokeWidth={1} />
                <p className="font-sans text-xs leading-relaxed text-[#6b7c99]">
                  Ask me about UK tax rules for creators, or how to use this app.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] px-3 py-2 font-sans text-xs leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto border border-[#5b8def]/25 bg-[#1a2438] text-[#e8eefc]"
                    : "mr-auto border border-[#2a3548] bg-[#121826] text-[#c8d4e8]",
                )}
              >
                {msg.role === "guardian" && (
                  <span className="mb-1 block font-heading text-[9px] font-bold uppercase tracking-widest text-[#5b8def]">
                    Guardian
                  </span>
                )}
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </div>
            ))}

            {thinking && (
              <div className="mr-auto flex items-center gap-2 border border-[#2a3548] bg-[#121826] px-3 py-2">
                <Loader2 className="size-3.5 shrink-0 animate-spin text-[#5b8def]" />
                <span className="font-sans text-xs text-[#6b7c99]">Thinking…</span>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-end gap-2 border-t border-[#2a3548]/60 bg-[#121826] px-3 py-2.5"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a tax question…"
              rows={1}
              disabled={thinking}
              className="min-h-[2rem] max-h-20 flex-1 resize-none border border-[#2a3548] bg-[#0a0c10] px-2.5 py-1.5 font-sans text-xs text-[#e8eefc] placeholder:text-[#6b7c99] focus:border-[#5b8def]/50 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="flex size-8 shrink-0 items-center justify-center border border-[#5b8def]/40 bg-[#5b8def]/10 text-[#5b8def] transition-colors hover:bg-[#5b8def]/20 disabled:opacity-30"
            >
              <Send className="size-3.5" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
