import { ApiError, ChatResponse } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 20000;

/**
 * Set to true to develop the UI before the backend exists.
 * Phase 5 of the build turns this off and talks to the real /ask endpoint.
 */
const USE_MOCK = true;

const MOCK_RESPONSES: Record<string, ChatResponse> = {
  default: {
    answer:
      "Thanks for your question! Once the SDIT SmartBot backend is running, I'll pull a real answer from the SDIT knowledge base. This is a mock response used during frontend development.",
    category: "general",
    sources: ["SDIT Knowledge Base (mock)"],
  },
};

function mockAsk(question: string): Promise<ChatResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESPONSES.default);
    }, 900 + Math.random() * 600);
  });
}

/**
 * Sends a question to the SDIT SmartBot backend (FastAPI + RAG).
 * POST {API_BASE_URL}/ask  ->  { answer, category?, sources? }
 */
export async function askSmartBot(question: string): Promise<ChatResponse> {
  const trimmed = question.trim();
  if (!trimmed) {
    throw new ApiError("empty_question", "Please enter a question.");
  }

  if (USE_MOCK) {
    return mockAsk(trimmed);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: trimmed }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "timeout",
        "SDIT SmartBot is taking too long to respond. Please try again."
      );
    }
    throw new ApiError(
      "network",
      "Sorry, I couldn't connect to the SDIT SmartBot server. Please try again."
    );
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new ApiError(
      "server",
      `SDIT SmartBot is temporarily unavailable (error ${response.status}). Please try again.`
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      "invalid_response",
      "Received an unexpected response from the server."
    );
  }

  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as Record<string, unknown>).answer !== "string"
  ) {
    throw new ApiError(
      "invalid_response",
      "Received an unexpected response from the server."
    );
  }

  const parsed = data as Record<string, unknown>;

  return {
    answer: parsed.answer as string,
    category:
      typeof parsed.category === "string" ? (parsed.category as string) : undefined,
    sources: Array.isArray(parsed.sources)
      ? (parsed.sources.filter((s) => typeof s === "string") as string[])
      : undefined,
  };
}
