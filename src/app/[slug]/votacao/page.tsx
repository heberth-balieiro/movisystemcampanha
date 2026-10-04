"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ChapaCard } from "@/components/eleicao/ChapaCard";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
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
            <Button variant="secondary" onClick={() => router.replace(`/${slug}`)} type="button">Voltar para a eleição</Button>
          </div>
        </EleicaoMensagem>
      </EleicaoLayout>
    );
  }

  if (!data) {
    return (
      <EleicaoLayout>
        <EleicaoMensagem titulo="Realizar votação" mensagem="Cédula vazia." />
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
    <EleicaoLayout>
      <div className="space-y-7">
        <header className="border-b border-[var(--line)] pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Cédula de votação</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{eleicao.nome}</h1>
          {eleicao.descricao ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">{eleicao.descricao}</p> : null}
          <div className="mt-2 text-xs font-semibold text-[var(--muted)]">Ano {eleicao.ano}</div>
        </header>

        <section aria-labelledby="chapas-title">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 id="chapas-title" className="text-lg font-bold">Escolha uma chapa</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Selecione uma das opções abaixo para continuar.</p>
            </div>
          </div>

          {chapas.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {chapas.map((chapa) => (
                <ChapaCard key={chapa.id} chapa={chapa} selected={chapaSelecionada === chapa.id && tipoAlternativo === null} onClick={() => selecionarChapa(chapa.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Nenhuma chapa encontrada.</div>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="outras-opcoes-title">
          <div>
            <h2 id="outras-opcoes-title" className="text-base font-bold">Outras opções</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Também é possível registrar voto em branco ou nulo.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["BRANCO", "NULO"] as const).map((tipo) => {
              const selected = tipoAlternativo === tipo;
              return (
                <button
                  aria-pressed={selected}
                  className={`focus-ring flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    selected ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-strong)]" : "border-[var(--line)] bg-white hover:border-[var(--brand)]/50"
                  }`}
                  key={tipo}
                  onClick={() => selecionarAlternativa(tipo)}
                  type="button"
                >
                  Voto {tipo === "BRANCO" ? "em Branco" : "Nulo"}
                  <span className={`grid size-5 place-items-center rounded-full border text-[10px] ${selected ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)]" : "border-[var(--line)] text-transparent"}`}>✓</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[var(--muted)]">Revise a opção selecionada antes de avançar para a confirmação.</div>
          <Button className="w-full sm:w-auto" disabled={!possuiSelecao} onClick={continuar} type="button">Continuar</Button>
        </div>
      </div>
    </EleicaoLayout>
  );
}
