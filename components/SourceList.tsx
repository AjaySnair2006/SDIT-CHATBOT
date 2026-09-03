import { FileText } from "lucide-react";

export default function SourceList({ sources }: { sources: string[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 border-t border-border/70 pt-2.5 dark:border-white/10">
      <p className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-ink-faint dark:text-white/40">
        Sources
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((source, i) => (
          <span
            key={`${source}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-2.5 py-1 text-[0.7rem] text-ink-soft dark:border-dark-border dark:bg-dark-bg dark:text-white/60"
          >
            <FileText size={11} />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}
