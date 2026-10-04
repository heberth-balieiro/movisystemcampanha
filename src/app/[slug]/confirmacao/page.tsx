"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { solicitarCodigoConfirmacao, validarCodigoConfirmacao } from "@/services/eleicao/eleicao.service";
import {
  limparSessaoEleicao,
  mensagemIndicaSessaoExpirada,
  obterNomeAssociadoEleicao,
  obterTokenIdentificacaoEleicao,
  removerTokenIdentificacao,
  salvarTokenVotacao,
} from "@/services/eleicao/eleicao-session.service";

export default function EleicaoConfirmacaoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const requestedRef = useRef(false);
  const [nomeAssociado, setNomeAssociado] = useState("");
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [destino, setDestino] = useState("");
  const [expiraSegundos, setExpiraSegundos] = useState(0);
  const [reenviarSegundos, setReenviarSegundos] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [validando, setValidando] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
      if (!tokenIdentificacao) {
        router.replace(`/${slug}/login`);
        return;
      }

      setNomeAssociado(obterNomeAssociadoEleicao(slug));
      if (!requestedRef.current) {
        requestedRef.current = true;
        void solicitarCodigo(tokenIdentificacao);
      }
      setCarregandoInicial(false);
    }, 0);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

  useEffect(() => {
    if (expiraSegundos <= 0 && reenviarSegundos <= 0) return;
    const id = window.setInterval(() => {
      setExpiraSegundos((s) => (s > 0 ? s - 1 : 0));
      setReenviarSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [expiraSegundos, reenviarSegundos]);

  async function solicitarCodigo(tokenIdentificacao: string) {
    setMensagemErro(null);
    try {
      const response = await solicitarCodigoConfirmacao(slug, tokenIdentificacao);
      if (response.erro) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        setMensagemErro(response.mensagem || "Não foi possível enviar o código de confirmação.");
        return;
      }
      if (response.dados) {
        setDestino(response.dados.destino);
        setExpiraSegundos(response.dados.expira_em_segundos || 0);
        setReenviarSegundos(response.dados.reenviar_em_segundos || 0);
      }
    } catch {
      setMensagemErro("Não foi possível enviar o código de confirmação.");
    }
  }

  function formatarTempo(segundos: number) {
    const m = Math.floor(segundos / 60).toString().padStart(2, "0");
    const s = Math.floor(segundos % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function onCodigoChange(value: string) {
    setCodigo(value.replace(/\D/g, "").slice(0, 6));
  }

  async function onConfirmar() {
    setMensagemErro(null);
    if (codigo.length !== 6) {
      setMensagemErro("O código deve conter 6 dígitos.");
      return;
    }

    const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
    if (!tokenIdentificacao) {
      limparSessaoEleicao(slug);
      router.replace(`/${slug}/login`);
      return;
    }

    setValidando(true);
    try {
      const response = await validarCodigoConfirmacao(slug, tokenIdentificacao, { codigo });
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        setMensagemErro(response.mensagem || "Código inválido ou expirado.");
        return;
      }
      if (response.dados.confirmado === "S" && response.dados.token_votacao) {
        salvarTokenVotacao(slug, response.dados.token_votacao);
        removerTokenIdentificacao(slug);
        router.replace(`/${slug}/votacao`);
        return;
      }
      setMensagemErro(response.mensagem || "Não foi possível confirmar o código.");
    } catch {
      setMensagemErro("Erro ao validar o código.");
    } finally {
      setValidando(false);
    }
  }

  async function onReenviar() {
    const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
    if (!tokenIdentificacao) {
      limparSessaoEleicao(slug);
      router.replace(`/${slug}/login`);
      return;
    }
    await solicitarCodigo(tokenIdentificacao);
    setCodigo("");
  }

  if (carregandoInicial) {
    return <EleicaoLayout><EleicaoLoading /></EleicaoLayout>;
  }

  return (
    <EleicaoLayout>
      <EleicaoMensagem titulo="Confirmação de identidade" mensagem="Digite o código recebido no WhatsApp para continuar.">
        <div className="mx-auto max-w-md space-y-5 text-left">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
            {nomeAssociado ? <p className="font-semibold text-[var(--foreground)]">Olá, {nomeAssociado}.</p> : null}
            <p>Enviamos um código de confirmação para seu WhatsApp.</p>
            {destino ? <p className="mt-1 font-mono font-semibold text-[var(--foreground)]">{destino}</p> : null}
          </div>

          <label className="block text-sm font-semibold">
            Código de confirmação
            <Input
              aria-label="Código de confirmação"
              className="mt-2 text-center font-mono text-xl font-bold tracking-[0.35em]"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
              value={codigo}
              onChange={(e) => onCodigoChange(e.target.value)}
              onPaste={(e) => {
                onCodigoChange(e.clipboardData.getData("text"));
                e.preventDefault();
              }}
            />
          </label>

          <div className="text-center text-sm text-[var(--muted)]">
            {expiraSegundos > 0 ? `Código válido por ${formatarTempo(expiraSegundos)}` : "Código expirado. Solicite um novo código."}
          </div>

          {mensagemErro ? <div role="alert" className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{mensagemErro}</div> : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={onConfirmar} disabled={validando || codigo.length !== 6} type="button">{validando ? "Validando..." : "Confirmar código"}</Button>
            <Button variant="secondary" onClick={() => { limparSessaoEleicao(slug); router.replace(`/${slug}`); }} type="button">Voltar</Button>
          </div>

          <div className="text-center text-sm text-[var(--muted)]">
            {reenviarSegundos > 0 ? <span>Reenviar código em {reenviarSegundos}s</span> : <Button variant="ghost" onClick={onReenviar} size="sm" type="button">Reenviar código</Button>}
          </div>
        </div>
      </EleicaoMensagem>
    </EleicaoLayout>
  );
}
