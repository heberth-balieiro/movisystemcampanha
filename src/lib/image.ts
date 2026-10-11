import { resolverApiMediaUrl } from "@/services/api";

export function imagemBase64(valor?: string | null, mime = "image/png") {
  if (!valor) return null;

  const value = valor.trim();
  if (!value) return null;

  if (value.startsWith("data:image/")) return value;

  if (/^https?:\/\//i.test(value)) return value;

  if (value.startsWith("/api/")) return resolverApiMediaUrl(value);

  return `data:${mime};base64,${value}`;
}

// Mantido o nome por compatibilidade com os componentes existentes.
// A função agora aceita Base64 legado e também URLs de mídia da API.
