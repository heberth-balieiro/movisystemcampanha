import { apiFetch } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export type EleitorContingencia = {
  id_usuario: number;
  nome: string;
  cpf: string;
  matricula: string;
  email: string;
  tem_whatsapp: boolean;
  ja_votou: boolean;
};

export type CodigoTemporarioGerado = {
  codigo: string;
  validade_segundos: number;
  expira_em: string;
};

export async function buscarEleitoresContingencia(
  slug: string,
  tokenAdmin: string,
  termo: string,
): Promise<ApiResponse<EleitorContingencia[]>> {
  const slugSeguro = encodeURIComponent(slug);
  const qs = termo.trim() ? `?q=${encodeURIComponent(termo.trim())}` : "";

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/contingencia/eleitores${qs}`, {
      method: "GET",
      token: tokenAdmin,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
  } catch (error) {
    return {
      erro: true,
      mensagem: error instanceof Error ? error.message : "Não foi possível localizar os eleitores.",
      dados: [],
    };
  }
}

export async function gerarCodigoTemporario(
  slug: string,
  tokenAdmin: string,
  idUsuario: number,
): Promise<ApiResponse<CodigoTemporarioGerado | null>> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(
      `/api/v1/eleicao/${slugSeguro}/admin/contingencia/eleitores/${idUsuario}/codigo-temporario`,
      {
        method: "POST",
        token: tokenAdmin,
        redirectOnUnauthorized: false,
      },
    );
  } catch (error) {
    return {
      erro: true,
      mensagem: error instanceof Error ? error.message : "Não foi possível gerar o código temporário.",
      dados: null,
    };
  }
}
