"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { registrarVoto } from "@/services/eleicao/eleicao.service";
import {
  limparSessaoEleicao,
  mensagemIndicaSessaoExpirada,
  obterSelecaoVoto,
  obterTokenVotacao,
  removerSelecaoVoto,
  removerTokenVotacao,
  salvarComprovante,
  type EleicaoSelecaoVoto,
} from "@/services/eleicao/eleicao-session.service";

export default function EleicaoConfirmaVotoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [selecao, setSelecao] = useState<EleicaoSelecaoVoto | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [bloqueadoSegundoVoto, setBloqueadoSegundoVoto] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const token = obterTokenVotacao(slug);
      if (!token) {
        router.replace(`/${slug}/login`);
        return;
      }

      const s = obterSelecaoVoto(slug);
      if (!s) {
        router.replace(`/${slug}/votacao`);
        return;
      }
      setSelecao(s);
    }, 0);

    return () => window.clearTimeout(t);
  }, [router, slug]);

  if (!selecao) {
    return <EleicaoLayout><EleicaoMensagem titulo="Confirmar voto" mensagem="Preparando confirmação..." /></EleicaoLayout>;
  }

  async function onConfirmar() {
    setMensagem(null);
    setEnviando(true);

    const token = obterTokenVotacao(slug);
    if (!token) {
      router.replace(`/${slug}/login`);
      return;
    }

    const body = selecao.tipo_voto === "CHAPA"
      ? { tipo_voto: selecao.tipo_voto, id_chapa: selecao.id_chapa }
      : { tipo_voto: selecao.tipo_voto };

    try {
      const response = await registrarVoto(slug, token, body);
      if (response.erro) {
        const msg = response.mensagem || "Erro ao registrar o voto.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        if (msg.toLowerCase().includes("já foi registrado")) {
          setBloqueadoSegundoVoto(true);
          limparSessaoEleicao(slug);
          router.replace(`/${slug}`);
          return;
        }
        setMensagem(msg);
        return;
      }

      if (response.dados?.confirmado === "S" && response.dados.comprovante) {
        salvarComprovante(slug, response.dados.comprovante);
        removerSelecaoVoto(slug);
        removerTokenVotacao(slug);
        router.replace(`/${slug}/comprovante`);
        return;
      }

      setMensagem(response.mensagem || "Resposta inesperada da API.");
    } catch {
      setMensagem("Erro ao registrar o voto.");
    } finally {
      setEnviando(false);
    }
  }

  const tituloSelecao = selecao.tipo_voto === "CHAPA"
    ? `Chapa ${selecao.numero_chapa ? String(selecao.numero_chapa).padStart(2, "0") : ""}`.trim()
    : selecao.tipo_voto === "BRANCO" ? "Voto em branco" : "Voto nulo";

  return (
    <EleicaoLayout subtitulo="Revise sua escolha antes de registrar o voto.">
      <div className="mx-auto max-w-2xl">
        <section className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
            <Icon name="check" className="size-6" />
          </div>

          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">Etapa final</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Confirme seu voto</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Revise sua escolha antes de registrar. Após a confirmação, o voto não poderá ser alterado.
          </p>
        </section>

        <section className="mt-7 rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-7">
          <div className="rounded-[22px] border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-5 text-center sm:p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">Opção selecionada</p>
            <div className="mt-3 text-2xl font-black tracking-tight text-[var(--foreground)]">{tituloSelecao}</div>
            {selecao.tipo_voto === "CHAPA" && selecao.nome_chapa ? (
              <div className="mt-2 text-base font-semibold text-[var(--brand-strong)]">{selecao.nome_chapa}</div>
            ) : null}
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-amber-700 shadow-sm">
              <Icon name="check" className="size-3.5" />
            </span>
            <div>
              <strong>Revise antes de confirmar.</strong>
              <div>Depois do registro, não será possível alterar ou substituir este voto.</div>
            </div>
          </div>

          {mensagem ? (
            <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800">
              {mensagem}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button size="lg" variant="secondary" onClick={() => router.replace(`/${slug}/votacao`)} disabled={enviando} type="button">
              Voltar e revisar
            </Button>
            <Button size="lg" onClick={onConfirmar} disabled={enviando || bloqueadoSegundoVoto} type="button" icon={<Icon name="check" />}>
              {enviando ? "Registrando voto..." : "Confirmar voto"}
            </Button>
          </div>
        </section>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-[var(--brand)] shadow-sm">
            <Icon name="ticket" className="size-3.5" />
          </span>
          <p>
            O comprovante confirma que o voto foi registrado, sem exibir a opção escolhida pelo eleitor.
          </p>
        </div>
      </div>
    </EleicaoLayout>
  );
}
