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

type HoverPoint = {
  serieId: number;
  hora: string;
  x: number;
  y: number;
  numero: number;
  nome: string;
  percentual: number;
  acumulado: number;
};

const PALETA = ["#1e6f5c", "#2563eb", "#c7683c", "#7c3aed", "#0891b2", "#be123c"];

export function AdminEvolucaoApuracao({ slug }: { slug: string }) {
  const [dados, setDados] = useState<EvolucaoDados | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoverPoint, setHoverPoint] = useState<HoverPoint | null>(null);

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

    const series: Serie[] = [];

    for (const [id, chapa] of chapasMap) {
      let acumulado = 0;
      const pontos = horas.map((hora) => {
        acumulado += chapa.porHora.get(hora) || 0;
        return acumulado;
      });
      series.push({ id, numero: chapa.numero, nome: chapa.nome, pontos, percentuais: [] });
    }

    horas.forEach((_, index) => {
      const total = series.reduce((sum, serie) => sum + serie.pontos[index], 0);
      for (const serie of series) {
        serie.percentuais[index] = total > 0 ? (serie.pontos[index] / total) * 100 : 0;
      }
    });

    return { horas, series };
  }, [dados]);

  if (loading || !grafico || grafico.horas.length === 0) return null;

  const width = 760;
  const height = grafico.horas.length <= 3 ? 240 : 300;
  const left = 48;
  const right = 78;
  const top = 24;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const xFor = (index: number) => left + (grafico.horas.length === 1 ? plotWidth / 2 : (index / (grafico.horas.length - 1)) * plotWidth);
  const yFor = (pct: number) => top + plotHeight - (Math.max(0, Math.min(100, pct)) / 100) * plotHeight;
  const ultimoIndex = grafico.horas.length - 1;

  return (
    <section className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Apuração</p>
        <h2 className="mt-1 text-xl font-black">Evolução da apuração</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Acompanhe a participação percentual de cada chapa ao longo do período de votação.</p>
      </div>

      <div className="relative mt-5 overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-3 sm:p-5">
        <svg
          className="min-w-[700px]"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Evolução percentual das chapas por horário"
          onMouseLeave={() => setHoverPoint(null)}
        >
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
            <text key={hora} x={xFor(index)} y={height - 16} textAnchor="middle" fontSize="11" fill="#66736d">{hora}</text>
          ))}

          {grafico.series.map((serie, serieIndex) => {
            const cor = PALETA[serieIndex % PALETA.length];
            const pontos = serie.percentuais.map((pct, index) => `${xFor(index)},${yFor(pct)}`).join(" ");
            const percentualAtual = serie.percentuais[ultimoIndex] || 0;
            const xAtual = xFor(ultimoIndex);
            const yAtual = yFor(percentualAtual);

            return (
              <g key={serie.id}>
                <polyline points={pontos} fill="none" stroke={cor} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

                {serie.percentuais.map((pct, index) => {
                  const x = xFor(index);
                  const y = yFor(pct);
                  const isUltimo = index === ultimoIndex;

                  return (
                    <circle
                      key={`${serie.id}-${grafico.horas[index]}`}
                      cx={x}
                      cy={y}
                      r={isUltimo ? 6.5 : 4.5}
                      fill={cor}
                      stroke="white"
                      strokeWidth={isUltimo ? 3 : 2}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverPoint({
                        serieId: serie.id,
                        hora: grafico.horas[index],
                        x,
                        y,
                        numero: serie.numero,
                        nome: serie.nome,
                        percentual: pct,
                        acumulado: serie.pontos[index],
                      })}
                      onMouseMove={() => setHoverPoint({
                        serieId: serie.id,
                        hora: grafico.horas[index],
                        x,
                        y,
                        numero: serie.numero,
                        nome: serie.nome,
                        percentual: pct,
                        acumulado: serie.pontos[index],
                      })}
                    />
                  );
                })}

                <text
                  x={xAtual + 12}
                  y={yAtual + 4}
                  fontSize="11"
                  fontWeight="800"
                  fill={cor}
                >
                  {percentualAtual.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
                </text>
              </g>
            );
          })}

          {hoverPoint ? (
            <g pointerEvents="none">
              <line
                x1={hoverPoint.x}
                x2={hoverPoint.x}
                y1={top}
                y2={top + plotHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <g transform={`translate(${Math.min(Math.max(hoverPoint.x - 82, left), width - 190)}, ${Math.max(hoverPoint.y - 78, 8)})`}>
                <rect width="174" height="60" rx="10" fill="#17211e" opacity="0.96" />
                <text x="12" y="18" fontSize="10" fontWeight="700" fill="#ffffff">
                  {`Chapa ${String(hoverPoint.numero).padStart(2, "0")} — ${hoverPoint.nome}`}
                </text>
                <text x="12" y="36" fontSize="11" fontWeight="800" fill="#ffffff">
                  {`${hoverPoint.percentual.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`}
                </text>
                <text x="78" y="36" fontSize="10" fill="#d1d5db">
                  {`${hoverPoint.acumulado} ${hoverPoint.acumulado === 1 ? "voto" : "votos"}`}
                </text>
                <text x="12" y="51" fontSize="9" fill="#cbd5e1">{hoverPoint.hora}</text>
              </g>
            </g>
          ) : null}
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
