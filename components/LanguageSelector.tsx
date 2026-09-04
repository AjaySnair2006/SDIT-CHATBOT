"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import {
  isLanguageCode,
  LANGUAGE_EVENT,
  LANGUAGE_LABELS,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from "@/lib/language";

const LANGUAGES: LanguageCode[] = ["en", "kn", "ml"];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguageCode(stored)) setLanguage(stored);
  }, []);

  const selectLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    setOpen(false);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(
      new CustomEvent<LanguageCode>(LANGUAGE_EVENT, { detail: nextLanguage })
    );
  };

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
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg dark:border-dark-border dark:bg-dark-surface"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang}>
                <button
                  role="option"
                  aria-selected={lang === language}
                  onClick={() => selectLanguage(lang)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  {LANGUAGE_LABELS[lang]}
                  {lang === language && (
                    <span className="text-[0.65rem] uppercase tracking-wide">
                      Selected
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
