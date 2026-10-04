import { cn } from "@/utils/cn";

type LoadingProps = {
  message?: string;
  className?: string;
};

export function Loading({ message = "Carregando...", className }: LoadingProps) {
  return (
    <div className={cn("grid min-h-40 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-sm", className)}>
      <div className="flex flex-col items-center gap-3 text-sm font-semibold text-[var(--muted)]">
        <span className="size-8 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" />
        {message}
      </div>
    </div>
  );
}

export function LoadingCards({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <section className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="h-40 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm"
          key={index}
        >
          <div className="h-4 w-32 rounded bg-black/10" />
          <div className="mt-6 h-8 w-24 rounded bg-black/10" />
          <div className="mt-5 h-4 w-full rounded bg-black/10" />
        </div>
      ))}
    </section>
  );
}
