"use client";

import { useState } from "react";

import { resolverApiMediaUrl } from "@/services/api";
import type { EleicaoChapaMembro } from "@/types/eleicao";

type Props = {
  membro: EleicaoChapaMembro;
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

export function MembroChapa({ membro }: Props) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const fotoUrl = membro.tem_foto === "S" ? resolverApiMediaUrl(membro.foto_url) : null;
  const exibirFoto = Boolean(fotoUrl) && !fotoFalhou;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--brand-soft)] text-xs font-black text-[var(--brand)]">
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
          <span aria-hidden="true">{obterIniciais(membro.nome)}</span>
        )}
      </div>
      <div className="min-w-0 text-sm">
        <div className="truncate font-semibold text-[var(--foreground)]">{membro.nome}</div>
        <div className="mt-0.5 text-xs font-medium text-[var(--muted)]">{membro.cargo}{membro.tipo ? ` • ${membro.tipo}` : ""}</div>
      </div>
    </div>
  );
}
