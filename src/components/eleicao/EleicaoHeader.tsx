type EleicaoHeaderProps = {
  nomeEntidade?: string;
  logoUrl?: string | null;
  subtitulo?: string;
};

export function EleicaoHeader({ nomeEntidade, logoUrl, subtitulo }: EleicaoHeaderProps) {
  return (
    <header className="mb-5 flex flex-col items-center text-center sm:mb-7">
      {logoUrl ? (
        <div className="relative mb-3 size-16 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm sm:size-20">
          <img alt={nomeEntidade ? `Logo ${nomeEntidade}` : "Logo da entidade"} className="h-full w-full object-contain p-2" src={logoUrl} />
        </div>
      ) : (
        <div className="mb-3 grid size-14 place-items-center rounded-2xl border border-[var(--line)] bg-white text-lg font-black text-[var(--brand)] shadow-sm sm:size-16">
          CS
        </div>
      )}

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)] sm:text-xs">
        Sistema de Votação Digital
      </p>

      {nomeEntidade ? (
        <h1 className="mt-1.5 max-w-4xl text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-[2rem]">
          {nomeEntidade}
        </h1>
      ) : null}

      {subtitulo ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{subtitulo}</p> : null}
    </header>
  );
}
