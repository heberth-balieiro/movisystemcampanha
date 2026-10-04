import { apiFetch } from "@/services/api";
import type {
  EleicaoLoginDados,
  EleicaoLoginRequest,
  EleicaoLoginResponse,
  EleicaoPublicaDados,
  EleicaoSolicitarCodigoResponse,
  EleicaoValidarCodigoRequest,
  EleicaoValidarCodigoResponse,
  EleicaoVotacaoResponse,
  EleicaoRegistrarVotoRequest,
  EleicaoRegistrarVotoResponse,
  EleicaoValidarComprovanteResponse,
  EleicaoAdminLoginRequest,
  EleicaoAdminLoginResponse,
  EleicaoAdminPainelResponse,
  EleicaoAdminEncerrarResponse,
  EleicaoAdminIniciarApuracaoResponse,
  EleicaoAdminFinalizarApuracaoResponse,
  EleicaoAdminResultadoResponse,
  EleicaoAdminPublicarResultadoResponse,
  EleicaoResultadoPublicoResponse,
  EleicaoAuditoriaResponse,
} from "@/types/eleicao";

export class EleicaoPublicaNaoEncontradaError extends Error {
  constructor() {
    super("Eleicao publica não localizada.");
    this.name = "EleicaoPublicaNaoEncontradaError";
  }
}

function isMensagemNaoEncontrada(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("não encontrado") || normalized.includes("nao encontrado");
}

//Buscar eleicao public pelo slug
export async function buscarEleicaoPorSlug(slug: string): Promise<EleicaoPublicaDados> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    const response = await apiFetch<EleicaoPublicaDados | null>(
      `/api/v1/public/eleicao/${slugSeguro}`,
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

//serviço para o login
export async function loginEleicao(slug: string, cpf: string, matricula: string): Promise<EleicaoLoginResponse> {
  const slugSeguro = encodeURIComponent(slug);
  const body: EleicaoLoginRequest = {
    cpf,
    matricula,
  };
  
  try {
    return await apiFetch<EleicaoLoginDados | null>(`/api/v1/public/eleicao/${slugSeguro}/login`, {
      method: "POST",
      body,
      token: null,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw error;
    }

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

export async function solicitarCodigoConfirmacao(
  slug: string,
  tokenIdentificacao: string,
): Promise<EleicaoSolicitarCodigoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/confirmacao/solicitar-codigo`, {
      method: "POST",
      token: tokenIdentificacao,
      redirectOnUnauthorized: false,
    });
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

export async function validarCodigoConfirmacao(
  slug: string,
  tokenIdentificacao: string,
  request: EleicaoValidarCodigoRequest,
): Promise<EleicaoValidarCodigoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/confirmacao/validar-codigo`, {
      method: "POST",
      token: tokenIdentificacao,
      body: request,
      redirectOnUnauthorized: false,
    });
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

export async function buscarCedulaVotacao(
  slug: string,
  tokenVotacao: string,
): Promise<EleicaoVotacaoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/votacao`, {
      method: "GET",
      token: tokenVotacao,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
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

export async function registrarVoto(
  slug: string,
  tokenVotacao: string,
  dados: EleicaoRegistrarVotoRequest,
): Promise<EleicaoRegistrarVotoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/votacao/votar`, {
      method: "POST",
      token: tokenVotacao,
      body: dados,
      redirectOnUnauthorized: false,
    });
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

export async function validarComprovante(
  slug: string,
  comprovante: string,
): Promise<EleicaoValidarComprovanteResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/comprovante/validar`, {
      method: "POST",
      body: { comprovante },
      token: null,
      redirectOnUnauthorized: false,
    });
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

export async function loginAdminEleicao(
  slug: string,
  email: string,
  senha: string,
): Promise<EleicaoAdminLoginResponse> {
  const slugSeguro = encodeURIComponent(slug);

  const body: EleicaoAdminLoginRequest = { email, senha };

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/login`, {
      method: "POST",
      body,
      token: null,
      redirectOnUnauthorized: false,
    });
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

export async function buscarPainelAdminEleicao(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminPainelResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/painel`, {
      method: "GET",
      token: tokenAdmin,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
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

export async function encerrarEleicaoAdmin(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminEncerrarResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/encerrar`, {
      method: "POST",
      token: tokenAdmin,
      redirectOnUnauthorized: false,
    });
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

export async function iniciarApuracaoAdmin(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminIniciarApuracaoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/iniciar-apuracao`, {
      method: "POST",
      token: tokenAdmin,
      redirectOnUnauthorized: false,
    });
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

export async function finalizarApuracaoAdmin(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminFinalizarApuracaoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/finalizar-apuracao`, {
      method: "POST",
      token: tokenAdmin,
      redirectOnUnauthorized: false,
    });
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

export async function buscarResultadoAdminEleicao(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminResultadoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/resultado`, {
      method: "GET",
      token: tokenAdmin,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
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

export type EleicaoAuditoriaFiltros = {
  tipo_evento?: string;
  origem?: string;
  sucesso?: string;
  data_inicial?: string;
  data_final?: string;
};

export async function buscarAuditoriaAdminEleicao(
  slug: string,
  tokenAdmin: string,
  filtros?: EleicaoAuditoriaFiltros,
): Promise<EleicaoAuditoriaResponse> {
  const slugSeguro = encodeURIComponent(slug);

  const params = new URLSearchParams();
  if (filtros) {
    if (filtros.tipo_evento) params.append('tipo_evento', filtros.tipo_evento);
    if (filtros.origem) params.append('origem', filtros.origem);
    if (filtros.sucesso) params.append('sucesso', filtros.sucesso);
    if (filtros.data_inicial) params.append('data_inicial', filtros.data_inicial);
    if (filtros.data_final) params.append('data_final', filtros.data_final);
  }

  const qs = params.toString() ? `?${params.toString()}` : '';

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/auditoria${qs}`, {
      method: "GET",
      token: tokenAdmin,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
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

export async function publicarResultadoAdmin(
  slug: string,
  tokenAdmin: string,
): Promise<EleicaoAdminPublicarResultadoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/eleicao/${slugSeguro}/admin/publicar-resultado`, {
      method: "POST",
      token: tokenAdmin,
      redirectOnUnauthorized: false,
    });
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

export async function buscarResultadoPublicoEleicao(
  slug: string,
): Promise<EleicaoResultadoPublicoResponse> {
  const slugSeguro = encodeURIComponent(slug);

  try {
    return await apiFetch(`/api/v1/public/eleicao/${slugSeguro}/resultado`, {
      method: "GET",
      token: null,
      cache: "no-store",
      redirectOnUnauthorized: false,
    });
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
