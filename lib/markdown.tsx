import React from "react";

/**
 * Minimal, dependency-free markdown renderer for AI chat responses.
 * Supports paragraphs, bullet lists, numbered lists, and **bold** text.
 * Never touches innerHTML — everything is built as React elements, so
 * there is no way for backend content to inject raw HTML/scripts.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
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
    blocks.push(<p key={`p-${blocks.length}`}>{renderInline(text, `p-${blocks.length}`)}</p>);
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0 || !listType) return;
    const Tag = listType;
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={Tag === "ul" ? "list-disc" : "list-decimal"}>
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
