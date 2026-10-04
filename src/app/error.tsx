"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Erro inesperado no EasyEleicao:", error);
    }
  }, [error]);

  return (
    <main className="election-shell min-h-screen px-4 py-8 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 text-center shadow-sm sm:p-9">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-xl font-black text-[var(--brand)]">!</div>
          <h1 className="mt-5 text-2xl font-black tracking-tight">Não foi possível carregar a página</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Ocorreu um erro inesperado. Tente novamente; se o problema persistir, acesse novamente pelo endereço fornecido pela entidade.</p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={reset}>Tentar novamente</Button>
            <ButtonLink href="/" variant="secondary">Página inicial</ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
