import { apiFetch } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export type EleicaoEmailConfig = {
  ativo: boolean;
  smtp_host: string;
  smtp_porta: number;
  seguranca: "STARTTLS" | "SSL_TLS" | "NONE" | string;
  usuario: string;
  senha_configurada: boolean;
  senha_mascarada: string | null;
  remetente_nome: string;
  remetente_email: string;
  responder_para: string;
};

export type EleicaoEmailConfigInput = {
  ativo: boolean;
  smtp_host: string;
  smtp_porta: number;
  seguranca: string;
  usuario: string;
  senha: string;
  remetente_nome: string;
  remetente_email: string;
  responder_para: string;
};

export async function buscarEmailConfig(
  slug: string,
  tokenAdmin: string,
): Promise<ApiResponse<EleicaoEmailConfig | null>> {
  return apiFetch(`/api/v1/eleicao/${encodeURIComponent(slug)}/admin/email-config`, {
    method: "GET",
    token: tokenAdmin,
    cache: "no-store",
    redirectOnUnauthorized: false,
  });
}

export async function salvarEmailConfig(
  slug: string,
  tokenAdmin: string,
  dados: EleicaoEmailConfigInput,
): Promise<ApiResponse<EleicaoEmailConfig | null>> {
  return apiFetch(`/api/v1/eleicao/${encodeURIComponent(slug)}/admin/email-config`, {
    method: "PUT",
    token: tokenAdmin,
    body: dados,
    redirectOnUnauthorized: false,
  });
}

export async function testarEmailConfig(
  slug: string,
  tokenAdmin: string,
  destinatario: string,
): Promise<ApiResponse<{ enviado: boolean; destinatario: string } | null>> {
  return apiFetch(`/api/v1/eleicao/${encodeURIComponent(slug)}/admin/email-config/teste`, {
    method: "POST",
    token: tokenAdmin,
    body: { destinatario },
    redirectOnUnauthorized: false,
  });
}
