"use client";

import { useEffect, useState } from "react";

export function ConectividadeAviso() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const atualizar = () => setOnline(window.navigator.onLine);
    atualizar();
    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);

    return () => {
      window.removeEventListener("online", atualizar);
      window.removeEventListener("offline", atualizar);
    };
  }, []);

  if (online) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-900" role="status">
      Sem conexão com a internet. Mantenha esta página aberta e verifique a conexão antes de continuar; novas solicitações podem falhar enquanto estiver offline.
    </div>
  );
}
