"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Expandable({ trigger, children, className }: ExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-xl border border-border bg-bg-surface overflow-hidden", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-bg-elevated transition-colors"
      >
        <ChevronRight
          className={cn("h-4 w-4 text-fg-dim transition-transform duration-200", open && "rotate-90")}
        />
        <div className="flex-1">{trigger}</div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
