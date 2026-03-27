import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  backLink?: { label: string; href: string };
  className?: string;
}

export function PageShell({ title, subtitle, badge, badgeColor = "#6366f1", children, backLink, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto max-w-5xl px-4 lg:px-6 py-12 sm:py-16", className)}>
      {/* Header */}
      <div className="text-center mb-10">
        {badge && (
          <div
            className="inline-block px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3"
            style={{ borderColor: `${badgeColor}33`, color: badgeColor, background: `${badgeColor}08` }}
          >
            {badge}
          </div>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-[14px] text-fg-muted max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      </div>

      {/* Content */}
      {children}

      {/* Back link */}
      {backLink && (
        <div className="mt-12 text-center">
          <Link href={backLink.href}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--froot-amber)] hover:underline transition-colors">
            ← {backLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}
