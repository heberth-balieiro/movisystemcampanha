"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { ButtonLink } from "@/components/ui/button-link";
import { obterComprovante } from "@/services/eleicao/eleicao-session.service";

export default function EleicaoComprovantePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [comprovante, setComprovante] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const valor = obterComprovante(slug);
      if (!valor) {
        router.replace(`/${slug}`);
        return;
      }
      setComprovante(valor);
    }, 0);

    return () => window.clearTimeout(t);
  }, [router, slug]);

  if (!comprovante) {
    return <EleicaoLayout><EleicaoMensagem titulo="Voto registrado" mensagem="Preparando seu comprovante..." /></EleicaoLayout>;
  }

  return (
    <EleicaoLayout>
      <EleicaoMensagem titulo="Voto registrado com sucesso" mensagem="Seu voto foi recebido e registrado.">
        <div className="mx-auto max-w-lg space-y-5 text-left">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Comprovante</div>
            <div className="mt-2 break-all font-mono text-sm font-semibold leading-6 text-[var(--foreground)]">{comprovante}</div>
          </div>

          <p className="text-center text-sm leading-6 text-[var(--muted)]">Guarde este código. Ele permite confirmar que o voto foi registrado sem revelar sua escolha.</p>

          <div className="grid gap-2 sm:grid-cols-2">
            <ButtonLink fullWidth href={`/${slug}/validar-comprovante`}>Validar comprovante</ButtonLink>
            <ButtonLink fullWidth href={`/${slug}`} variant="secondary">Voltar para eleição</ButtonLink>
          </div>
        </div>
      </EleicaoMensagem>
    </EleicaoLayout>
  );
}
