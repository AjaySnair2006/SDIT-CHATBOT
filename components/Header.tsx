"use client";

import { Menu, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

interface HeaderProps {
  onMenuClick: () => void;
  onClearChat?: () => void;
  showClear?: boolean;
}

export default function Header({
  onMenuClick,
  onClearChat,
  showClear,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:px-6 dark:border-dark-border dark:bg-dark-surface/90">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-ink-soft hover:bg-black/5 lg:hidden dark:text-white/70 dark:hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-serif text-base font-semibold leading-tight text-ink dark:text-white">
            SDIT SmartBot
          </h1>
          <p className="text-xs text-ink-faint dark:text-white/40">
            Your AI assistant for SDIT
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {showClear && onClearChat && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-black/5 hover:text-danger dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Clear conversation"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
