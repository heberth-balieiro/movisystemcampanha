import { MembroChapa } from "@/components/eleicao/MembroChapa";
import type { EleicaoChapa } from "@/types/eleicao";

type Props = {
  chapa: EleicaoChapa;
  selected?: boolean;
  onClick?: () => void;
};

export function ChapaCard({ chapa, selected = false, onClick }: Props) {
  return (
    <button
      aria-pressed={selected}
      className={`focus-ring group h-full w-full overflow-hidden rounded-[24px] border text-left transition ${
        selected
          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[0_18px_45px_-32px_rgba(15,23,42,0.5)]"
          : "border-[var(--line)] bg-white hover:-translate-y-0.5 hover:border-[var(--brand)]/50 hover:shadow-[0_18px_45px_-34px_rgba(15,23,42,0.45)]"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className={`h-1.5 ${selected ? "bg-[var(--brand)]" : "bg-gradient-to-r from-[var(--brand)]/70 to-[var(--accent)]/60"}`} />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-strong)]">
              Chapa {String(chapa.numero).padStart(2, "0")}
            </div>
            <h3 className="mt-3 text-xl font-black tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl">{chapa.nome}</h3>
            {chapa.slogan ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{chapa.slogan}</p> : null}
          </div>

          <span
            aria-hidden="true"
            className={`grid size-8 shrink-0 place-items-center rounded-full border text-sm font-black transition ${
              selected
                ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm"
                : "border-[var(--line)] bg-white text-transparent group-hover:border-[var(--brand)]/50"
            }`}
          >
            ✓
          </span>
        </div>

        <div className="mt-5 space-y-3 border-t border-[var(--line)] pt-5">
          {chapa.membros.length > 0 ? (
            chapa.membros.map((membro) => <MembroChapa key={membro.id} membro={membro} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">
              Nenhum membro vinculado à chapa.
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
