import { plataformaSession } from "./session";

export async function api<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (auth) {
    const token = plataformaSession.get();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.erro) {
    throw new Error(data?.mensagem || `Erro HTTP ${response.status}`);
  }

  return data;
}
