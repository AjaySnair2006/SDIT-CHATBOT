import { ChatMessage } from "@/types/chat";

const STORAGE_KEY = "sdit-smartbot-chat";

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    typeof v.timestamp === "number"
  );
}

/** Reads chat history from localStorage. Returns [] on any missing/corrupt data. */
export function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isChatMessage);
  } catch {
    // Corrupted data — start fresh rather than crashing the app.
    return [];
  }
}

/** Persists chat history. Fails silently if storage is unavailable/full. */
export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // e.g. storage full or disabled in this browser — non-critical.
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
