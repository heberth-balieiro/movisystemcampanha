"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  listarProcessosPublicos,
  type ProcessoPublicoView,
} from "@/services/eleicao/processos-publicos.service";

function normalizarOperacao(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  return normalized === "ASSEMBLEIA" ? "ASSEMBLEIA" : "ELEIÇÃO";
}

function formatarDataHora(value: string) {
  if (!value) return "Data não informada";

  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return "Data não informada";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

function ProcessoCard({ processo }: { processo: ProcessoPublicoView }) {
  const operacao = normalizarOperacao(processo.operacao);
  const aberto = processo.situacao.toUpperCase() === "ABERTA";
  const titulo = processo.nome_exibicao?.trim() || processo.nome;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#dbe5e1] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#9fd4c5] hover:shadow-xl hover:shadow-[#006b57]/5">
      {processo.banner_url ? (
        <div className="h-40 overflow-hidden bg-[#edf4f1]">
          <img
            src={processo.banner_url}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {processo.logo_url ? (
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#dbe5e1] bg-white p-1.5">
                <img src={processo.logo_url} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            ) : null}

            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-[#dff5ee] px-3 py-1 text-[11px] font-black tracking-wide text-[#006b57]">
                {operacao}
              </span>
              <p className="mt-2 truncate text-xs font-semibold uppercase tracking-[0.12em] text-[#82909d]">
                {processo.empresa}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
              aberto
                ? "bg-[#00866a] text-white"
                : "bg-[#edf4f1] text-[#526373]"
            }`}
          >
            {aberto ? "Em andamento" : "Próxima"}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-black leading-tight text-[#07131f]">{titulo}</h3>
        {processo.descricao ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5b6978]">{processo.descricao}</p>
        ) : null}

        <div className="mt-5 grid gap-2 rounded-2xl bg-[#f7faf9] p-4 text-sm text-[#526373] sm:grid-cols-2">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wide text-[#82909d]">Início</span>
            <span className="mt-1 block font-semibold text-[#314255]">{formatarDataHora(processo.data_hora_inicio)}</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wide text-[#82909d]">Término</span>
            <span className="mt-1 block font-semibold text-[#314255]">{formatarDataHora(processo.data_hora_fim)}</span>
          </div>
        </div>

        <Link
          href={`/${processo.slug}`}
          className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-black transition sm:w-auto ${
            aberto
              ? "bg-[#00866a] text-white hover:bg-[#006b57]"
              : "border border-[#cbd8d3] bg-white text-[#314255] hover:border-[#00866a] hover:text-[#006b57]"
          }`}
        >
          {aberto ? "Participar agora" : "Ver detalhes"}
        </Link>
      </div>
    </article>
  );
}

export function PublicProcesses() {
  const [processos, setProcessos] = useState<ProcessoPublicoView[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    listarProcessosPublicos()
      .then((dados) => {
        if (!ativo) return;
        setProcessos(dados);
        setErro("");
      })
      .catch((error) => {
        if (!ativo) return;
        setErro(error instanceof Error ? error.message : "Não foi possível carregar os processos disponíveis.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const abertas = useMemo(
    () => processos.filter((item) => item.situacao.toUpperCase() === "ABERTA"),
    [processos],
  );
  const proximas = useMemo(
    () => processos.filter((item) => item.situacao.toUpperCase() !== "ABERTA"),
    [processos],
  );

  if (carregando) {
    return (
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-3xl border border-[#dbe5e1] bg-[#f3f7f5]" />
        ))}
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mt-9 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
        Não foi possível carregar as eleições e assembleias neste momento.
      </div>
    );
  }

  if (processos.length === 0) {
    return (
      <div className="mt-9 rounded-3xl border border-[#dbe5e1] bg-[#f7faf9] p-7 text-center">
        <h3 className="text-xl font-black text-[#07131f]">Nenhum processo disponível agora</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5b6978]">
          Quando uma entidade publicar uma eleição ou assembleia, ela aparecerá automaticamente nesta área.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-9 space-y-10">
      {abertas.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00866a]" />
            <h3 className="text-lg font-black text-[#07131f]">Em andamento</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {abertas.map((processo) => (
              <ProcessoCard key={`${processo.empresa_id}-${processo.id}`} processo={processo} />
            ))}
          </div>
        </div>
      ) : null}

      {proximas.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#9fb0bc]" />
            <h3 className="text-lg font-black text-[#07131f]">Próximas</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {proximas.map((processo) => (
              <ProcessoCard key={`${processo.empresa_id}-${processo.id}`} processo={processo} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
