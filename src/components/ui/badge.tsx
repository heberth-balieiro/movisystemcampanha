import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "muted";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const variants: Record<BadgeVariant, string> = {
  default: "border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand-strong)]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  muted: "border-[var(--line)] bg-black/[0.03] text-[var(--muted)]",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold leading-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
