import { FotoMembroChapa, MembroChapa } from "@/components/eleicao/MembroChapa";
import type { EleicaoChapa } from "@/types/eleicao";

type Props = {
  chapa: EleicaoChapa;
  selected?: boolean;
  onClick?: () => void;
};

function numeroChapa(numero: number) {
  return String(numero).padStart(2, "0");
}

export function ChapaCard({ chapa, selected = false, onClick }: Props) {
  const representante =
    chapa.membros.find((membro) => membro.cargo?.toUpperCase().includes("PRESIDENTE") && membro.tem_foto === "S") ??
    chapa.membros.find((membro) => membro.tem_foto === "S") ??
    chapa.membros.find((membro) => membro.cargo?.toUpperCase().includes("PRESIDENTE"));

  const numero = numeroChapa(chapa.numero);

  return (
    <button
      aria-pressed={selected}
      className={`focus-ring group h-full w-full overflow-hidden rounded-[26px] border text-left transition ${
        selected
          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[0_20px_48px_-34px_rgba(15,23,42,0.52)]"
          : "border-[var(--line)] bg-white hover:-translate-y-0.5 hover:border-[var(--brand)]/50 hover:shadow-[0_20px_48px_-36px_rgba(15,23,42,0.45)]"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className={`h-1.5 ${selected ? "bg-[var(--brand)]" : "bg-gradient-to-r from-[var(--brand)]/70 to-[var(--accent)]/60"}`} />

      <div className="p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-[22px] border border-[var(--line)] bg-white px-4 py-5 sm:px-5 sm:py-6">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] sm:block">
            <div className="absolute -right-16 top-6 h-28 w-72 -rotate-6 rounded-[50%] bg-[var(--brand-soft)] opacity-85" />
            <div className="absolute -right-10 top-14 h-24 w-64 -rotate-6 rounded-[50%] border-[18px] border-[var(--brand)]/10" />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className="grid size-24 place-items-center rounded-full border-[3px] border-[var(--brand)]/30 bg-white/90 text-center shadow-sm">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-strong)]">Chapa</div>
                  <div className="mt-0.5 text-3xl font-black leading-none text-[var(--brand-strong)]">{numero}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4 sm:max-w-[68%]">
              {representante ? (
                <FotoMembroChapa membro={representante} className="size-24 rounded-[22px] sm:size-28" />
              ) : null}

              <div className="min-w-0 pt-0.5">
                <div className="inline-flex rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-strong)]">
                  Chapa {numero}
                </div>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">{chapa.nome}</h3>
                {chapa.slogan ? <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:text-base">{chapa.slogan}</p> : null}
                {representante ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)] sm:text-sm">
                    {representante.cargo || "Representante"}: {representante.nome}
                  </p>
                ) : null}
              </div>
            </div>

            <span
              aria-hidden="true"
              className={`grid size-8 shrink-0 place-items-center rounded-full border text-sm font-black transition sm:mr-1 ${
                selected
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)] shadow-sm"
                  : "border-[var(--line)] bg-white text-transparent group-hover:border-[var(--brand)]/50"
              }`}
            >
              ✓
            </span>
          </div>
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
