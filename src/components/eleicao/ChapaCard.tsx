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
      className={`focus-ring h-full w-full rounded-2xl border p-4 text-left transition sm:p-5 ${
        selected
          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm"
          : "border-[var(--line)] bg-white hover:border-[var(--brand)]/50 hover:shadow-sm"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand)]">
            Chapa {String(chapa.numero).padStart(2, "0")}
          </div>
          <div className="mt-1 text-lg font-black tracking-tight">{chapa.nome}</div>
          {chapa.slogan ? <div className="mt-1 text-sm leading-5 text-[var(--muted)]">{chapa.slogan}</div> : null}
        </div>
        <span
          aria-hidden="true"
          className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
            selected ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)]" : "border-[var(--line)] bg-white text-transparent"
          }`}
        >
          ✓
        </span>
      </div>

      <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
        {chapa.membros.map((membro) => (
          <MembroChapa key={membro.id} membro={membro} />
        ))}
      </div>
    </button>
  );
}
