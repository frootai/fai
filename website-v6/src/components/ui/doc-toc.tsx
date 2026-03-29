"use client";

import { useEffect, useState } from "react";
import { List, X, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Extract headings from the rendered article
  useEffect(() => {
    const poll = () => {
      const article = document.querySelector("article");
      if (!article) return;
      const headings = article.querySelectorAll("h1, h2, h3");
      const tocItems: TocItem[] = [];
      headings.forEach((h) => {
        const id = h.id;
        const text = h.textContent || "";
        const level = parseInt(h.tagName[1]);
        if (id && text) tocItems.push({ id, text, level });
      });
      if (tocItems.length > 0) setItems(tocItems);
    };
    poll();
    // Retry once after render in case headings aren't there yet
    const timer = setTimeout(poll, 500);
    return () => clearTimeout(timer);
  }, []);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  const tocContent = (
    <nav>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const indent = item.level === 1 ? 0 : item.level === 2 ? 12 : 24;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMobileOpen(false)}
            style={{ paddingLeft: `${indent + 12}px` }}
            className={`
              group flex items-center gap-1.5 py-[7px] pr-3 text-[11.5px] leading-tight border-l-2 transition-all duration-200 cursor-pointer
              ${item.level === 1 ? "font-bold text-[12px]" : ""}
              ${item.level === 2 ? "font-semibold" : ""}
              ${item.level === 3 ? "font-normal" : ""}
              ${isActive
                ? "text-emerald border-emerald bg-emerald/[0.08]"
                : "text-[#94a3b8] border-transparent hover:text-white hover:bg-white/[0.07] hover:border-white/40"
              }
            `}
          >
            {isActive && <ChevronRight className="h-3 w-3 shrink-0 text-emerald" />}
            <span className="truncate">{item.text}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden xl:block fixed top-20 right-[max(1rem,calc((100vw-80rem)/2))] w-56 z-30">
        <div className="rounded-xl border border-border-subtle/50 bg-bg-surface/60 backdrop-blur-xl p-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald mb-2 px-3">On this page</p>
          <div className="h-px bg-gradient-to-r from-emerald/20 via-border to-transparent mb-2" />
          {tocContent}
        </div>
      </aside>

      {/* Mobile: floating button */}
      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-12 h-12 rounded-full bg-emerald text-white shadow-lg shadow-emerald/25 flex items-center justify-center cursor-pointer hover:bg-emerald/90 transition-all duration-200 hover:scale-105"
          aria-label="Table of contents"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-bg/95 backdrop-blur-2xl border-l border-border-subtle p-4 pt-20 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald mb-2">On this page</p>
            <div className="h-px bg-gradient-to-r from-emerald/20 via-border to-transparent mb-3" />
            {tocContent}
          </div>
        </div>
      )}
    </>
  );
}
