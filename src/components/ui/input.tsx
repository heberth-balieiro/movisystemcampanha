import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm shadow-sm transition",
        "placeholder:text-[var(--muted)] hover:border-[var(--brand)]/60 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
