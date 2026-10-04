"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { EleicaoEntidade } from "@/types/eleicao";

const EleicaoContext = createContext<EleicaoEntidade | null>(null);

export function EleicaoProvider({ entidade, children }: { entidade: EleicaoEntidade | null; children: ReactNode }) {
  return <EleicaoContext.Provider value={entidade}>{children}</EleicaoContext.Provider>;
}

export function useEleicaoEntidade() {
  return useContext(EleicaoContext);
}
