"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  labelColor?: string;
  className?: string;
}

export function CodeBlock({ code, label, labelColor = "#10b981", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-xl border border-border bg-bg/60 overflow-hidden", className)}>
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: labelColor }}>
            {label}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-fg-dim hover:text-fg transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-fg-muted">
        <code>{code}</code>
      </pre>
    </div>
  );
}
