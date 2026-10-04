"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Erro global no EasyEleicao:", error);
    }
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#f3f6f5", color: "#17211e", fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(100%, 640px)", border: "1px solid #dde5e1", borderRadius: 18, background: "#fff", padding: 32, textAlign: "center", boxShadow: "0 18px 50px -36px rgba(15,23,42,.45)" }}>
            <div style={{ width: 54, height: 54, margin: "0 auto", display: "grid", placeItems: "center", borderRadius: 16, background: "#eaf4f1", color: "#1e6f5c", fontWeight: 900, fontSize: 22 }}>!</div>
            <h1 style={{ margin: "20px 0 0", fontSize: 26 }}>Sistema temporariamente indisponível</h1>
            <p style={{ margin: "12px auto 0", maxWidth: 520, color: "#66736d", lineHeight: 1.6 }}>Não foi possível carregar o ambiente de votação. Aguarde alguns instantes e tente novamente.</p>
            <button onClick={reset} style={{ marginTop: 24, minHeight: 44, border: 0, borderRadius: 10, background: "#1e6f5c", color: "#fff", padding: "10px 18px", fontWeight: 700, cursor: "pointer" }} type="button">Tentar novamente</button>
          </section>
        </main>
      </body>
    </html>
  );
}
