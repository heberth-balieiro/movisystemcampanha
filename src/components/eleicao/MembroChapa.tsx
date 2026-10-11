"use client";

import { useState } from "react";

import { resolverApiMediaUrl } from "@/services/api";
import type { EleicaoChapaMembro } from "@/types/eleicao";

type Props = {
  membro: EleicaoChapaMembro;
};

type FotoProps = {
  membro: EleicaoChapaMembro;
  className?: string;
};

function obterIniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("") || "?";
}

function cargoEhPresidente(cargo?: string | null) {
  return Boolean(cargo?.toUpperCase().includes("PRESIDENTE") && !cargo?.toUpperCase().includes("VICE"));
}

function IconeCargo({ presidente }: { presidente: boolean }) {
  if (presidente) {
    return (
      <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
        <path d="M4 18.5 3 7l5 4 4-6 4 6 5-4-1 11.5H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 19c.8-3.4 3-5.2 6.5-5.2s5.7 1.8 6.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SilhuetaMembro({ presidente }: { presidente: boolean }) {
  return (
    <svg aria-hidden="true" className="h-28 w-28 text-[var(--brand)] opacity-[0.16] sm:h-32 sm:w-32" viewBox="0 0 120 120" fill="none">
      {presidente ? (
        <>
          <circle cx="60" cy="31" r="19" fill="currentColor" />
          <path d="M29 108c2-28 13-44 31-44s29 16 31 44H29Z" fill="currentColor" />
          <path d="M44 66 60 82 76 66l9 42H35l9-42Z" fill="currentColor" fillOpacity="0.72" />
          <path d="m53 66 7 10 7-10-3 30h-8l-3-30Z" fill="white" fillOpacity="0.68" />
          <path d="M41 66 52 60l8 8-14 12-5-14Zm38 0-11-6-8 8 14 12 5-14Z" fill="white" fillOpacity="0.38" />
        </>
      ) : (
        <>
          <path d="M39 35c1-18 10-29 22-29 14 0 24 11 24 30 0 5-1 9-3 13-3-10-11-16-22-16-9 0-16 4-21 11V35Z" fill="currentColor" />
          <ellipse cx="60" cy="36" rx="18" ry="21" fill="currentColor" />
          <path d="M27 108c4-28 15-43 33-43 19 0 30 15 34 43H27Z" fill="currentColor" />
          <path d="M38 39c-3 12-6 22-13 30 9 2 17 0 23-4m34-26c3 12 6 22 13 30-9 2-17 0-23-4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M46 68c4 7 8 10 14 10s10-3 14-10l8 40H38l8-40Z" fill="currentColor" fillOpacity="0.72" />
        </>
      )}
    </svg>
  );
}

export function FotoMembroChapa({ membro, className = "size-16 sm:size-[72px]" }: FotoProps) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const fotoUrl = membro.tem_foto === "S" ? resolverApiMediaUrl(membro.foto_url) : null;
  const exibirFoto = Boolean(fotoUrl) && !fotoFalhou;

  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white text-sm font-black text-[var(--brand)] shadow-sm ${className}`}>
      {exibirFoto ? (
        <img
          alt={`Foto de ${membro.nome}`}
          className="h-full w-full object-cover"
          decoding="async"
          loading="lazy"
          onError={() => setFotoFalhou(true)}
          referrerPolicy="no-referrer"
          src={fotoUrl ?? undefined}
        />
      ) : (
        <span aria-hidden="true" className="grid h-full w-full place-items-center bg-[var(--brand-soft)]">
          {obterIniciais(membro.nome)}
        </span>
      )}
    </div>
  );
}

export function MembroChapa({ membro }: Props) {
  const presidente = cargoEhPresidente(membro.cargo);

  return (
    <div className="relative flex min-w-0 items-center gap-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-3.5 sm:p-4">
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-2/5 bg-[radial-gradient(circle_at_bottom_right,var(--brand-soft),transparent_68%)] opacity-80" />

      <div className="relative z-20 grid size-16 shrink-0 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--brand-soft)] text-base font-black text-[var(--brand)] sm:size-[72px]">
        {obterIniciais(membro.nome)}
      </div>

      <div className="relative z-20 min-w-0 flex-1 pr-16 sm:pr-28">
        <div className="truncate text-sm font-black text-[var(--foreground)] sm:text-base">{membro.nome}</div>
        {membro.cargo ? (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)]/10 bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--brand-strong)] sm:text-xs">
            <IconeCargo presidente={presidente} />
            {membro.cargo}
          </div>
        ) : null}
        {membro.tipo ? <div className="mt-1.5 text-xs font-medium text-[var(--muted)]">{membro.tipo}</div> : null}
        {membro.observacao ? <div className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{membro.observacao}</div> : null}
      </div>

      <div className="pointer-events-none absolute -bottom-4 right-0 z-10 sm:right-2">
        <SilhuetaMembro presidente={presidente} />
      </div>
    </div>
  );
}
