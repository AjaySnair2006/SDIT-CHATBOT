"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectQuestion: (question: string) => void;
  onRetry: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  onSelectQuestion,
  onRetry,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return <WelcomeScreen onSelectQuestion={onSelectQuestion} />;
  }

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onRetry={
              message.isError && message.id === lastMessage.id
                ? onRetry
                : undefined
            }
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
