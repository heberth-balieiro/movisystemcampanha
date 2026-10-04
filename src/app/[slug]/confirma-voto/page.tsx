"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
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
    <EleicaoLayout>
      <EleicaoMensagem titulo="Confirme seu voto" mensagem="Revise a escolha antes de registrar. Depois da confirmação, o voto não poderá ser alterado.">
        <div className="mx-auto max-w-md space-y-5 text-left">
          <div className="rounded-2xl border border-[var(--brand)]/25 bg-[var(--brand-soft)] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Opção selecionada</p>
            <div className="mt-2 text-lg font-black text-[var(--foreground)]">{tituloSelecao}</div>
            {selecao.tipo_voto === "CHAPA" && selecao.nome_chapa ? <div className="mt-1 text-sm text-[var(--muted)]">{selecao.nome_chapa}</div> : null}
          </div>

          {mensagem ? <div role="alert" className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{mensagem}</div> : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={() => router.replace(`/${slug}/votacao`)} disabled={enviando} type="button">Voltar e revisar</Button>
            <Button onClick={onConfirmar} disabled={enviando || bloqueadoSegundoVoto} type="button">{enviando ? "Registrando voto..." : "Confirmar voto"}</Button>
          </div>

          <p className="text-center text-xs leading-5 text-[var(--muted)]">O comprovante confirma o registro do voto sem revelar a opção escolhida.</p>
        </div>
      </EleicaoMensagem>
    </EleicaoLayout>
  );
}
