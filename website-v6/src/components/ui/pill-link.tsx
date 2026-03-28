import Link from "next/link";
import { cn } from "@/lib/utils";

interface PillLinkProps {
  href: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function PillLink({ href, color = "#10b981", children, className, external }: PillLinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5",
    "text-[12px] font-semibold border",
    "transition-all duration-200 hover:-translate-y-0.5",
    className
  );
  const style = {
    color,
    borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
    background: `color-mix(in srgb, ${color} 5%, transparent)`,
  };
  const hoverStyle = {
    "--hover-bg": `color-mix(in srgb, ${color} 12%, transparent)`,
  } as React.CSSProperties;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={{ ...style, ...hoverStyle }}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={{ ...style, ...hoverStyle }}>
      {children}
    </Link>
  );
}
