export function imagemBase64(valor?: string | null, mime = "image/png") {
  if (!valor) return null;

  if (valor.startsWith("data:image/"))
    return valor;

  return `data:${mime};base64,${valor}`;
}

//uso da funcao

// import { imagemBase64 } from "@/lib/image";

// const logoSrc = imagemBase64(data.logo);
// const bannerSrc = imagemBase64(data.banner);