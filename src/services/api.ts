import type { ApiResponse } from "@/types/api";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiFetchOptions = {
  method?: ApiMethod;
  body?: unknown;
  headers?: HeadersInit;
  token?: string | null;
  cache?: RequestCache;
  redirectOnUnauthorized?: boolean;
  timeoutMs?: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_TIMEOUT_MS = 15000;

export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiHttpError";
  }
}

export class ApiNetworkError extends Error {
  constructor(message = "Não foi possível conectar ao serviço de votação. Verifique sua conexão e tente novamente.") {
    super(message);
    this.name = "ApiNetworkError";
  }
}

export class ApiTimeoutError extends Error {
  constructor(message = "O serviço de votação demorou para responder. Tente novamente em alguns instantes.") {
    super(message);
    this.name = "ApiTimeoutError";
  }
}

export function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada.");
  }

  const value = API_BASE_URL.replace(/\/$/, "");

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL inválida.");
  }

  return value;
}

export function getApiUrl(path: string): string {
  return `${getApiBaseUrl()}/${path.replace(/^\//, "")}`;
}

export function resolverApiMediaUrl(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;

  try {
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
    }

    return getApiUrl(value);
  } catch {
    return null;
  }
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function buildRequestBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isFormDataBody(body)) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

/**
 * Compatibilidade temporária para respostas legadas da API Delphi.
 * Algumas units antigas podem ser compiladas com codepage diferente de UTF-8,
 * gerando caracteres como "�" ou sequências "Ã..." no JSON.
 * A normalização fica centralizada aqui para proteger todas as telas que usam apiFetch.
 */
function normalizarTextoApi(value: string): string {
  let result = value;

  const mojibake: Array<[string, string]> = [
    ["Ã£", "ã"], ["Ãµ", "õ"], ["Ã¡", "á"], ["Ã©", "é"],
    ["Ã­", "í"], ["Ã³", "ó"], ["Ãº", "ú"], ["Ã§", "ç"],
    ["Ã¢", "â"], ["Ãª", "ê"], ["Ã´", "ô"], ["Ã€", "À"],
    ["Ã", "Á"], ["Ã‰", "É"], ["Ã“", "Ó"], ["Ãš", "Ú"],
    ["Ã‡", "Ç"], ["Âº", "º"], ["Âª", "ª"], ["Â°", "°"],
  ];

  for (const [errado, correto] of mojibake) {
    result = result.split(errado).join(correto);
  }

  // Quando o byte inválido já chegou ao navegador como U+FFFD (�),
  // não existe informação suficiente para reconstruir qualquer caractere.
  // Corrigimos os termos de domínio/retornos conhecidos da API de eleição.
  const substituicoes: Array<[RegExp, string]> = [
    [/N�o/g, "Não"], [/n�o/g, "não"],
    [/poss�vel/g, "possível"], [/Poss�vel/g, "Possível"],
    [/j�/g, "já"], [/J�/g, "Já"],
    [/elei��o/g, "eleição"], [/Elei��o/g, "Eleição"],
    [/vota��o/g, "votação"], [/Vota��o/g, "Votação"],
    [/identifica��o/g, "identificação"], [/Identifica��o/g, "Identificação"],
    [/confirma��o/g, "confirmação"], [/Confirma��o/g, "Confirmação"],
    [/configura��o/g, "configuração"], [/Configura��o/g, "Configuração"],
    [/sess�o/g, "sessão"], [/Sess�o/g, "Sessão"],
    [/c�digo/g, "código"], [/C�digo/g, "Código"],
    [/matr�cula/g, "matrícula"], [/Matr�cula/g, "Matrícula"],
    [/inv�lid([oa])/g, "inválid$1"], [/Inv�lid([oa])/g, "Inválid$1"],
    [/per�odo/g, "período"], [/Per�odo/g, "Período"],
    [/in�cio/g, "início"], [/In�cio/g, "Início"],
    [/usu�rio/g, "usuário"], [/Usu�rio/g, "Usuário"],
    [/dispon�vel/g, "disponível"], [/Dispon�vel/g, "Disponível"],
    [/op��o/g, "opção"], [/Op��o/g, "Opção"],
    [/op��es/g, "opções"], [/Op��es/g, "Opções"],
    [/apura��o/g, "apuração"], [/Apura��o/g, "Apuração"],
    [/publica��o/g, "publicação"], [/Publica��o/g, "Publicação"],
    [/conex�o/g, "conexão"], [/Conex�o/g, "Conexão"],
    [/autorizado �/g, "autorizado à"], [/acesso �/g, "acesso à"],
  ];

  for (const [pattern, replacement] of substituicoes) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

function normalizarPayloadApi<T>(value: T): T {
  if (typeof value === "string") {
    return normalizarTextoApi(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizarPayloadApi(item)) as T;
  }

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      output[key] = normalizarPayloadApi(item);
    }
    return output as T;
  }

  return value;
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return {
      erro: false,
      mensagem: "",
      dados: null as T,
    };
  }

  const payloadBruto = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  const payload = payloadBruto ? normalizarPayloadApi(payloadBruto) : null;

  if (response.status === 401) {
    throw new ApiHttpError(payload?.mensagem || "Sessão expirada. Faça login novamente.", 401);
  }

  if (!payload) {
    throw new ApiHttpError("Resposta inválida do serviço de votação.", response.status);
  }

  if (payload.erro || !response.ok) {
    throw new ApiHttpError(payload.mensagem || "Erro ao comunicar com o serviço de votação.", response.status);
  }

  return payload;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiResponse<T>> {
  const method = options.method ?? "GET";
  const headers = new Headers(options.headers);
  const token = options.token ?? null;
  const timeoutMs = Math.max(1000, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestBody = buildRequestBody(options.body, headers);

  try {
    const response = await fetch(getApiUrl(path), {
      method,
      headers,
      body: requestBody,
      cache: options.cache,
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });

    return await parseApiResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiHttpError) throw error;
    if (controller.signal.aborted) throw new ApiTimeoutError();
    if (error instanceof TypeError) throw new ApiNetworkError();
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
