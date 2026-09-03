# SDIT SmartBot — Frontend

An AI-powered college information assistant for **Shree Devi Institute of
Technology (SDIT)**, Kenjar, Mangaluru, Karnataka — built for our college's
Tech Bot event.

This repo is the **frontend only**. It talks to a separate Python/FastAPI +
RAG backend over a REST API; it contains no AI/RAG logic itself.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- [lucide-react](https://lucide.dev/) icons
- Browser `fetch` for backend communication
- Web Speech API for optional voice input (client-side only, no dependency)

## Getting started

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000**.

## Environment setup

Copy the example env file and point it at your backend:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If this variable is missing, the app falls back to `http://localhost:8000`
automatically (see `lib/api.ts`).

## Backend requirement

The frontend expects a FastAPI backend running at `NEXT_PUBLIC_API_URL` with
one endpoint:

```
POST /ask
Content-Type: application/json

{ "question": "What courses are available at SDIT?" }
```

Expected response:

```json
{
  "answer": "SDIT offers several undergraduate and postgraduate programmes...",
  "category": "courses",
  "sources": ["SDIT Knowledge Base"]
}
```

`category` and `sources` are optional — the UI degrades gracefully without
them.

### Developing the UI before the backend exists

`lib/api.ts` has a `USE_MOCK` flag. Set it to `true` to get canned responses
with a realistic delay while your teammate builds the backend, then flip it
back to `false` (the default) to hit the real `/ask` endpoint.

## Folder structure

```
app/
  page.tsx            Landing page (hero + quick categories)
  chat/page.tsx        Chat interface (main feature)
  about/page.tsx        About page
  help/page.tsx          Help / FAQ page
  layout.tsx            Root layout, fonts, metadata
  globals.css            Design tokens, dark mode, markdown styling

components/
  AppShell.tsx          Sidebar + header + content wrapper used by every page
  Sidebar.tsx            Desktop rail / mobile drawer navigation
  Header.tsx              Top bar (menu toggle, clear chat, theme, language)
  ThemeToggle.tsx           Light/dark mode switch
  LanguageSelector.tsx        Language picker (English live; Kannada/Malayalam
                                 architecture in place, not yet translated)
  WelcomeScreen.tsx             Empty-state welcome + suggested questions
  SuggestedQuestions.tsx          Suggested question chips
  ChatWindow.tsx                    Scrollable message list, auto-scroll
  MessageBubble.tsx                   Single message (user/AI), markdown,
                                         copy button, sources, retry
  TypingIndicator.tsx                   "SDIT SmartBot is thinking..." animation
  SourceList.tsx                          Source badges under AI answers
  ChatInput.tsx                             Input bar, send, Enter/Shift+Enter
  VoiceButton.tsx                             Mic button (Web Speech API)

lib/
  api.ts               askSmartBot() — POST /ask, timeout, error handling
  markdown.tsx            Minimal safe markdown → React renderer (no
                             dangerouslySetInnerHTML)
  storage.ts                 Safe localStorage read/write for chat history

types/
  chat.ts             ChatMessage, ChatRequest, ChatResponse, ApiError
```

## Replacing the placeholder branding

No official SDIT logo, colors, or statistics are hard-coded — the UI uses a
generic graduation-cap icon as a placeholder mark. To use the real SDIT logo:

1. Add the file at `public/logo.png`.
2. Swap the `GraduationCap` icon in `components/Sidebar.tsx` (and anywhere
   else it appears) for an `<Image src="/logo.png" ... />`.

## Connecting to the real backend

1. Make sure `lib/api.ts` has `USE_MOCK = false` (default).
2. Set `NEXT_PUBLIC_API_URL` in `.env.local` to your backend's URL.
3. Run the FastAPI backend on that URL with a working `POST /ask` endpoint.
4. Start the frontend with `npm run dev` — it's already wired up.

## Notes

- Chat history is stored only in the browser (`localStorage`), per-device,
  with no account system.
- Dark mode, keyboard navigation, and visible focus states are built in.
- Voice input gracefully falls back to a message if the browser doesn't
  support the Web Speech API — it's never required to use the chatbot.
