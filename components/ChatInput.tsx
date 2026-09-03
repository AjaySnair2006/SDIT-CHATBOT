"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import VoiceButton from "./VoiceButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  externalValue?: string;
}

export default function ChatInput({
  onSend,
  disabled,
  externalValue,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
      textareaRef.current?.focus();
    }
  }, [externalValue]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-surface px-3 py-3 lg:px-6 lg:py-4 dark:border-dark-border dark:bg-dark-surface">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-paper px-2.5 py-2 focus-within:border-gold/50 dark:border-dark-border dark:bg-dark-bg">
        <VoiceButton
          disabled={disabled}
          onResult={(transcript) =>
            setValue((prev) => (prev ? `${prev} ${transcript}` : transcript))
          }
        />
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about admissions, courses, campus life..."
          aria-label="Message SDIT SmartBot"
          className="max-h-[140px] flex-1 resize-none bg-transparent py-1.5 text-[0.925rem] text-ink placeholder:text-ink-faint focus:outline-none disabled:opacity-60 dark:text-white dark:placeholder:text-white/30"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition-colors enabled:hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-30 dark:bg-gold-deep"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[0.68rem] text-ink-faint dark:text-white/30">
        SDIT SmartBot can make mistakes. Verify important details with the
        college office.
      </p>
    </div>
  );
}
