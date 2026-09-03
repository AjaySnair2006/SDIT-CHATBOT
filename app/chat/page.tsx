"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Loader2,
  Sparkles,
  User,
  ShieldAlert,
} from "lucide-react";

import AppShell from "@/components/AppShell";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  category?: string;
  sources?: string[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! 👋 I’m SDIT SmartBot. Ask me anything about admissions, courses, campus facilities, placements, clubs, research, or student life.",
      category: "Welcome",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Read topic from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (topic) {
      setInput(`Tell me about ${topic}`);
    }
  }, []);

  // Send question to backend
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.answer ||
          "I couldn't find an answer to that question.",
        category: data.category,
        sources: Array.isArray(data.sources)
          ? data.sources
          : [],
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm unable to connect to the SDIT SmartBot server right now. Please make sure the backend is running and try again.",
          category: "Connection Error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What courses are available?",
    "How can I apply for admission?",
    "Tell me about placements",
    "What facilities are available?",
    "How do I submit a grievance or complaint?",
    "How do I give campus feedback?",
  ];

  const askQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#f7f8f5] text-[#17382b]">

        {/* ================================
            HEADER
        ================================= */}

        <header className="sticky top-0 z-30 border-b border-[#e3e8e2] bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6">

            <div className="flex items-center gap-3">

              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e7e1] bg-white text-[#53615a] transition hover:border-[#d9b24c] hover:bg-[#fffaf0]"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff8f2] text-[#258355]">
                    <Bot size={17} />
                  </div>

                  <h1 className="text-sm font-bold text-[#17382b] sm:text-base">
                    SDIT SmartBot
                  </h1>

                </div>

                <div className="ml-10 mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2cad68]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#89948e]">
                    AI Campus Assistant
                  </span>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/feedback"
                className="flex items-center gap-1.5 rounded-xl border border-[#e2e7e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#445249] transition hover:border-[#d9b24c] hover:bg-[#fffaf0] hover:text-[#17382b]"
              >
                <ShieldAlert size={14} className="text-[#c93e23]" />
                <span className="hidden sm:inline">Grievance &amp; Feedback</span>
              </Link>

              <span className="hidden sm:flex rounded-full border border-[#e2e8e2] bg-[#fafbf9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#7d8982]">
                SDIT Knowledge Base
              </span>
            </div>

          </div>
        </header>


        {/* ================================
            CHAT CONTENT
        ================================= */}

        <main className="mx-auto max-w-4xl px-4 pb-44 pt-8 sm:px-6">

          {/* Welcome */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e2e8e1] bg-white text-[#258355] shadow-sm">
              <Sparkles size={24} />
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-[#17382b] sm:text-3xl">
              Ask SDIT SmartBot
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#89948e]">
              Get quick answers about Shree Devi Institute of Technology,
              campus life, courses, admissions, placements, and more.
            </p>

          </div>


          {/* ================================
              QUICK QUESTIONS
          ================================= */}

          {messages.length === 1 && (
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askQuickQuestion(question)}
                  className="group flex items-center justify-between rounded-xl border border-[#e1e6df] bg-white px-4 py-3.5 text-left text-sm text-[#46534c] shadow-[0_4px_18px_rgba(23,56,43,0.03)] transition hover:-translate-y-0.5 hover:border-[#d9b24c] hover:bg-[#fffdf8]"
                >
                  <span>{question}</span>

                  <ArrowUp
                    size={15}
                    className="rotate-45 text-[#a5aea8] transition group-hover:text-[#258355]"
                  />
                </button>
              ))}

            </div>
          )}


          {/* ================================
              MESSAGES
          ================================= */}

          <div className="space-y-5">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {/* AI ICON */}

                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff8f2] text-[#258355]">
                    <Bot size={18} />
                  </div>
                )}


                {/* MESSAGE */}

                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3.5
                    ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#173c2d] text-white"
                        : "rounded-bl-md border border-[#e1e6df] bg-white text-[#394740] shadow-[0_4px_18px_rgba(23,56,43,0.035)]"
                    }
                  `}
                >

                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </p>


                  {/* Category */}

                  {message.category && (
                    <div
                      className={`
                        mt-3 border-t pt-2 text-[9px] uppercase tracking-[0.1em]
                        ${
                          message.role === "user"
                            ? "border-white/10 text-white/60"
                            : "border-[#edf0ec] text-[#98a19c]"
                        }
                      `}
                    >
                      {message.category}
                    </div>
                  )}


                  {/* Sources */}

                  {message.sources &&
                    message.sources.length > 0 && (
                      <div className="mt-3 border-t border-[#edf0ec] pt-3">

                        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8d9891]">
                          Sources
                        </p>

                        <div className="space-y-1">
                          {message.sources.map(
                            (source, index) => (
                              <p
                                key={index}
                                className="text-xs text-[#75817a]"
                              >
                                • {source}
                              </p>
                            )
                          )}
                        </div>

                      </div>
                    )}

                </div>


                {/* USER ICON */}

                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff4d9] text-[#b68725]">
                    <User size={17} />
                  </div>
                )}

              </div>
            ))}


            {/* LOADING */}

            {loading && (
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff8f2] text-[#258355]">
                  <Bot size={18} />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-[#e1e6df] bg-white px-4 py-3.5 shadow-sm">

                  <div className="flex items-center gap-2">

                    <Loader2
                      size={15}
                      className="animate-spin text-[#258355]"
                    />

                    <span className="text-sm text-[#89948e]">
                      SmartBot is thinking...
                    </span>

                  </div>

                </div>

              </div>
            )}

          </div>

        </main>


        {/* ================================
            FLOATING QUERY BAR
        ================================= */}

        <div className="fixed bottom-0 left-0 right-0 z-50 lg:left-[292px]">

          {/* Background fade */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f7f8f5] via-[#f7f8f5]/95 to-transparent" />


          {/* Input */}

          <div className="relative mx-auto w-full max-w-4xl px-4 pb-4 sm:px-6">

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-2xl border border-[#dce3dc] bg-white p-2 shadow-[0_10px_40px_rgba(23,56,43,0.15)]"
            >

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask SDIT SmartBot anything..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#17382b] outline-none placeholder:text-[#a0aaa4] disabled:cursor-not-allowed"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173c2d] text-white transition-all hover:bg-[#20543f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowUp size={19} />
                )}
              </button>

            </form>

            <p className="mt-2 text-center text-[8px] font-medium uppercase tracking-[0.12em] text-[#a0aaa4]">
              SDIT SmartBot • AI-powered campus assistance
            </p>

          </div>

        </div>

      </div>
    </AppShell>
  );
}