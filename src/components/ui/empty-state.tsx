import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/utils/cn";

type EmptyStateProps = {
  title?: string;
  message: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title = "Nenhum registro encontrado",
  message,
  icon = "box",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] p-6 text-center shadow-sm sm:p-8",
        className,
      )}
    >
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
        <Icon className="size-6" name={icon} />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{message}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
