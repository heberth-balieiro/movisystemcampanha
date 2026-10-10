"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ChapaCard } from "@/components/eleicao/ChapaCard";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { buscarCedulaVotacao } from "@/services/eleicao/eleicao.service";
import { limparSessaoEleicao, mensagemIndicaSessaoExpirada, obterTokenVotacao, salvarSelecaoVoto } from "@/services/eleicao/eleicao-session.service";
import type { EleicaoVotacaoDados, TipoVoto } from "@/types/eleicao";

export default function EleicaoVotacaoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EleicaoVotacaoDados | null>(null);
  const [chapaSelecionada, setChapaSelecionada] = useState<number | null>(null);
  const [tipoAlternativo, setTipoAlternativo] = useState<Exclude<TipoVoto, "CHAPA"> | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const tokenVotacao = obterTokenVotacao(slug);
      if (!tokenVotacao) {
        router.replace(`/${slug}/login`);
        return;
      }
      void fetchCedula(tokenVotacao);
    }, 0);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

  async function fetchCedula(tokenVotacao: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await buscarCedulaVotacao(slug, tokenVotacao);
      if (response.erro) {
        const msg = response.mensagem || "Não foi possível carregar a cédula.";
        if (msg === "Seu voto já foi registrado nesta eleição.") {
          limparSessaoEleicao(slug);
          router.replace(`/${slug}`);
          return;
        }
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
        setError(msg);
        return;
      }

      setData(response.dados);
    } catch (err) {
      if (err instanceof Error) {
        const message = err.message || "";
        if (message === "Seu voto já foi registrado nesta eleição.") {
          limparSessaoEleicao(slug);
          router.replace(`/${slug}`);
          return;
        }
        if (mensagemIndicaSessaoExpirada(message)) {
          limparSessaoEleicao(slug, true);
          router.replace(`/${slug}/login`);
          return;
        }
      }
      setError("Erro ao carregar a cédula de votação.");
    } finally {
      setLoading(false);
    }
  }

  function sairDaVotacao() {
    limparSessaoEleicao(slug);
    setChapaSelecionada(null);
    setTipoAlternativo(null);
    router.replace(`/${slug}`);
  }

  if (loading) {
    return (
      <EleicaoLayout>
        <EleicaoMensagem titulo="Realizar votação" mensagem="Carregando cédula..." />
      </EleicaoLayout>
    );
  }

  if (error) {
    return (
      <EleicaoLayout>
        <EleicaoMensagem titulo="Não foi possível carregar a cédula" mensagem={error}>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              onClick={() => {
                const tokenVotacao = obterTokenVotacao(slug);
                if (!tokenVotacao) {
                  router.replace(`/${slug}/login`);
                  return;
                }
                void fetchCedula(tokenVotacao);
              }}
              type="button"
            >
              Tentar novamente
            </Button>
            <Button variant="secondary" onClick={sairDaVotacao} type="button">Sair</Button>
          </div>
        </EleicaoMensagem>
      </EleicaoLayout>
    );
  }

  if (!data) {
    return (
      <EleicaoLayout>
        <EleicaoMensagem titulo="Realizar votação" mensagem="Cédula vazia.">
          <Button variant="secondary" onClick={sairDaVotacao} type="button">Sair</Button>
        </EleicaoMensagem>
      </EleicaoLayout>
    );
  }

  const { eleicao, chapas } = data;
  const possuiSelecao = chapaSelecionada !== null || tipoAlternativo !== null;

  function selecionarChapa(idChapa: number) {
    setChapaSelecionada(idChapa);
    setTipoAlternativo(null);
  }

  function selecionarAlternativa(tipo: Exclude<TipoVoto, "CHAPA">) {
    setChapaSelecionada(null);
    setTipoAlternativo(tipo);
  }

  function continuar() {
    if (!possuiSelecao) return;

    const chapa = chapaSelecionada !== null ? chapas.find((item) => item.id === chapaSelecionada) : null;
    const selecao = chapaSelecionada !== null
      ? {
          tipo_voto: "CHAPA" as const,
          id_chapa: chapaSelecionada,
          numero_chapa: chapa?.numero,
          nome_chapa: chapa?.nome,
        }
      : { tipo_voto: tipoAlternativo as Exclude<TipoVoto, "CHAPA"> };

    salvarSelecaoVoto(slug, selecao);
    router.replace(`/${slug}/confirma-voto`);
  }

  return (
    <EleicaoLayout subtitulo="Escolha sua opção de voto com atenção antes de confirmar.">
      <div className="space-y-8">
        <header className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-strong)]">
                <Icon name="ticket" className="size-3.5" />
                Cédula de votação
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">{eleicao.nome}</h1>
              {eleicao.descricao ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">{eleicao.descricao}</p> : null}
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="flex w-fit items-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-bold text-[var(--muted)] shadow-sm">
                <Icon name="calendar" className="text-[var(--brand)]" />
                Ano {eleicao.ano}
              </div>
              <Button variant="secondary" size="sm" onClick={sairDaVotacao} type="button">
                Sair
              </Button>
            </div>
          </div>
        </header>

        <section aria-labelledby="chapas-title">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">Escolha principal</p>
              <h2 id="chapas-title" className="mt-1 text-xl font-black tracking-tight">Escolha uma chapa</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Selecione uma das opções abaixo para continuar.</p>
            </div>
          </div>

          {chapas.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {chapas.map((chapa) => (
                <ChapaCard key={chapa.id} chapa={chapa} selected={chapaSelecionada === chapa.id && tipoAlternativo === null} onClick={() => selecionarChapa(chapa.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Nenhuma chapa encontrada.</div>
          )}
        </section>

        <section className="rounded-[24px] border border-[var(--line)] bg-white p-5 sm:p-6" aria-labelledby="outras-opcoes-title">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">Alternativas</p>
            <h2 id="outras-opcoes-title" className="mt-1 text-lg font-black">Voto em branco ou nulo</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Essas opções também são válidas e serão confirmadas na próxima etapa.</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["BRANCO", "NULO"] as const).map((tipo) => {
              const selected = tipoAlternativo === tipo;
              const titulo = tipo === "BRANCO" ? "Voto em Branco" : "Voto Nulo";
              const descricao = tipo === "BRANCO" ? "Registra sua participação sem escolher uma chapa." : "Registra um voto nulo nesta eleição.";
              return (
                <button
                  aria-pressed={selected}
                  className={`focus-ring flex min-h-24 items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                    selected ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-strong)] shadow-sm" : "border-[var(--line)] bg-[var(--surface-muted)] hover:border-[var(--brand)]/50 hover:bg-white"
                  }`}
                  key={tipo}
                  onClick={() => selecionarAlternativa(tipo)}
                  type="button"
                >
                  <div>
                    <div className="text-sm font-black text-[var(--foreground)]">{titulo}</div>
                    <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{descricao}</div>
                  </div>
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs font-black ${selected ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)]" : "border-[var(--line)] bg-white text-transparent"}`}>✓</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="sticky bottom-3 z-10 flex flex-col gap-4 rounded-[22px] border border-[var(--line)] bg-white/95 p-4 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.3)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon name="check" className="size-3.5" />
            </span>
            <div>
              <div className="font-bold text-[var(--foreground)]">Revise sua escolha antes de continuar.</div>
              <div>Na próxima tela você ainda poderá conferir a opção antes de registrar o voto.</div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" variant="secondary" size="lg" onClick={sairDaVotacao} type="button">Sair</Button>
            <Button className="w-full sm:w-auto" size="lg" disabled={!possuiSelecao} onClick={continuar} type="button" icon={<Icon name="arrow-right" />}>Continuar</Button>
          </div>
        </div>
      </div>
    </EleicaoLayout>
  );
}
