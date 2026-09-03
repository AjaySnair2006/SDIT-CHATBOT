"use client";

import { GraduationCap, Sparkles, ShieldCheck, Database } from "lucide-react";
import AppShell from "@/components/AppShell";
import Header from "@/components/Header";

const POINTS = [
  {
    icon: Database,
    title: "Grounded in SDIT's knowledge base",
    body: "Answers are retrieved from SDIT's own documents — handbooks, course catalogues, and campus information — rather than guessed.",
  },
  {
    icon: Sparkles,
    title: "Built for students",
    body: "Ask in plain language about admissions, courses, facilities, placements, clubs, or research, and get a direct answer.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent sourcing",
    body: "When available, responses show which source they were drawn from, so you can verify details yourself.",
  },
];

export default function AboutPage() {
  return (
    <AppShell renderHeader={(openMenu) => <Header onMenuClick={openMenu} />}>
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-gold dark:bg-white/10">
          <GraduationCap size={22} />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-ink dark:text-white">
          About SDIT SmartBot
        </h1>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft dark:text-white/60">
          SDIT SmartBot is an AI assistant built for Shree Devi Institute of
          Technology, Kenjar, Mangaluru. It was created by students, for
          students, as an entry for our college&apos;s Tech Bot event — a
          faster way to find answers about life at SDIT.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-1">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5 dark:border-dark-border dark:bg-dark-surface"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-campus-greensoft text-campus-green dark:bg-white/10 dark:text-gold">
                  <Icon size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink dark:text-white">
                    {point.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-white/50">
                    {point.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-paper p-5 text-sm leading-relaxed text-ink-soft dark:border-dark-border dark:bg-white/[0.02] dark:text-white/50">
          <p className="font-medium text-ink dark:text-white">Built with</p>
          <p className="mt-1">
            Frontend — Next.js, TypeScript, Tailwind CSS. Backend — Python,
            FastAPI, and retrieval-augmented generation (RAG) over SDIT&apos;s
            knowledge base.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
