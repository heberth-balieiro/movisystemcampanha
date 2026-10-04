import type { ReactNode } from "react";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { ButtonLink } from "@/components/ui/button-link";

type InstitucionalDocumentoProps = {
  slug: string;
  eyebrow: string;
  titulo: string;
  introducao: string;
  atualizadoEm?: string;
  children: ReactNode;
};

export function InstitucionalDocumento({ slug, eyebrow, titulo, introducao, atualizadoEm = "17/08/2026", children }: InstitucionalDocumentoProps) {
  return (
    <EleicaoLayout>
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-[var(--line)] pb-6">
          <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand)]">
            {eyebrow}
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">{titulo}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{introducao}</p>
          <p className="mt-4 text-xs font-semibold text-[var(--muted)]">Última atualização: {atualizadoEm}</p>
        </header>

        <div className="space-y-8 py-7 text-sm leading-7 text-[var(--foreground)] sm:text-base">{children}</div>

        <div className="border-t border-[var(--line)] pt-6">
          <ButtonLink href={`/${slug}`} variant="secondary" className="w-full sm:w-auto">Voltar para eleição</ButtonLink>
        </div>
      </article>
    </EleicaoLayout>
  );
}

export function DocumentoSecao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-black tracking-tight sm:text-xl">{titulo}</h2>
      <div className="mt-3 space-y-3 text-[var(--muted)]">{children}</div>
    </section>
  );
}

export function DocumentoLista({ children }: { children: ReactNode }) {
  return <ul className="space-y-2 pl-5 marker:text-[var(--brand)] [&>li]:list-disc">{children}</ul>;
}

export function DocumentoDestaque({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--foreground)] sm:p-5">{children}</div>;
}
