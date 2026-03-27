"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DocContent({ content }: { content: string }) {
  return (
    <article className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mt-10 prose-h3:text-lg prose-a:text-froot-amber prose-a:no-underline hover:prose-a:underline prose-code:text-froot-gold prose-code:bg-froot-amber/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d0d14] prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-table:text-[13px] prose-th:text-froot-amber prose-th:text-left prose-blockquote:border-froot-amber/30 prose-blockquote:text-muted-foreground">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  );
}
