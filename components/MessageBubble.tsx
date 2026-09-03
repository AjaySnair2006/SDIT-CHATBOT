"use client";

import { useState } from "react";
import { Check, Copy, AlertCircle, GraduationCap, RotateCcw } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { renderMarkdown } from "@/lib/markdown";
import SourceList from "./SourceList";

const CATEGORY_LABELS: Record<string, string> = {
  admissions: "Admissions",
  courses: "Courses",
  facilities: "Facilities",
  placements: "Placements",
  clubs: "Clubs & Activities",
  research: "Research",
  campus: "Campus",
  general: "General",
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, non-critical.
    }
  };

  if (isUser) {
    return (
      <div className="flex animate-fadeIn justify-end">
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-ink px-4 py-2.5 text-[0.925rem] leading-relaxed text-white dark:bg-gold-deep">
            {message.content}
          </div>
          <p className="mt-1 text-right text-[0.65rem] text-ink-faint dark:text-white/30">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fadeIn items-start gap-2.5">
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          message.isError
            ? "bg-danger/10 text-danger"
            : "bg-campus-greensoft text-campus-green dark:bg-white/10 dark:text-gold"
        }`}
        aria-hidden="true"
      >
        {message.isError ? (
          <AlertCircle size={14} />
        ) : (
          <GraduationCap size={14} />
        )}
      </span>
      <div className="max-w-[80%] flex-1">
        <div
          className={`group relative rounded-2xl rounded-tl-sm border px-4 py-3 text-[0.925rem] leading-relaxed ${
            message.isError
              ? "border-danger/25 bg-danger/[0.04] text-ink dark:border-danger/30 dark:bg-danger/10 dark:text-white"
              : "border-border bg-surface text-ink dark:border-dark-border dark:bg-dark-surface dark:text-white"
          }`}
        >
          {message.category && CATEGORY_LABELS[message.category] && (
            <span className="mb-1.5 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[0.65rem] font-medium text-gold-deep dark:bg-white/10 dark:text-gold">
              {CATEGORY_LABELS[message.category]}
            </span>
          )}
          <div className="prose-chat">{renderMarkdown(message.content)}</div>

          {message.isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <RotateCcw size={12} />
              Retry
            </button>
          )}

          {message.sources && message.sources.length > 0 && (
            <SourceList sources={message.sources} />
          )}

          {!message.isError && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-3 right-3 flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[0.65rem] text-ink-faint opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100 dark:border-dark-border dark:bg-dark-surface dark:text-white/40"
              aria-label="Copy response"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        <p className="mt-1 text-[0.65rem] text-ink-faint dark:text-white/30">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
