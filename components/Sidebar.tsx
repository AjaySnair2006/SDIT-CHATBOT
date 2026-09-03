"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  MessageSquare,
  Info,
  HelpCircle,
  Plus,
  X,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  FlaskConical,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNewChat?: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/about", label: "About", icon: Info },
  { href: "/feedback", label: "Feedback & Grievances", icon: ShieldAlert },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const QUICK_TOPICS = [
  { label: "Admissions", icon: GraduationCap },
  { label: "Courses", icon: BookOpen },
  { label: "Facilities", icon: Building2 },
  { label: "Placements", icon: Briefcase },
  { label: "Clubs", icon: Users },
  { label: "Research", icon: FlaskConical },
];

export default function Sidebar({ open, onClose, onNewChat }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-gold dark:bg-dark-surface">
            <GraduationCap size={20} strokeWidth={2} />
          </span>
          <span className="font-serif text-[1.05rem] font-semibold leading-tight text-ink dark:text-white">
            SDIT SmartBot
          </span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-ink-soft hover:bg-black/5 lg:hidden dark:text-white/70 dark:hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {onNewChat && (
        <div className="px-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
      )}

      <nav className="mt-5 flex flex-col gap-0.5 px-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "border-gold bg-gold-soft/60 font-medium text-ink dark:bg-white/10 dark:text-white"
                  : "border-transparent text-ink-soft hover:bg-black/[0.03] hover:text-ink dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.25 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint dark:text-white/40">
          Quick topics
        </p>
        <ul className="mt-2.5 space-y-0.5">
          {QUICK_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <li key={topic.label}>
                <Link
                  href={`/chat?topic=${encodeURIComponent(topic.label)}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.85rem] text-ink-soft transition-colors hover:bg-black/[0.03] hover:text-ink dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Icon size={15} />
                  {topic.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto px-5 py-5">
        <p className="text-[0.7rem] leading-relaxed text-ink-faint dark:text-white/35">
          Shree Devi Institute of Technology
          <br />
          Kenjar, Mangaluru, Karnataka
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-surface lg:block dark:border-dark-border dark:bg-dark-surface">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <div className="relative z-50 h-full w-72 animate-slideIn bg-surface shadow-xl dark:bg-dark-surface">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
