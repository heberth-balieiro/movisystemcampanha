import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function ButtonLink({ className, variant = "primary", size = "md", icon, fullWidth = false, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, fullWidth, className })} {...props}>
      {icon}
      {children}
    </Link>
  );
}
