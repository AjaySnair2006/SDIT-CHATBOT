"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import AppShell from "@/components/AppShell";
import Header from "@/components/Header";

const FAQS = [
  {
    q: "What can I ask SDIT SmartBot?",
    a: "Anything about SDIT — admissions and eligibility, courses offered, campus facilities, placement training, student clubs, and research opportunities.",
  },
  {
    q: "Where does SDIT SmartBot get its answers from?",
    a: "Its answers are retrieved from SDIT's own knowledge base by the backend. When a source is available, it's shown under the answer.",
  },
  {
    q: "What if the server is offline or a question fails?",
    a: "You'll see a clear error message with a Retry button. Your conversation stays intact, so you can try again without losing earlier messages.",
  },
  {
    q: "Is my conversation saved anywhere?",
    a: "Conversations are stored only in your browser on this device, so you can pick up where you left off. Use New Chat to clear it.",
  },
  {
    q: "Can I use voice input?",
    a: "Yes — tap the microphone icon in the chat input to dictate your question. If your browser doesn't support speech recognition, you can always type instead.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AppShell renderHeader={(openMenu) => <Header onMenuClick={openMenu} />}>
      <div className="mx-auto max-w-2xl px-5 py-14 lg:px-8 lg:py-20">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-gold dark:bg-white/10">
          <HelpCircle size={22} />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-ink dark:text-white">
          Help &amp; FAQ
        </h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft dark:text-white/60">
          Common questions about using SDIT SmartBot.
        </p>

        <div className="mt-9 divide-y divide-border rounded-xl border border-border bg-surface dark:divide-dark-border dark:border-dark-border dark:bg-dark-surface">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink dark:text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-ink-faint transition-transform dark:text-white/40 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft dark:text-white/50">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
