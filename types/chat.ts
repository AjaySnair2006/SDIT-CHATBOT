export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  category?: string;
  sources?: string[];
  isError?: boolean;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  category?: string;
  sources?: string[];
}

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "server"
  | "invalid_response"
  | "empty_question";

export class ApiError extends Error {
  kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = "ApiError";
  }
}
