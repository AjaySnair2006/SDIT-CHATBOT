"use client";

import { useState } from "react";
import {
  CircleHelp,
  ChevronDown,
  MessageCircle,
  Mail,
} from "lucide-react";

const FAQS = [
  {
    question: "What is SDIT SmartBot?",
    answer:
      "SDIT SmartBot is an AI-powered campus assistant designed to help students find information about SDIT, including admissions, courses, facilities, placements, clubs and other campus-related information.",
  },
  {
    question: "What can I ask SmartBot?",
    answer:
      "You can ask questions about admissions, departments, courses, campus facilities, placements, student activities, research and other information available in the SmartBot knowledge base.",
  },
  {
    question: "How do I report an issue?",
    answer:
      "You can use the Complaints section from the sidebar to submit an issue. Provide the category, subject and a clear description so it can be reviewed.",
  },
  {
    question: "How can I give feedback?",
    answer:
      "Open the Feedback section from the sidebar, select your rating and share your experience or suggestions.",
  },
  {
    question: "What if SmartBot gives me an incorrect answer?",
    answer:
      "If you notice incorrect or outdated information, please report it through the Feedback or Complaints section so the information can be reviewed.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f8f5] px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9b24c]/40 bg-[#fffaf0]">
            <CircleHelp size={23} className="text-[#bd8f2b]" />
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bd8f2b]">
            SmartBot Assistance
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#17382b]">
            Help & Support
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718079]">
            Find answers to common questions or get help with SDIT SmartBot.
          </p>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-[#e1e6df] bg-white p-5 shadow-[0_10px_35px_rgba(23,56,43,0.06)] lg:p-7">
          <div className="mb-5">
            <p className="text-sm font-bold text-[#17382b]">
              Frequently Asked Questions
            </p>

            <p className="mt-1 text-xs text-[#98a19c]">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-xl border transition ${
                    isOpen
                      ? "border-[#e2c875] bg-[#fffaf0]"
                      : "border-[#e5eae4] bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-[#46544d]">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#8b9690] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#eee7d1] px-4 pb-4 pt-3">
                      <p className="text-sm leading-6 text-[#718079]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e1e6df] bg-white p-6 shadow-[0_10px_35px_rgba(23,56,43,0.05)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf7f0]">
              <MessageCircle size={19} className="text-[#258355]" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#17382b]">
              Ask SmartBot
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8a9690]">
              Get quick answers about campus, courses, admissions and more.
            </p>

            <a
              href="/chat"
              className="mt-5 inline-flex rounded-lg bg-[#17382b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24523f]"
            >
              Start Chat
            </a>
          </div>

          <div className="rounded-2xl border border-[#e1e6df] bg-white p-6 shadow-[0_10px_35px_rgba(23,56,43,0.05)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fffaf0]">
              <Mail size={19} className="text-[#bd8f2b]" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#17382b]">
              Need More Help?
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8a9690]">
              If you cannot find an answer, submit a complaint or feedback.
            </p>

            <a
              href="/feedback"
              className="mt-5 inline-flex rounded-lg border border-[#d9b24c] bg-[#fffaf0] px-4 py-2.5 text-xs font-semibold text-[#9a7421] transition hover:bg-[#fff6df]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}