"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useEleicaoEntidade } from "@/components/eleicao/EleicaoContext";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  consultarCanaisConfirmacao,
  getUserFriendlyConfirmationError,
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
type StatusEnvio = "AGUARDANDO_ESCOLHA" | "PENDENTE" | "ENVIADO" | "FALHA";

function somenteNumeros(valor?: string | null) {
  return (valor || "").replace(/\D/g, "");
}

function numeroWhatsappEntidade(valor?: string | null) {
  const numero = somenteNumeros(valor);
  if (!numero) return "";
  if (numero.startsWith("55")) return numero;
  if (numero.length === 10 || numero.length === 11) return `55${numero}`;
  return numero;
}

export default function EleicaoConfirmacaoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const entidade = useEleicaoEntidade();

  const [nomeAssociado, setNomeAssociado] = useState("");
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [destino, setDestino] = useState("");
  const [canal, setCanal] = useState<CanalConfirmacao | null>(null);
  const [statusEnvio, setStatusEnvio] = useState<StatusEnvio>("AGUARDANDO_ESCOLHA");
  const [whatsappDisponivel, setWhatsappDisponivel] = useState(true);
  const [whatsappDestino, setWhatsappDestino] = useState("");
  const [emailDisponivel, setEmailDisponivel] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [expiraSegundos, setExpiraSegundos] = useState(0);
  const [reenviarSegundos, setReenviarSegundos] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [validando, setValidando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
      if (!tokenIdentificacao) {
        router.replace(`/${slug}/login`);
        return;
      }

      setNomeAssociado(obterNomeAssociadoEleicao(slug));

      try {
        const response = await consultarCanaisConfirmacao(slug, tokenIdentificacao);
        if (!ativo) return;

        if (response.erro) {
          if (mensagemIndicaSessaoExpirada(response.mensagem)) {
            limparSessaoEleicao(slug, true);
            router.replace(`/${slug}/login`);
            return;
          }
          setWhatsappDisponivel(true);
          setWhatsappDestino("");
          setEmailDisponivel(false);
          setEmailDestino("");
        } else if (response.dados) {
          setWhatsappDisponivel(response.dados.whatsapp_disponivel !== false);
          setWhatsappDestino(response.dados.whatsapp_destino || "");
          setEmailDisponivel(Boolean(response.dados.email_disponivel));
          setEmailDestino(response.dados.email_destino || "");
        }
      } catch {
        if (ativo) {
          setWhatsappDisponivel(true);
          setWhatsappDestino("");
          setEmailDisponivel(false);
          setEmailDestino("");
        }
      } finally {
        if (ativo) setCarregandoInicial(false);
      }
    }

    void carregar();
    return () => {
      ativo = false;
    };
  }, [router, slug]);

  useEffect(() => {
    if (expiraSegundos <= 0 && reenviarSegundos <= 0) return;
    const id = window.setInterval(() => {
      setExpiraSegundos((s) => (s > 0 ? s - 1 : 0));
      setReenviarSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [expiraSegundos, reenviarSegundos]);

  function aplicarDadosEnvio(dados: DadosEnvioCodigo, canalEnviado: CanalConfirmacao) {
    setDestino(dados.destino || "");
    setCanal(canalEnviado);
    if (canalEnviado === "WHATSAPP" && dados.destino) setWhatsappDestino(dados.destino);
    setEmailDisponivel(Boolean(dados.email_disponivel ?? emailDisponivel));
    setEmailDestino(dados.email_destino || emailDestino);
    setExpiraSegundos(dados.expira_em_segundos || 0);
    setReenviarSegundos(dados.reenviar_em_segundos || 0);
    setStatusEnvio("ENVIADO");
    setCodigo("");
    setMensagemErro(null);
  }

  function obterTokenOuRedirecionar() {
    const tokenIdentificacao = obterTokenIdentificacaoEleicao(slug);
    if (!tokenIdentificacao) {
      limparSessaoEleicao(slug);
      router.replace(`/${slug}/login`);
      return null;
    }
    return tokenIdentificacao;
  }

  async function onEnviarWhatsapp() {
    const tokenIdentificacao = obterTokenOuRedirecionar();
    if (!tokenIdentificacao) return;

    setMensagemErro(null);
    setCanal("WHATSAPP");
    setStatusEnvio("PENDENTE");
    setDestino("");
    setCodigo("");
    setEnviando(true);

    try {
      const response = await solicitarCodigoConfirmacao(slug, tokenIdentificacao);
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }

        setStatusEnvio("FALHA");
        setExpiraSegundos(0);
        setReenviarSegundos(0);
        setMensagemErro(getUserFriendlyConfirmationError("WHATSAPP", response.mensagem));
        return;
      }

      aplicarDadosEnvio(response.dados as DadosEnvioCodigo, "WHATSAPP");
    } catch {
      setStatusEnvio("FALHA");
      setExpiraSegundos(0);
      setReenviarSegundos(0);
      setMensagemErro(getUserFriendlyConfirmationError("WHATSAPP"));
    } finally {
      setEnviando(false);
    }
  }

  async function onEnviarEmail() {
    const tokenIdentificacao = obterTokenOuRedirecionar();
    if (!tokenIdentificacao) return;

    setMensagemErro(null);
    setCanal("EMAIL");
    setStatusEnvio("PENDENTE");
    setDestino(emailDestino);
    setCodigo("");
    setEnviando(true);

    try {
      const response = await solicitarCodigoPorEmail(slug, tokenIdentificacao);
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }

        setStatusEnvio("FALHA");
        setExpiraSegundos(0);
        setReenviarSegundos(0);
        setMensagemErro(getUserFriendlyConfirmationError("EMAIL", response.mensagem));
        return;
      }

      aplicarDadosEnvio(response.dados, "EMAIL");
    } catch {
      setStatusEnvio("FALHA");
      setExpiraSegundos(0);
      setReenviarSegundos(0);
      setMensagemErro(getUserFriendlyConfirmationError("EMAIL"));
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

    const tokenIdentificacao = obterTokenOuRedirecionar();
    if (!tokenIdentificacao) return;

    setValidando(true);
    try {
      const response = await validarCodigoConfirmacao(slug, tokenIdentificacao, { codigo });
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        setMensagemErro(getUserFriendlyConfirmationError("VALIDACAO", response.mensagem));
        return;
      }

      if (response.dados.confirmado === "S" && response.dados.token_votacao) {
        salvarTokenVotacao(slug, response.dados.token_votacao);
        removerTokenIdentificacao(slug);
        router.replace(`/${slug}/votacao`);
        return;
      }

      setMensagemErro(getUserFriendlyConfirmationError("VALIDACAO", response.mensagem));
    } catch {
      setMensagemErro(getUserFriendlyConfirmationError("VALIDACAO"));
    } finally {
      setValidando(false);
    }
  }

  function onFalarComEntidade() {
    const numero = numeroWhatsappEntidade(entidade?.telefone);
    if (!numero) return;

    const mensagem = encodeURIComponent(
      `Olá, preciso de ajuda para acessar a votação${entidade?.nome_exibicao ? ` de ${entidade.nome_exibicao}` : ""}.`,
    );
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank", "noopener,noreferrer");
  }

  if (carregandoInicial) {
    return <EleicaoLayout><EleicaoLoading /></EleicaoLayout>;
  }

  const numeroEntidade = numeroWhatsappEntidade(entidade?.telefone);
  const usandoEmail = canal === "EMAIL";
  const codigoEnviado = statusEnvio === "ENVIADO";
  const aguardandoEnvio = statusEnvio === "PENDENTE";
  const podeSolicitar = reenviarSegundos <= 0 && !enviando;

  return (
    <EleicaoLayout subtitulo="Confirme sua identidade para continuar com segurança.">
      <div className="mx-auto max-w-2xl">
        <section className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
            <Icon name="check" className="size-6" />
          </div>

          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">Confirmação em duas etapas</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Confirmação de identidade</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
            {codigoEnviado
              ? `Digite o código de 6 dígitos enviado por ${usandoEmail ? "e-mail" : "WhatsApp"}.`
              : aguardandoEnvio
                ? `Aguarde enquanto enviamos o código por ${usandoEmail ? "e-mail" : "WhatsApp"}.`
                : "Escolha como deseja receber seu código de confirmação."}
          </p>
        </section>

        <section className="mt-7 rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-7">
          <div className="rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] p-4 text-sm leading-6 text-[var(--brand-strong)]">
            {nomeAssociado ? <p className="font-extrabold text-[var(--foreground)]">Olá, {nomeAssociado}.</p> : null}
            <p className="mt-1">Selecione um dos canais disponíveis abaixo. O código será enviado somente após sua escolha.</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => void onEnviarWhatsapp()} disabled={!whatsappDisponivel || !podeSolicitar} className="rounded-2xl border border-[var(--line)] bg-white p-4 text-left shadow-sm transition hover:border-[var(--brand)]/40 hover:bg-[var(--brand-soft)] disabled:cursor-not-allowed disabled:opacity-50">
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><Icon name="whatsapp" /></span>
                <span><strong className="block text-sm text-[var(--foreground)]">Receber por WhatsApp</strong><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{whatsappDisponivel ? (whatsappDestino || "Enviar para o WhatsApp cadastrado.") : "WhatsApp indisponível para este eleitor."}</span></span>
              </span>
            </button>

            <button type="button" onClick={() => void onEnviarEmail()} disabled={!emailDisponivel || !podeSolicitar} className="rounded-2xl border border-[var(--line)] bg-white p-4 text-left shadow-sm transition hover:border-[var(--brand)]/40 hover:bg-[var(--brand-soft)] disabled:cursor-not-allowed disabled:opacity-50">
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><Icon name="mail" /></span>
                <span><strong className="block text-sm text-[var(--foreground)]">Receber por e-mail</strong><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{emailDisponivel ? (emailDestino || "Enviar para o e-mail cadastrado.") : "E-mail indisponível para este eleitor."}</span></span>
              </span>
            </button>
          </div>

          {reenviarSegundos > 0 ? <div className="mt-3 text-center text-sm text-[var(--muted)]">Você poderá solicitar outro código em <strong className="text-[var(--foreground)]">{reenviarSegundos}s</strong>.</div> : null}

          {mensagemErro ? (
            <div role="alert" className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/80"><Icon name="x" className="size-3.5" /></span>
              <div><strong>Não foi possível concluir esta etapa.</strong><div>{mensagemErro}</div></div>
            </div>
          ) : null}

          {codigoEnviado ? (
            <>
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Código enviado por <strong>{usandoEmail ? "e-mail" : "WhatsApp"}</strong>{destino ? <> para <span className="font-mono font-bold">{destino}</span></> : null}.</div>

              <label className="mt-5 block text-sm font-bold text-[var(--foreground)]">
                Código de confirmação
                <Input aria-label="Código de confirmação" className="mt-2 h-14 text-center font-mono text-2xl font-black tracking-[0.22em]" inputMode="numeric" maxLength={6} pattern="[0-9]*" placeholder="000000" value={codigo} onChange={(e) => onCodigoChange(e.target.value)} onPaste={(e) => { onCodigoChange(e.clipboardData.getData("text")); e.preventDefault(); }} />
              </label>

              <div className="mt-3 text-center text-sm font-medium text-[var(--muted)]">{expiraSegundos > 0 ? <span>Código válido por <strong className="text-[var(--foreground)]">{formatarTempo(expiraSegundos)}</strong></span> : <span>Código expirado. Solicite um novo código.</span>}</div>

              <div className="mt-6"><Button className="w-full" size="lg" onClick={onConfirmar} disabled={validando || codigo.length !== 6 || expiraSegundos <= 0} type="button" icon={<Icon name="check" />}>{validando ? "Validando..." : "Confirmar código"}</Button></div>
            </>
          ) : null}

          <div className="mt-6 border-t border-[var(--line)] pt-5">
            <p className="text-center text-sm text-[var(--muted)]">Precisa de ajuda para acessar a votação?</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={onFalarComEntidade} disabled={!numeroEntidade} type="button" icon={<Icon name="whatsapp" />}>Falar com a entidade</Button>
              <Button variant="secondary" onClick={() => { limparSessaoEleicao(slug); router.replace(`/${slug}`); }} type="button">Voltar para eleição</Button>
            </div>
            {!numeroEntidade ? <p className="mt-2 text-center text-xs text-[var(--muted)]">O contato por WhatsApp da entidade não está disponível.</p> : null}
          </div>
        </section>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-[var(--brand)] shadow-sm"><Icon name="check" className="size-3.5" /></span>
          <p>O código é usado apenas para confirmar sua identidade antes da votação. Não compartilhe este código com outras pessoas.</p>
        </div>
      </div>
    </EleicaoLayout>
  );
}