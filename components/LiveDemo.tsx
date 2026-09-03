"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, User } from "lucide-react";

const SCRIPT = [
  {
    question: "What is the B.E. admission eligibility?",
    answer:
      "You'll need a pass in PUC/12th with Physics, Chemistry, and Mathematics, plus a valid KCET or COMEDK rank.",
    source: "Admissions Handbook",
  },
  {
    question: "Tell me about placement training.",
    answer:
      "SDIT runs aptitude, coding, and mock-interview sessions from the 3rd semester onward, led by the Training & Placement Cell.",
    source: "Placement Cell",
  },
  {
    question: "What clubs are available for students?",
    answer:
      "There's IEEE SB, a coding club, robotics, NSS, and cultural clubs — most run open recruitment at the start of each year.",
    source: "Student Affairs",
  },
];

type Phase = "typing-q" | "thinking" | "typing-a" | "hold" | "erasing";

const TYPE_MS = 32;
const ERASE_MS = 14;
const THINK_MS = 700;
const HOLD_MS = 2200;

export default function LiveDemo() {
  const [pairIndex, setPairIndex] = useState(0);
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing-q");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotionRef.current) {
      setQText(SCRIPT[0].question);
      setAText(SCRIPT[0].answer);
      setPhase("hold");
      return;
    }

    const current = SCRIPT[pairIndex];

    const step = () => {
      if (phase === "typing-q") {
        if (qText.length < current.question.length) {
          setQText(current.question.slice(0, qText.length + 1));
          timeoutRef.current = setTimeout(step, TYPE_MS);
        } else {
          setPhase("thinking");
          timeoutRef.current = setTimeout(step, THINK_MS);
        }
      } else if (phase === "thinking") {
        setPhase("typing-a");
        timeoutRef.current = setTimeout(step, TYPE_MS);
      } else if (phase === "typing-a") {
        if (aText.length < current.answer.length) {
          setAText(current.answer.slice(0, aText.length + 1));
          timeoutRef.current = setTimeout(step, TYPE_MS);
        } else {
          setPhase("hold");
          timeoutRef.current = setTimeout(step, HOLD_MS);
        }
      } else if (phase === "hold") {
        setPhase("erasing");
        timeoutRef.current = setTimeout(step, ERASE_MS);
      } else if (phase === "erasing") {
        if (aText.length > 0) {
          setAText(aText.slice(0, -1));
          timeoutRef.current = setTimeout(step, ERASE_MS);
        } else if (qText.length > 0) {
          setQText(qText.slice(0, -1));
          timeoutRef.current = setTimeout(step, ERASE_MS);
        } else {
          setPairIndex((p) => (p + 1) % SCRIPT.length);
          setPhase("typing-q");
          timeoutRef.current = setTimeout(step, 300);
        }
      }
    };

    timeoutRef.current = setTimeout(step, TYPE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qText, aText, phase, pairIndex]);

  const current = SCRIPT[pairIndex];
  const showAnswerBubble = phase !== "typing-q";
  const isThinking = phase === "thinking";

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur dark:border-dark-border dark:bg-dark-surface/95"
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-border/70 pb-3 dark:border-white/10">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-gold dark:bg-white/10">
          <GraduationCap size={13} />
        </span>
        <span className="text-xs font-medium text-ink dark:text-white">
          SDIT SmartBot
        </span>
        <span className="ml-auto flex items-center gap-1 text-[0.65rem] text-campus-green dark:text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-campus-green dark:bg-gold" />
          Live
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-end">
          <div className="flex max-w-[85%] items-start gap-1.5">
            <div className="min-h-[1.75rem] rounded-xl rounded-tr-sm bg-ink px-3 py-1.5 text-[0.78rem] leading-snug text-white dark:bg-gold-deep">
              {qText}
              {phase === "typing-q" && (
                <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-white/70 align-middle" />
              )}
            </div>
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 text-ink-soft dark:bg-white/10 dark:text-white/60">
              <User size={11} />
            </span>
          </div>
        </div>

        {showAnswerBubble && (
          <div className="flex justify-start">
            {isThinking ? (
              <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-border bg-paper px-3 py-2 dark:border-dark-border dark:bg-dark-bg">
                <span className="h-1 w-1 animate-blink rounded-full bg-ink-faint [animation-delay:0ms] dark:bg-white/50" />
                <span className="h-1 w-1 animate-blink rounded-full bg-ink-faint [animation-delay:160ms] dark:bg-white/50" />
                <span className="h-1 w-1 animate-blink rounded-full bg-ink-faint [animation-delay:320ms] dark:bg-white/50" />
              </div>
            ) : (
              <div className="max-w-[90%] rounded-xl rounded-tl-sm border border-border bg-paper px-3 py-2 text-[0.78rem] leading-snug text-ink dark:border-dark-border dark:bg-dark-bg dark:text-white/90">
                {aText}
                {phase === "typing-a" && (
                  <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-ink/50 align-middle dark:bg-white/50" />
                )}
                {aText.length === current.answer.length && (
                  <p className="mt-1.5 border-t border-border/70 pt-1.5 text-[0.63rem] text-ink-faint dark:border-white/10 dark:text-white/35">
                    Source: {current.source}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}