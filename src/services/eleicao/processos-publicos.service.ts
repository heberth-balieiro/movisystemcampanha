import { imagemBase64 } from "@/lib/image";
import { apiFetch } from "@/services/api";

export type ProcessoPublico = {
  id: number;
  empresa_id: number;
  empresa: string;
  nome: string;
  nome_exibicao: string;
  descricao: string;
  operacao: string;
  situacao: string;
  slug: string;
  logo: string;
  banner: string;
  data_hora_inicio: string;
  data_hora_fim: string;
};

export type ProcessoPublicoView = ProcessoPublico & {
  logo_url: string | null;
  banner_url: string | null;
};

export async function listarProcessosPublicos(): Promise<ProcessoPublicoView[]> {
  const response = await apiFetch<ProcessoPublico[]>("/api/v1/public/processos", {
    method: "GET",
    cache: "no-store",
    token: null,
  });

  return (response.dados ?? []).map((item) => ({
    ...item,
    logo_url: imagemBase64(item.logo),
    banner_url: imagemBase64(item.banner),
  }));
}
