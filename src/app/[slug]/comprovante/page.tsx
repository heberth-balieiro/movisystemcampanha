"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useEleicaoEntidade } from "@/components/eleicao/EleicaoContext";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";
import { obterComprovante } from "@/services/eleicao/eleicao-session.service";

export default function EleicaoComprovantePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const entidade = useEleicaoEntidade();
  const [comprovante, setComprovante] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

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

  async function copiarComprovante() {
    try {
      await navigator.clipboard.writeText(comprovante);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  }

  async function compartilharComprovante() {
    const texto = `Comprovante de votação\n${entidade?.nome_exibicao || "Sistema de Votação Digital"}\n\n${comprovante}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Comprovante de votação",
          text: texto,
        });
        return;
      } catch {
        return;
      }
    }

    await copiarComprovante();
  }

  return (
    <EleicaoLayout subtitulo="Seu voto foi registrado com segurança.">
      <div className="mx-auto max-w-3xl">
        <section className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
            <Icon name="check" className="size-7" />
          </div>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">Votação concluída</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Voto registrado com sucesso</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Guarde este comprovante. Ele confirma que seu voto foi registrado sem revelar a opção escolhida.
          </p>
        </section>

        <section className="mx-auto mt-7 max-w-2xl overflow-hidden rounded-[26px] border border-[var(--line)] bg-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.5)]">
          <div className="border-b border-dashed border-[var(--line)] bg-[var(--surface-muted)] px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">Comprovante de votação</p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[var(--foreground)]">Sistema de Votação Digital</h2>
                {entidade?.nome_exibicao ? (
                  <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{entidade.nome_exibicao}</p>
                ) : null}
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                <Icon name="check" className="size-3.5" />
                Registrado
              </span>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Código do comprovante</p>
              <p className="mt-3 break-all font-mono text-sm font-black leading-7 tracking-[0.04em] text-[var(--foreground)] sm:text-base">
                {comprovante}
              </p>
            </div>

            <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-4 py-4 text-sm leading-6 text-[var(--brand-strong)]">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/80 text-[var(--brand)] shadow-sm">
                <Icon name="ticket" className="size-3.5" />
              </span>
              <p>
                Este comprovante confirma apenas o registro da participação. Ele não contém nem permite identificar a opção escolhida no voto.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button size="lg" variant="secondary" onClick={copiarComprovante} icon={<Icon name="copy" />}>
                {copiado ? "Comprovante copiado" : "Copiar comprovante"}
              </Button>
              <Button size="lg" onClick={compartilharComprovante} icon={<Icon name="share" />}>
                Compartilhar comprovante
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
          <ButtonLink fullWidth href={`/${slug}/validar-comprovante`} icon={<Icon name="search" />} size="lg">
            Validar comprovante
          </ButtonLink>
          <ButtonLink fullWidth href={`/${slug}`} variant="secondary" size="lg">
            Voltar para eleição
          </ButtonLink>
        </div>
      </div>
    </EleicaoLayout>
  );
}
