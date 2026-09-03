import React from "react";

/**
 * Minimal, dependency-free markdown renderer for AI chat responses.
 * Supports paragraphs, bullet lists, numbered lists, **bold** text,
 * clickable links [label](url), and interactive Google Maps [map:url|title].
 * Never touches innerHTML — everything is built as React elements, so
 * there is no way for backend content to inject raw HTML/scripts.
 */

function renderMap(
  embedUrl: string,
  key: string,
  label: string = "Shree Devi Institute of Technology (SDIT), Kenjar, Mangaluru"
) {
  const directLink =
    "https://www.google.com/maps/search/?api=1&query=Shree+Devi+Institute+of+Technology+Kenjar+Mangaluru";

  return (
    <div
      key={key}
      className="my-3 overflow-hidden rounded-xl border border-border bg-paper shadow-sm dark:border-dark-border dark:bg-dark-bg"
    >
      <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2 text-xs font-medium text-ink dark:border-dark-border dark:bg-dark-surface dark:text-white">
        <span className="flex items-center gap-1.5 truncate">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          {label}
        </span>
        <a
          href={directLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex shrink-0 items-center gap-1 font-medium text-gold hover:underline"
        >
          Open in Google Maps ↗
        </a>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height="240"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={label}
        className="w-full border-0"
      />
    </div>
  );
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Matches **bold text** or [link text](url)
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex).filter(Boolean);

  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;

    // Bold match
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    // Link match: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith("http://") || url.startsWith("https://");
      return (
        <a
          key={key}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-gold hover:underline inline-flex items-center gap-0.5"
        >
          {label}
          {isExternal && <span aria-hidden="true" className="text-[0.75em]">↗</span>}
        </a>
      );
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

export function renderMarkdown(content: string): React.ReactNode {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join(" ");
    blocks.push(
      <p key={`p-${blocks.length}`}>{renderInline(text, `p-${blocks.length}`)}</p>
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0 || !listType) return;
    const Tag = listType;
    blocks.push(
      <Tag
        key={`list-${blocks.length}`}
        className={Tag === "ul" ? "list-disc" : "list-decimal"}
      >
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for interactive Google Map embed tag: [map:URL] or [map:URL|Title]
    const mapMatch = line.match(/^\[map:([^\]|]+)(?:\|([^\]]+))?\]$/i);
    if (mapMatch) {
      flushParagraph();
      flushList();
      const [, embedUrl, label] = mapMatch;
      blocks.push(
        renderMap(
          embedUrl.trim(),
          `map-${blocks.length}`,
          label ? label.trim() : undefined
        )
      );
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.*)/);

    if (bulletMatch) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(bulletMatch[1]);
      continue;
    }

    if (numberedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(numberedMatch[1]);
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}
