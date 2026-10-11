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
    <svg aria-hidden="true" className="h-28 w-28 text-[var(--brand)] opacity-[0.08]" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="34" r="20" fill="currentColor" />
      {presidente ? (
        <>
          <path d="M28 105c3-27 14-42 32-42s29 15 32 42H28Z" fill="currentColor" />
          <path d="m51 65 9 12 9-12-4 31H55l-4-31Z" fill="white" fillOpacity="0.58" />
        </>
      ) : (
        <>
          <path d="M26 105c4-27 15-42 34-42 19 0 30 15 34 42H26Z" fill="currentColor" />
          <path d="M42 27c5-13 13-19 25-17 10 2 17 11 17 24-7-8-16-12-26-12-5 0-11 2-16 5Z" fill="currentColor" />
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
      <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--brand-soft)] text-base font-black text-[var(--brand)] sm:size-[72px]">
        {obterIniciais(membro.nome)}
      </div>

      <div className="relative z-10 min-w-0 flex-1 pr-16 sm:pr-24">
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

      <div className="pointer-events-none absolute -bottom-3 right-1">
        <SilhuetaMembro presidente={presidente} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_bottom_right,var(--brand-soft),transparent_68%)] opacity-70" />
    </div>
  );
}
