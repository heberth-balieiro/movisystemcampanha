type EleicaoHeaderProps = {
  nomeEntidade?: string;
  logoUrl?: string | null;
  subtitulo?: string;
};

export function EleicaoHeader({ nomeEntidade, logoUrl, subtitulo }: EleicaoHeaderProps) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/80 px-5 py-6 text-center shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] backdrop-blur sm:mb-8 sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--brand)]" />
      <div className="pointer-events-none absolute -left-20 -top-24 size-56 rounded-full bg-[var(--brand-soft)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />

      <div className="relative flex flex-col items-center">
        {logoUrl ? (
          <div className="mb-4 grid size-24 place-items-center overflow-hidden rounded-3xl border border-[var(--line)] bg-white p-2.5 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45)] sm:size-28">
            <img
              alt={nomeEntidade ? `Logo ${nomeEntidade}` : "Logo da entidade"}
              className="h-full w-full object-contain"
              src={logoUrl}
            />
          </div>
        ) : (
          <div className="mb-4 grid size-20 place-items-center rounded-3xl border border-[var(--line)] bg-white text-xl font-black text-[var(--brand)] shadow-sm">
            CS
          </div>
        )}

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--brand-strong)] sm:text-[11px]">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" />
          Sistema de Votação Digital
        </div>

        {nomeEntidade ? (
          <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl lg:text-[2.7rem]">
            {nomeEntidade}
          </h1>
        ) : null}

        {subtitulo ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            {subtitulo}
          </p>
        ) : null}
      </div>
    </header>
  );
}
