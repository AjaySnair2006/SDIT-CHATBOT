"use client";

import { useState } from "react";
import { Languages } from "lucide-react";

// Architecture note: only English ships in v1. The list below is where
// Kannada and Malayalam get added once translated strings exist; wiring
// a translation string table can happen without touching this component.
const LANGUAGES = [
  { code: "en", label: "English", available: true },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", available: false },
  { code: "ml", label: "മലയാളം (Malayalam)", available: false },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
      >
        <Languages size={17} />
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-10 cursor-default"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg dark:border-dark-border dark:bg-dark-surface"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  role="option"
                  aria-selected={lang.code === "en"}
                  disabled={!lang.available}
                  onClick={() => setOpen(false)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    lang.available
                      ? "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      : "cursor-not-allowed text-ink-faint dark:text-white/30"
                  }`}
                >
                  {lang.label}
                  {!lang.available && (
                    <span className="text-[0.65rem] uppercase tracking-wide">
                      Soon
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
