import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  error,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]" role="presentation">
      <div aria-modal="true" className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-5 shadow-2xl sm:p-6" role="dialog">
        <h2 className="text-lg font-black tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800" role="alert">{error}</div> : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button disabled={isLoading} type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button disabled={isLoading} type="button" variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
