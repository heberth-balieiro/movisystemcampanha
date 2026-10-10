import { apiFetch } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export type CanalConfirmacao = "WHATSAPP" | "EMAIL";

export type SolicitarCodigoContingenciaDados = {
  enviado: string;
  destino: string;
  canal: CanalConfirmacao;
  expira_em_segundos: number;
  reenviar_em_segundos: number;
  email_disponivel: boolean;
  email_destino: string | null;
};

export type SolicitarCodigoContingenciaResponse =
  ApiResponse<SolicitarCodigoContingenciaDados | null>;

export async function solicitarCodigoPorEmail(
  slug: string,
  tokenIdentificacao: string,
): Promise<SolicitarCodigoContingenciaResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(
      `/api/v1/public/eleicao/${slugSeguro}/confirmacao/solicitar-codigo-email`,
      {
        method: "POST",
        token: tokenIdentificacao,
        redirectOnUnauthorized: false,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return {
        erro: true,
        mensagem: error.message,
        dados: null,
      };
    }

    throw error;
  }
}
