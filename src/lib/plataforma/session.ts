const KEY = "easyeleicao_plataforma_token";

export const plataformaSession = {
  get() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(KEY) ?? "";
  },
  set(token: string) {
    if (typeof window !== "undefined") localStorage.setItem(KEY, token);
  },
  clear() {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },
};
