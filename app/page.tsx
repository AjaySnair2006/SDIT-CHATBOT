"use client";

import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import HeroBackground from "@/components/HeroBackground";
import LiveDemo from "@/components/LiveDemo";

const HERO_IMAGES = ["/hero-bg-1.jpg", "/hero-bg-2.jpg", "/hero-bg-3.jpg"];

const CATEGORIES = [
  { label: "Admissions", icon: GraduationCap, desc: "Eligibility, entrance exams, and how to apply." },
  { label: "Courses", icon: BookOpen, desc: "Undergraduate and postgraduate programmes on offer." },
  { label: "Campus", icon: Building2, desc: "Labs, library, hostel, and everyday campus life." },
  { label: "Placements", icon: Briefcase, desc: "Training, recruiters, and placement support." },
  { label: "Clubs & Activities", icon: Users, desc: "Technical, cultural, and student-run clubs." },
  { label: "Research", icon: FlaskConical, desc: "Ongoing projects and research opportunities." },
];

export default function HomePage() {
  return (
    <AppShell renderHeader={(openMenu) => <Header onMenuClick={openMenu} />}>
      <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="relative min-h-[55vh] overflow-hidden rounded-2xl sm:min-h-[70vh]">
          <HeroBackground images={HERO_IMAGES} />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/90 to-paper/40 dark:from-dark-bg dark:via-dark-bg/90 dark:to-dark-bg/40" />

          <div className="relative flex min-h-[55vh] flex-col justify-center gap-9 px-5 py-12 sm:min-h-[70vh] sm:px-9 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-soft dark:border-dark-border dark:bg-dark-surface dark:text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-campus-green" />
                Shree Devi Institute of Technology
              </span>

              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl dark:text-white">
                Hello <span aria-hidden="true">👋</span>
                <br />
                I&apos;m SDIT SmartBot
              </h1>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft dark:text-white/60">
                Your AI assistant for Shree Devi Institute of Technology. Ask
                me about admissions, courses, campus facilities, placements,
                clubs, or research — I&apos;ll pull answers straight from
                SDIT&apos;s own knowledge base.
              </p>

              <Link
                href="/chat"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gold-deep dark:bg-gold-deep"
              >
                Start Chatting
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LiveDemo />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint dark:text-white/40">
            What you can ask about
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={`/chat?topic=${encodeURIComponent(cat.label.split(" ")[0])}`}
                  className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold/40 hover:bg-gold-soft/25 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-white/5"
                >
                  <Icon size={19} className="text-campus-green dark:text-gold" />
                  <p className="mt-2.5 text-sm font-medium text-ink dark:text-white">{cat.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-faint dark:text-white/40">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-16 max-w-lg border-t border-border pt-6 text-xs leading-relaxed text-ink-faint dark:border-dark-border dark:text-white/30">
          SDIT SmartBot answers using information from SDIT&apos;s own
          knowledge base. For official or time-sensitive details, please
          confirm with the college administration.
        </p>
      </div>
    </AppShell>
  );
}