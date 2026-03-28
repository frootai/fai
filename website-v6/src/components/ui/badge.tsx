import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color = "#6366f1", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        className
      )}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
