import type { ReactNode } from "react";

import { EleicaoProvider } from "@/components/eleicao/EleicaoContext";
import { buscarEleicaoPorSlugLeve } from "@/services/eleicao/eleicao-publica-leve.service";
import type { EleicaoEntidade } from "@/types/eleicao";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugLayout({ children, params }: Props) {
  const { slug } = await params;
  let entidade: EleicaoEntidade | null = null;

  try {
    const dados = await buscarEleicaoPorSlugLeve(slug);
    entidade = dados.entidade;
  } catch {
    // A página filha continuará responsável pela mensagem de erro/slug inválido.
  }

  return <EleicaoProvider entidade={entidade}>{children}</EleicaoProvider>;
}
