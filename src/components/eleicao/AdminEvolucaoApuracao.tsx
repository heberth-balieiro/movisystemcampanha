"use client";

import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/services/api";
import { mensagemIndicaSessaoExpirada, obterTokenAdmin } from "@/services/eleicao/eleicao-session.service";

type EvolucaoItem = {
  hora: string;
  id_chapa: number;
  numero: number;
  nome: string;
  quantidade_hora: number;
};

type EvolucaoDados = {
  situacao: string;
  itens: EvolucaoItem[];
};

type Serie = {
  id: number;
  numero: number;
  nome: string;
  pontos: number[];
  percentuais: number[];
};

const PALETA = ["#1e6f5c", "#2563eb", "#c7683c", "#7c3aed", "#0891b2", "#be123c"];

export function AdminEvolucaoApuracao({ slug }: { slug: string }) {
  const [dados, setDados] = useState<EvolucaoDados | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const token = obterTokenAdmin(slug);
      if (!token) {
        if (ativo) setLoading(false);
        return;
      }

      try {
        const resposta = await apiFetch<EvolucaoDados>(`/api/v1/eleicao/${encodeURIComponent(slug)}/admin/evolucao-apuracao`, {
          method: "GET",
          token,
          cache: "no-store",
          redirectOnUnauthorized: false,
        });
        if (ativo) setDados(resposta.dados);
      } catch (error) {
        if (error instanceof Error && mensagemIndicaSessaoExpirada(error.message)) {
          if (ativo) setDados(null);
        } else if (ativo) {
          // A API retorna erro quando a eleição ainda não entrou em apuração.
          setDados(null);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    void carregar();
    const id = window.setInterval(carregar, 30000);

    return () => {
      ativo = false;
      window.clearInterval(id);
    };
  }, [slug]);

  const grafico = useMemo(() => {
    if (!dados?.itens?.length) return null;

    const horas = Array.from(new Set(dados.itens.map((item) => item.hora))).sort();
    const chapasMap = new Map<number, { numero: number; nome: string; porHora: Map<string, number> }>();

    for (const item of dados.itens) {
      if (!chapasMap.has(item.id_chapa)) {
        chapasMap.set(item.id_chapa, { numero: item.numero, nome: item.nome, porHora: new Map() });
      }
      chapasMap.get(item.id_chapa)!.porHora.set(item.hora, item.quantidade_hora);
    }

    const acumuladosPorHora = new Map<string, number>();
    const series: Serie[] = [];

    for (const [id, chapa] of chapasMap) {
      let acumulado = 0;
      const pontos = horas.map((hora) => {
        acumulado += chapa.porHora.get(hora) || 0;
        return acumulado;
      });
      series.push({ id, numero: chapa.numero, nome: chapa.nome, pontos, percentuais: [] });
    }

    horas.forEach((hora, index) => {
      const total = series.reduce((sum, serie) => sum + serie.pontos[index], 0);
      acumuladosPorHora.set(hora, total);
      for (const serie of series) {
        serie.percentuais[index] = total > 0 ? (serie.pontos[index] / total) * 100 : 0;
      }
    });

    return { horas, series };
  }, [dados]);

  if (loading || !grafico || grafico.horas.length === 0) return null;

  const width = 760;
  const height = 300;
  const left = 48;
  const right = 20;
  const top = 24;
  const bottom = 50;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const xFor = (index: number) => left + (grafico.horas.length === 1 ? plotWidth / 2 : (index / (grafico.horas.length - 1)) * plotWidth);
  const yFor = (pct: number) => top + plotHeight - (Math.max(0, Math.min(100, pct)) / 100) * plotHeight;

  return (
    <section className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Apuração</p>
        <h2 className="mt-1 text-xl font-black">Evolução da apuração</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe a participação percentual de cada chapa ao longo do período de votação.</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-3 sm:p-5">
        <svg className="min-w-[700px]" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolução percentual das chapas por horário">
          {[0, 20, 40, 60, 80, 100].map((pct) => {
            const y = yFor(pct);
            return (
              <g key={pct}>
                <line x1={left} x2={width - right} y1={y} y2={y} stroke="#d8e0dc" strokeWidth="1" />
                <text x={left - 9} y={y + 4} textAnchor="end" fontSize="11" fill="#66736d">{pct}%</text>
              </g>
            );
          })}

          {grafico.horas.map((hora, index) => (
            <text key={hora} x={xFor(index)} y={height - 18} textAnchor="middle" fontSize="11" fill="#66736d">{hora}</text>
          ))}

          {grafico.series.map((serie, serieIndex) => {
            const cor = PALETA[serieIndex % PALETA.length];
            const pontos = serie.percentuais.map((pct, index) => `${xFor(index)},${yFor(pct)}`).join(" ");
            return (
              <g key={serie.id}>
                <polyline points={pontos} fill="none" stroke={cor} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                {serie.percentuais.map((pct, index) => (
                  <circle key={`${serie.id}-${grafico.horas[index]}`} cx={xFor(index)} cy={yFor(pct)} r="4.5" fill={cor} stroke="white" strokeWidth="2">
                    <title>{`Chapa ${String(serie.numero).padStart(2, "0")} - ${serie.nome}: ${pct.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}% às ${grafico.horas[index]}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {grafico.series.map((serie, index) => (
          <div key={serie.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-bold">
            <span className="size-3 rounded-full" style={{ backgroundColor: PALETA[index % PALETA.length] }} />
            Chapa {String(serie.numero).padStart(2, "0")} — {serie.nome}
          </div>
        ))}
      </div>
    </section>
  );
}
