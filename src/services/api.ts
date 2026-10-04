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

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return {
      erro: false,
      mensagem: "",
      dados: null as T,
    };
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

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
