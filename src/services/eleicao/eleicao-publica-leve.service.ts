import { apiFetch } from "@/services/api";
import { EleicaoPublicaNaoEncontradaError } from "@/services/eleicao/eleicao.service";
import type { EleicaoPublicaDados } from "@/types/eleicao";

function isMensagemNaoEncontrada(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("não encontrado") || normalized.includes("nao encontrado");
}

export async function buscarEleicaoPorSlugLeve(slug: string): Promise<EleicaoPublicaDados> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    const response = await apiFetch<EleicaoPublicaDados | null>(
      `/api/v1/public/eleicao/${slugSeguro}/leve`,
      {
        cache: "no-store",
        token: null,
      },
    );

    if (!response.dados) {
      throw new EleicaoPublicaNaoEncontradaError();
    }

    return response.dados;
  } catch (error) {
    if (error instanceof EleicaoPublicaNaoEncontradaError) {
      throw error;
    }

    if (error instanceof Error && isMensagemNaoEncontrada(error.message)) {
      throw new EleicaoPublicaNaoEncontradaError();
    }

    throw error;
  }
}
