import type { TipoVoto } from "@/types/eleicao";

const SESSION_PREFIX = "easyeleicao";
const LEGACY_KEYS = [
  "eleicao_token_identificacao",
  "eleicao_nome_associado",
  "eleicao_token_votacao",
  "eleicao_voto_selecao",
  "eleicao_comprovante",
  "eleicao_token_admin",
  "eleicao_nome_admin",
];

function canUseSessionStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

function scopedKey(slug: string, suffix: string) {
  return `${SESSION_PREFIX}:${normalizeSlug(slug)}:${suffix}`;
}

function removeLegacyKeys() {
  if (!canUseSessionStorage()) return;
  LEGACY_KEYS.forEach((key) => window.sessionStorage.removeItem(key));
}

type JwtPayload = {
  exp?: number;
  roles?: string[];
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(window.atob(padded), (char) => char.charCodeAt(0));
    const payload = new TextDecoder().decode(bytes);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

export function tokenJwtExpirado(token: string, margemSegundos = 10) {
  if (!token || typeof window === "undefined") return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= payload.exp * 1000 - margemSegundos * 1000;
}

export function tokenPossuiRole(token: string | null | undefined, role: string) {
  if (!token || typeof window === "undefined") return false;
  const payload = decodeJwtPayload(token);
  if (!payload || !Array.isArray(payload.roles)) return false;
  const roleNormalizada = role.trim().toUpperCase();
  return payload.roles.some((item) => String(item).trim().toUpperCase() === roleNormalizada);
}

export function adminPodeGerarCodigoContingencia(slug: string) {
  const token = obterTokenAdmin(slug);
  if (!token) return false;

  return tokenPossuiRole(token, "ELEICAO_GERAR_CODIGO_CONTINGENCIA") ||
    tokenPossuiRole(token, "ADMIN");
}

export function mensagemIndicaSessaoExpirada(message: string | null | undefined) {
  const normalized = (message || "").toLowerCase();
  return normalized.includes("401") ||
    normalized.includes("unauthorized") ||
    normalized.includes("não autorizado") ||
    normalized.includes("nao autorizado") ||
    normalized.includes("sessão expirada") ||
    normalized.includes("sessao expirada") ||
    normalized.includes("token expirado") ||
    normalized.includes("jwt expired");
}

type ContextoSessaoExpirada = "eleitor" | "admin";

function marcarAvisoSessaoExpirada(slug: string, contexto: ContextoSessaoExpirada) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(scopedKey(slug, `sessao-expirada-${contexto}`), "1");
}

export function consumirAvisoSessaoExpirada(slug: string, contexto: ContextoSessaoExpirada) {
  if (!canUseSessionStorage()) return false;
  const key = scopedKey(slug, `sessao-expirada-${contexto}`);
  const existe = window.sessionStorage.getItem(key) === "1";
  if (existe) window.sessionStorage.removeItem(key);
  return existe;
}

function saveToken(slug: string, suffix: string, token: string) {
  if (!canUseSessionStorage()) return;
  removeLegacyKeys();
  window.sessionStorage.setItem(scopedKey(slug, suffix), token);
}

function getToken(slug: string, suffix: string) {
  if (!canUseSessionStorage()) return null;
  const key = scopedKey(slug, suffix);
  const token = window.sessionStorage.getItem(key);
  if (!token) return null;

  if (tokenJwtExpirado(token)) {
    window.sessionStorage.removeItem(key);
    if (suffix === "token-admin") window.sessionStorage.removeItem(scopedKey(slug, "nome-admin"));
    if (suffix === "token-identificacao") window.sessionStorage.removeItem(scopedKey(slug, "nome-associado"));
    if (suffix === "token-votacao") window.sessionStorage.removeItem(scopedKey(slug, "voto-selecao"));
    marcarAvisoSessaoExpirada(slug, suffix === "token-admin" ? "admin" : "eleitor");
    return null;
  }

  return token;
}

export function salvarSessaoIdentificacaoEleicao(slug: string, tokenIdentificacao: string, nomeAssociado: string) {
  if (!canUseSessionStorage()) return;
  removeLegacyKeys();
  window.sessionStorage.removeItem(scopedKey(slug, "token-votacao"));
  window.sessionStorage.removeItem(scopedKey(slug, "voto-selecao"));
  window.sessionStorage.setItem(scopedKey(slug, "token-identificacao"), tokenIdentificacao);
  window.sessionStorage.setItem(scopedKey(slug, "nome-associado"), nomeAssociado);
}

export function obterTokenIdentificacaoEleicao(slug: string) {
  return getToken(slug, "token-identificacao");
}

export function obterNomeAssociadoEleicao(slug: string) {
  if (!canUseSessionStorage()) return "";
  return window.sessionStorage.getItem(scopedKey(slug, "nome-associado")) || "";
}

export function salvarTokenVotacao(slug: string, tokenVotacao: string) {
  saveToken(slug, "token-votacao", tokenVotacao);
}

export function obterTokenVotacao(slug: string) {
  return getToken(slug, "token-votacao");
}

export function removerTokenVotacao(slug: string) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(scopedKey(slug, "token-votacao"));
}

export function removerTokenIdentificacao(slug: string) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(scopedKey(slug, "token-identificacao"));
  window.sessionStorage.removeItem(scopedKey(slug, "nome-associado"));
}

export function limparSessaoEleicao(slug: string, sessaoExpirada = false) {
  if (!canUseSessionStorage()) return;
  if (sessaoExpirada) marcarAvisoSessaoExpirada(slug, "eleitor");
  window.sessionStorage.removeItem(scopedKey(slug, "token-identificacao"));
  window.sessionStorage.removeItem(scopedKey(slug, "token-votacao"));
  window.sessionStorage.removeItem(scopedKey(slug, "nome-associado"));
  window.sessionStorage.removeItem(scopedKey(slug, "voto-selecao"));
}

export type EleicaoSelecaoVoto =
  | { tipo_voto: "CHAPA"; id_chapa: number; numero_chapa?: number; nome_chapa?: string }
  | { tipo_voto: Exclude<TipoVoto, "CHAPA"> };

export function salvarSelecaoVoto(slug: string, selecao: EleicaoSelecaoVoto) {
  if (!canUseSessionStorage()) return;
  try {
    window.sessionStorage.setItem(scopedKey(slug, "voto-selecao"), JSON.stringify(selecao));
  } catch {
    // SessionStorage indisponível/cheio: a próxima tela tratará a ausência da seleção.
  }
}

export function obterSelecaoVoto(slug: string): EleicaoSelecaoVoto | null {
  if (!canUseSessionStorage()) return null;
  const value = window.sessionStorage.getItem(scopedKey(slug, "voto-selecao"));
  if (!value) return null;

  try {
    return JSON.parse(value) as EleicaoSelecaoVoto;
  } catch {
    window.sessionStorage.removeItem(scopedKey(slug, "voto-selecao"));
    return null;
  }
}

export function removerSelecaoVoto(slug: string) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(scopedKey(slug, "voto-selecao"));
}

export function salvarComprovante(slug: string, comprovante: string) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(scopedKey(slug, "comprovante"), comprovante);
}

export function obterComprovante(slug: string) {
  if (!canUseSessionStorage()) return null;
  return window.sessionStorage.getItem(scopedKey(slug, "comprovante"));
}

export function salvarSessaoAdmin(slug: string, token: string, nome: string) {
  if (!canUseSessionStorage()) return;
  removeLegacyKeys();
  window.sessionStorage.setItem(scopedKey(slug, "token-admin"), token);
  window.sessionStorage.setItem(scopedKey(slug, "nome-admin"), nome);
}

export function obterTokenAdmin(slug: string) {
  return getToken(slug, "token-admin");
}

export function obterNomeAdmin(slug: string) {
  if (!canUseSessionStorage()) return "";
  return window.sessionStorage.getItem(scopedKey(slug, "nome-admin")) || "";
}

export function limparSessaoAdmin(slug: string, sessaoExpirada = false) {
  if (!canUseSessionStorage()) return;
  if (sessaoExpirada) marcarAvisoSessaoExpirada(slug, "admin");
  window.sessionStorage.removeItem(scopedKey(slug, "token-admin"));
  window.sessionStorage.removeItem(scopedKey(slug, "nome-admin"));
}
