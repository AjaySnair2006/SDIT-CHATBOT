export default function TypingIndicator() {
  return (
    <div
      className="flex max-w-[80%] animate-fadeIn items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 dark:border-dark-border dark:bg-dark-surface"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">SDIT SmartBot is thinking</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-faint [animation-delay:0ms] dark:bg-white/50" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-faint [animation-delay:160ms] dark:bg-white/50" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ink-faint [animation-delay:320ms] dark:bg-white/50" />
      </span>
      <span className="text-xs text-ink-faint dark:text-white/40">
        SDIT SmartBot is thinking...
      </span>
    </div>
  );
}
