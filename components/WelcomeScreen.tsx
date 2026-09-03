import { GraduationCap } from "lucide-react";
import SuggestedQuestions from "./SuggestedQuestions";

export default function WelcomeScreen({
  onSelectQuestion,
}: {
  onSelectQuestion: (question: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-gold dark:bg-white/10">
        <GraduationCap size={24} />
      </span>
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-white">
        Welcome to SDIT SmartBot
      </h2>
      <p className="mt-1.5 text-sm text-ink-soft dark:text-white/50">
        How can I help you today?
      </p>

      <div className="mt-7 w-full">
        <p className="mb-2.5 text-left text-xs font-medium uppercase tracking-wide text-ink-faint dark:text-white/40">
          Try asking
        </p>
        <SuggestedQuestions onSelect={onSelectQuestion} />
      </div>
    </div>
  );
}
