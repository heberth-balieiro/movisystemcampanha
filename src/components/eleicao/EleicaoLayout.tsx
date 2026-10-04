"use client";

import type { CSSProperties, ReactNode } from "react";

import { imagemBase64 } from "@/lib/image";
import { useEleicaoEntidade } from "@/components/eleicao/EleicaoContext";
import { ConectividadeAviso } from "@/components/eleicao/ConectividadeAviso";
import { EleicaoFooter } from "@/components/eleicao/EleicaoFooter";
import { EleicaoHeader } from "@/components/eleicao/EleicaoHeader";
import { Card, CardContent } from "@/components/ui/card";

type EleicaoLayoutProps = {
  children: ReactNode;
  nomeEntidade?: string;
  logoUrl?: string | null;
  subtitulo?: string;
  corPrimaria?: string | null;
  corSecundaria?: string | null;
  email?: string | null;
  telefone?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  maxWidthClass?: string;
};

type EleicaoStyle = CSSProperties & {
  "--brand"?: string;
  "--brand-contrast"?: string;
  "--accent"?: string;
};


function getBrandContrast(cor?: string | null) {
  if (!cor) return undefined;
  const valor = cor.trim();
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(valor);
  if (!match) return undefined;

  const hex = match[1].length === 3 ? match[1].split("").map((c) => c + c).join("") : match[1];
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.62 ? "#17211e" : "#ffffff";
}

export function EleicaoLayout({
  children,
  nomeEntidade,
  logoUrl,
  subtitulo,
  corPrimaria,
  corSecundaria,
  email,
  telefone,
  instagramUrl,
  facebookUrl,
  youtubeUrl,
  maxWidthClass = "max-w-6xl",
}: EleicaoLayoutProps) {
  const entidade = useEleicaoEntidade();
  const nomeFinal = nomeEntidade ?? entidade?.nome_exibicao;
  const logoFinal = logoUrl ?? imagemBase64(entidade?.logo);
  const corPrimariaFinal = corPrimaria ?? entidade?.cor_primaria;
  const corSecundariaFinal = corSecundaria ?? entidade?.cor_secundaria;
  const emailFinal = email ?? entidade?.email;
  const telefoneFinal = telefone ?? entidade?.telefone;
  const instagramFinal = instagramUrl ?? entidade?.url_instagram;
  const facebookFinal = facebookUrl ?? entidade?.url_facebook;
  const youtubeFinal = youtubeUrl ?? entidade?.url_youtube;
  const brandContrast = getBrandContrast(corPrimariaFinal);

  const style: EleicaoStyle = {
    ...(corPrimariaFinal ? { "--brand": corPrimariaFinal } : {}),
    ...(brandContrast ? { "--brand-contrast": brandContrast } : {}),
    ...(corSecundariaFinal ? { "--accent": corSecundariaFinal } : {}),
  };

  return (
    <main className="election-shell min-h-screen px-3 py-4 sm:px-5 sm:py-7 lg:px-6 lg:py-8" style={style}>
      <div className={`mx-auto flex min-h-[calc(100vh-32px)] w-full ${maxWidthClass} flex-col sm:min-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-64px)]`}>
        <EleicaoHeader
          nomeEntidade={nomeFinal}
          logoUrl={logoFinal}
          subtitulo={subtitulo}
        />
        <ConectividadeAviso />
        <Card className="overflow-hidden rounded-2xl border-[var(--line)] bg-white/95 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.42)] backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">{children}</CardContent>
        </Card>
        <div className="mt-auto">
          <EleicaoFooter
            email={emailFinal}
            telefone={telefoneFinal}
            instagramUrl={instagramFinal}
            facebookUrl={facebookFinal}
            youtubeUrl={youtubeFinal}
          />
        </div>
      </div>
    </main>
  );
}
