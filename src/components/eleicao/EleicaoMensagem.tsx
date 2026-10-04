import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button-link";

type EleicaoMensagemProps = {
  titulo: string;
  mensagem?: string;
  acaoHref?: string;
  acaoTexto?: string;
  children?: ReactNode;
};

export function EleicaoMensagem({ titulo, mensagem, acaoHref, acaoTexto, children }: EleicaoMensagemProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)]">
        <span className="size-2.5 rounded-full bg-[var(--brand)]" />
      </div>
      <h2 className="text-xl font-black tracking-tight sm:text-2xl">{titulo}</h2>
      {mensagem ? <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">{mensagem}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
      {acaoHref && acaoTexto ? <ButtonLink className="mt-6 w-full sm:w-auto" href={acaoHref} variant="secondary">{acaoTexto}</ButtonLink> : null}
    </div>
  );
}
