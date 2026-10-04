import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
    size === "sm" && "min-h-9 px-3 py-1.5 text-xs",
    size === "md" && "min-h-11 px-4 py-2 text-sm",
    size === "lg" && "min-h-12 px-5 py-3 text-base",
    fullWidth && "w-full",
    variant === "primary" && "bg-[var(--brand)] text-[var(--brand-contrast)] hover:bg-[var(--brand-strong)]",
    variant === "secondary" && "border border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--brand)]/60 hover:bg-[var(--brand-soft)]",
    variant === "ghost" && "shadow-none text-[var(--foreground)] hover:bg-black/[0.04]",
    variant === "danger" && "bg-[var(--danger)] text-white hover:brightness-90",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName({ variant, size, fullWidth, className })} type={type} {...props}>
      {icon}
      {children}
    </button>
  );
}
