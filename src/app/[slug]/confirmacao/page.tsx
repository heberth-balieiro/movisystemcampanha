"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  solicitarCodigoPorEmail,
  type CanalConfirmacao,
  type SolicitarCodigoContingenciaDados,
} from "@/services/eleicao/eleicao-confirmacao.service";
import { solicitarCodigoConfirmacao, validarCodigoConfirmacao } from "@/services/eleicao/eleicao.service";
import {
  limparSessaoEleicao,
  mensagemIndicaSessaoExpirada,
  obterNomeAssociadoEleicao,
  obterTokenIdentificacaoEleicao,
  removerTokenIdentificacao,
  salvarTokenVotacao,
} from "@/services/eleicao/eleicao-session.service";

type DadosEnvioCodigo = SolicitarCodigoContingenciaDados;

export default function EleicaoConfirmacaoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const requestedRef = useRef(false);
  const [nomeAssociado, setNomeAssociado] = useState("");
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [destino, setDestino] = useState("");
  const [canal, setCanal] = useState<CanalConfirmacao>("WHATSAPP");
  const [emailDisponivel, setEmailDisponivel] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [expiraSegundos, setExpiraSegundos] = useState(0);
  const [reenviarSegundos, setReenviarSegundos] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [validando, setValidando] = useState(false);
  const [enviando, setEnviando] = useState(false);

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

  function aplicarDadosEnvio(dados: DadosEnvioCodigo) {
    setDestino(dados.destino || "");
    setCanal(dados.canal || "WHATSAPP");
    setEmailDisponivel(Boolean(dados.email_disponivel));
    setEmailDestino(dados.email_destino || "");
    setExpiraSegundos(dados.expira_em_segundos || 0);
    setReenviarSegundos(dados.reenviar_em_segundos || 0);
  }

  async function solicitarCodigo(tokenIdentificacao: string) {
    setMensagemErro(null);
    setEnviando(true);
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
        aplicarDadosEnvio(response.dados as DadosEnvioCodigo);
      }
    } catch {
      setMensagemErro("Não foi possível enviar o código de confirmação.");
    } finally {
      setEnviando(false);
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

  async function onReenviarWhatsapp() {
    const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
    if (!tokenIdentificacao) {
      limparSessaoEleicao(slug);
      router.replace(`/${slug}/login`);
      return;
    }

    await solicitarCodigo(tokenIdentificacao);
    setCodigo("");
  }

  async function onReceberPorEmail() {
    const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
    if (!tokenIdentificacao) {
      limparSessaoEleicao(slug);
      router.replace(`/${slug}/login`);
      return;
    }

    setMensagemErro(null);
    setEnviando(true);
    try {
      const response = await solicitarCodigoPorEmail(slug, tokenIdentificacao);
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        setMensagemErro(response.mensagem || "Não foi possível enviar o código por e-mail.");
        return;
      }

      aplicarDadosEnvio(response.dados);
      setCodigo("");
    } catch {
      setMensagemErro("Não foi possível enviar o código por e-mail.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregandoInicial) {
    return <EleicaoLayout><EleicaoLoading /></EleicaoLayout>;
  }

  const usandoEmail = canal === "EMAIL";

  return (
    <EleicaoLayout subtitulo="Confirme sua identidade para continuar com segurança.">
      <div className="mx-auto max-w-2xl">
        <section className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
            <Icon name={usandoEmail ? "mail" : "whatsapp"} className="size-6" />
          </div>

          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">
            Confirmação em duas etapas
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
            Confirmação de identidade
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Digite o código de 6 dígitos enviado ao seu {usandoEmail ? "e-mail cadastrado" : "WhatsApp"} para continuar.
          </p>
        </section>

        <section className="mt-7 rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-7">
          <div className="flex gap-3 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] p-4 text-sm leading-6 text-[var(--brand-strong)]">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/80 text-[var(--brand)] shadow-sm">
              <Icon name={usandoEmail ? "mail" : "user"} />
            </span>
            <div>
              {nomeAssociado ? <p className="font-extrabold text-[var(--foreground)]">Olá, {nomeAssociado}.</p> : null}
              <p>
                Enviamos um código de confirmação para o {usandoEmail ? "e-mail" : "WhatsApp"} cadastrado.
              </p>
              {destino ? <p className="mt-1 font-mono font-bold text-[var(--foreground)]">{destino}</p> : null}
            </div>
          </div>

          {mensagemErro ? (
            <div role="alert" className="mt-4 flex gap-3 rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/80">
                <Icon name="x" className="size-3.5" />
              </span>
              <div>
                <strong>Não foi possível enviar ou validar o código.</strong>
                <div>{mensagemErro}</div>
              </div>
            </div>
          ) : null}

          <label className="mt-5 block text-sm font-bold text-[var(--foreground)]">
            Código de confirmação
            <Input
              aria-label="Código de confirmação"
              className="mt-2 h-14 text-center font-mono text-2xl font-black tracking-[0.22em]"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
              placeholder="000000"
              value={codigo}
              onChange={(e) => onCodigoChange(e.target.value)}
              onPaste={(e) => {
                onCodigoChange(e.clipboardData.getData("text"));
                e.preventDefault();
              }}
            />
          </label>

          <div className="mt-3 text-center text-sm font-medium text-[var(--muted)]">
            {expiraSegundos > 0 ? (
              <span>Código válido por <strong className="text-[var(--foreground)]">{formatarTempo(expiraSegundos)}</strong></span>
            ) : (
              <span>Código expirado. Solicite um novo código.</span>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={onConfirmar} disabled={validando || codigo.length !== 6} type="button" icon={<Icon name="check" />}>
              {validando ? "Validando..." : "Confirmar código"}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => { limparSessaoEleicao(slug); router.replace(`/${slug}`); }} type="button">
              Voltar para eleição
            </Button>
          </div>

          <div className="mt-5 space-y-3 text-center text-sm text-[var(--muted)]">
            {reenviarSegundos > 0 ? (
              <span>Você poderá solicitar um novo código em <strong>{reenviarSegundos}s</strong>.</span>
            ) : (
              <Button
                variant="ghost"
                onClick={onReenviarWhatsapp}
                size="sm"
                type="button"
                disabled={enviando}
                icon={<Icon name="whatsapp" />}
              >
                {enviando && !usandoEmail ? "Enviando..." : "Reenviar código pelo WhatsApp"}
              </Button>
            )}

            {emailDisponivel ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">Não recebeu pelo WhatsApp?</p>
                {emailDestino ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Podemos enviar um novo código para <span className="font-mono font-bold text-[var(--foreground)]">{emailDestino}</span>.
                  </p>
                ) : null}
                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={onReceberPorEmail}
                    size="sm"
                    type="button"
                    disabled={enviando || reenviarSegundos > 0}
                    icon={<Icon name="mail" />}
                  >
                    {enviando && usandoEmail ? "Enviando..." : "Receber código por e-mail"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-[var(--brand)] shadow-sm">
            <Icon name="check" className="size-3.5" />
          </span>
          <p>
            O código é usado apenas para confirmar sua identidade antes da votação. Não compartilhe este código com outras pessoas.
          </p>
        </div>
      </div>
    </EleicaoLayout>
  );
}
