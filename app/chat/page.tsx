"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { ChatMessage, ApiError } from "@/types/chat";
import { askSmartBot } from "@/lib/api";
import { loadChatHistory, saveChatHistory, clearChatHistory } from "@/lib/storage";

const TOPIC_QUESTIONS: Record<string, string> = {
  Admissions: "What is the B.E. admission eligibility?",
  Courses: "What courses are available at SDIT?",
  Facilities: "What facilities are available on campus?",
  Placements: "Tell me about placement training.",
  Clubs: "What clubs are available for students?",
  Research: "What research opportunities are available at SDIT?",
};

function makeMessage(
  role: ChatMessage["role"],
  content: string,
  extra: Partial<ChatMessage> = {}
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}

function ChatPageInner() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prefill, setPrefill] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const lastFailedQuestion = useRef<string | null>(null);
  const searchParams = useSearchParams();

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setMessages(loadChatHistory());
    setHydrated(true);
  }, []);

  // Persist whenever messages change (after initial hydration).
  useEffect(() => {
    if (hydrated) saveChatHistory(messages);
  }, [messages, hydrated]);

  // Quick-topic links (?topic=Courses) prefill the input instead of forcing a send.
  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic && TOPIC_QUESTIONS[topic]) {
      setPrefill(TOPIC_QUESTIONS[topic]);
    }
  }, [searchParams]);

  const sendMessage = async (question: string) => {
    setMessages((prev) => [...prev, makeMessage("user", question)]);
    setIsLoading(true);
    lastFailedQuestion.current = null;

    try {
      const res = await askSmartBot(question);
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", res.answer, {
          category: res.category,
          sources: res.sources,
        }),
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      lastFailedQuestion.current = question;
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", message, { isError: true }),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    const question = lastFailedQuestion.current;
    if (!question) return;
    // Drop the trailing error bubble before re-attempting.
    setMessages((prev) => prev.slice(0, -1));
    setIsLoading(true);
    try {
      const res = await askSmartBot(question);
      lastFailedQuestion.current = null;
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", res.answer, {
          category: res.category,
          sources: res.sources,
        }),
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", message, { isError: true }),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    clearChatHistory();
    lastFailedQuestion.current = null;
  };

  return (
    <AppShell
      fixedHeight
      onNewChat={handleNewChat}
      renderHeader={(openMenu) => (
        <Header
          onMenuClick={openMenu}
          onClearChat={handleNewChat}
          showClear={messages.length > 0}
        />
      )}
    >
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSelectQuestion={sendMessage}
        onRetry={handleRetry}
      />
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        externalValue={prefill}
      />
    </AppShell>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
