import { ArrowUpRight } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What courses are available at SDIT?",
  "What is the B.E. admission eligibility?",
  "What facilities are available on campus?",
  "Tell me about placement training.",
  "What clubs are available for students?",
];

export default function SuggestedQuestions({
  onSelect,
}: {
  onSelect: (question: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {SUGGESTED_QUESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:border-gold/40 hover:bg-gold-soft/30 hover:text-ink dark:border-dark-border dark:bg-dark-surface dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
        >
          {q}
          <ArrowUpRight
            size={15}
            className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold dark:text-white/30"
          />
        </button>
      ))}
    </div>
  );
}
