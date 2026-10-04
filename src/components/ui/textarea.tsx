import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-28 w-full resize-y rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm shadow-sm transition",
        "placeholder:text-[var(--muted)] hover:border-[var(--brand)]/60 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
