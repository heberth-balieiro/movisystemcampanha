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
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-3.5">
      <FotoMembroChapa membro={membro} />

      <div className="min-w-0">
        <div className="truncate text-sm font-black text-[var(--foreground)] sm:text-base">{membro.nome}</div>
        {membro.cargo ? (
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand)]">{membro.cargo}</div>
        ) : null}
        {membro.tipo ? (
          <div className="mt-1 text-xs font-medium text-[var(--muted)]">{membro.tipo}</div>
        ) : null}
        {membro.observacao ? (
          <div className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{membro.observacao}</div>
        ) : null}
      </div>
    </div>
  );
}
