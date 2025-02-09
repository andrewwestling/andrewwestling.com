import React from "react";
import { marked } from "marked";

interface MarkdownProps {
  children: string;
  className?: string;
}

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function Markdown({ children, className = "" }: MarkdownProps) {
  // Parse markdown to HTML
  const html = marked(children);

  return (
    <span
      className={`markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
