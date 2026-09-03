"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  disabled?: boolean;
}

// The Web Speech API isn't in the standard TS DOM lib, so we type it loosely.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export default function VoiceButton({ onResult, disabled }: VoiceButtonProps) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [showUnsupported, setShowUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition)) ||
      null;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition: SpeechRecognitionLike = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) onResult(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onResult]);

  const toggleListening = () => {
    if (!supported) {
      setShowUnsupported(true);
      setTimeout(() => setShowUnsupported(false), 2500);
      return;
    }
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={
          listening ? "Stop voice input" : "Start voice input"
        }
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          listening
            ? "bg-danger/10 text-danger"
            : "text-ink-soft hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
        }`}
      >
        {listening ? <MicOff size={17} /> : <Mic size={17} />}
      </button>
      {showUnsupported && (
        <div
          role="status"
          className="absolute bottom-11 right-0 w-48 rounded-lg border border-border bg-surface px-3 py-2 text-[0.7rem] text-ink-soft shadow-lg dark:border-dark-border dark:bg-dark-surface dark:text-white/70"
        >
          Voice input isn&apos;t supported in this browser. Try Chrome or
          Edge, or type your question instead.
        </div>
      )}
    </div>
  );
}
