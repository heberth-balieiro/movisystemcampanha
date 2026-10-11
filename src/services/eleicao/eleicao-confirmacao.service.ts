import { apiFetch } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export type CanalConfirmacao = "WHATSAPP" | "EMAIL";
export type ContextoErroConfirmacao = "WHATSAPP" | "EMAIL" | "VALIDACAO";

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

export type CanaisConfirmacaoDados = {
  whatsapp_disponivel: boolean;
  whatsapp_destino: string | null;
  email_disponivel: boolean;
  email_destino: string | null;
};

export type CanaisConfirmacaoResponse = ApiResponse<CanaisConfirmacaoDados | null>;

const MENSAGENS_FUNCIONAIS_SEGURAS = [
  "código expirado",
  "codigo expirado",
  "código inválido",
  "codigo invalido",
  "código já utilizado",
  "codigo ja utilizado",
  "limite de tentativas",
  "limite de códigos",
  "limite de codigos",
  "aguarde antes",
  "aguarde para",
  "tente novamente mais tarde",
];

function normalizarMensagem(mensagem: string) {
  return mensagem.trim().toLowerCase();
}

function mensagemFuncionalSegura(mensagem?: string | null) {
  if (!mensagem) return null;

  const normalizada = normalizarMensagem(mensagem);
  const permitida = MENSAGENS_FUNCIONAIS_SEGURAS.some((trecho) =>
    normalizada.includes(trecho),
  );

  if (!permitida) return null;

  if (normalizada.includes("expirado")) {
    return "Código expirado. Solicite um novo código.";
  }

  if (normalizada.includes("inválido") || normalizada.includes("invalido")) {
    return "Código inválido. Verifique o código informado e tente novamente.";
  }

  if (normalizada.includes("já utilizado") || normalizada.includes("ja utilizado")) {
    return "Código já utilizado. Solicite um novo código.";
  }

  if (normalizada.includes("limite de tentativas")) {
    return "Limite de tentativas atingido. Aguarde antes de tentar novamente.";
  }

  if (
    normalizada.includes("aguarde") ||
    normalizada.includes("limite de códigos") ||
    normalizada.includes("limite de codigos") ||
    normalizada.includes("tente novamente mais tarde")
  ) {
    return "Aguarde antes de solicitar um novo código.";
  }

  return null;
}

export function getUserFriendlyConfirmationError(
  contexto: ContextoErroConfirmacao,
  mensagemTecnica?: string | null,
): string {
  const funcional = mensagemFuncionalSegura(mensagemTecnica);
  if (funcional) return funcional;

  if (contexto === "EMAIL") {
    return "Não foi possível enviar o código por e-mail. Tente novamente em alguns instantes.";
  }

  if (contexto === "VALIDACAO") {
    return "Não foi possível validar o código. Verifique o código informado e tente novamente.";
  }

  return "Não foi possível enviar o código pelo WhatsApp. Tente novamente ou utilize outro canal disponível.";
}

export async function consultarCanaisConfirmacao(
  slug: string,
  tokenIdentificacao: string,
): Promise<CanaisConfirmacaoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(
      `/api/v1/public/eleicao/${slugSeguro}/confirmacao/canais`,
      {
        method: "GET",
        token: tokenIdentificacao,
        cache: "no-store",
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
