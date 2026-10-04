import type { SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm font-medium text-[var(--foreground)] shadow-sm transition",
        "hover:border-[var(--brand)]/60 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-[var(--muted)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
