import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { PillLink } from "@/components/ui/pill-link";

interface PageShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  backLabel?: string;
  backHref?: string;
  bottomLinks?: { label: string; href: string; color: string }[];
  className?: string;
}

export function PageShell({
  title, subtitle, badge, badgeColor, children,
  backLabel, backHref, bottomLinks, className,
}: PageShellProps) {
  return (
    <div className={cn("mx-auto max-w-5xl px-4 lg:px-6 py-12 sm:py-16", className)}>
      <SectionHeader title={title} subtitle={subtitle} badge={badge} badgeColor={badgeColor} />

      {children}

      {/* Bottom navigation */}
      {bottomLinks && bottomLinks.length > 0 && (
        <div className="mt-14 flex flex-wrap justify-center gap-2">
          {bottomLinks.map((l) => (
            <PillLink key={l.href} href={l.href} color={l.color}>{l.label}</PillLink>
          ))}
        </div>
      )}

      {backLabel && backHref && (
        <div className="mt-10 text-center">
          <Link href={backHref} className="text-[13px] font-medium text-amber hover:underline">
            ← {backLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
