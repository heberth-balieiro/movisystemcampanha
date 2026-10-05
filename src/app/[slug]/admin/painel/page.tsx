"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminRelatorioImpressao, type AuditoriaRelatorioFiltros, type RelatorioImpressaoTipo } from "@/components/eleicao/AdminRelatorioImpressao";
import { useEleicaoEntidade } from "@/components/eleicao/EleicaoContext";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { imagemBase64 } from "@/lib/image";
import { limparSessaoAdmin, mensagemIndicaSessaoExpirada, obterNomeAdmin, obterTokenAdmin } from "@/services/eleicao/eleicao-session.service";
import {
  buscarAuditoriaAdminEleicao,
  buscarPainelAdminEleicao,
  buscarResultadoAdminEleicao,
  encerrarEleicaoAdmin,
  finalizarApuracaoAdmin,
  iniciarApuracaoAdmin,
  publicarResultadoAdmin,
} from "@/services/eleicao/eleicao.service";
import type { EleicaoAdminPainelDados, EleicaoAdminResultadoDados, EleicaoAuditoriaItem } from "@/types/eleicao";

function DonutChart({ yes, no }: { yes: number; no: number }) {
  const total = yes + no || 1;
  const pct = Math.round((yes / total) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <svg aria-label={`Participação ${pct}%`} className="h-28 w-28 sm:h-32 sm:w-32" role="img" viewBox="0 0 120 120">
      <g transform="translate(60,60)">
        <circle r={radius} fill="var(--surface-muted)" />
        <circle r={radius} fill="transparent" stroke="var(--line)" strokeWidth={18} />
        <circle r={radius} fill="transparent" stroke="var(--brand)" strokeWidth={18} strokeDasharray={`${dash} ${circumference - dash}`} strokeLinecap="round" transform="rotate(-90)" />
        <text y="6" textAnchor="middle" fontSize="14" fontWeight={800} fill="var(--foreground)">{pct}%</text>
      </g>
    </svg>
  );
}

function Bars({ items }: { items: { hora: string; quantidade: number }[] }) {
  const max = Math.max(...items.map((i) => i.quantidade), 1);

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-end gap-3 pt-4">
        {items.map((it) => (
          <div key={it.hora} className="flex w-12 flex-col items-center justify-end text-center">
            <div className="text-[10px] font-bold text-[var(--muted)]">{it.quantidade}</div>
            <div style={{ height: `${Math.max((it.quantidade / max) * 120, 8)}px` }} className="mt-1 w-8 rounded-t-lg bg-[var(--brand)]" />
            <div className="mt-1 text-[10px] font-semibold text-[var(--muted)]">{it.hora}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultadoChapas({ resultado }: { resultado: EleicaoAdminResultadoDados }) {
  const chapas = [...resultado.chapas].sort((a, b) => b.quantidade_votos - a.quantidade_votos || a.numero - b.numero);
  const maior = Math.max(...chapas.map((item) => item.quantidade_votos), 0);

  if (!chapas.length) {
    return <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Nenhuma chapa disponível para exibição.</div>;
  }

  return (
    <div className="space-y-3">
      {chapas.map((chapa, index) => {
        const lider = maior > 0 && chapa.quantidade_votos === maior;
        const percentual = Number(chapa.percentual) || 0;

        return (
          <article key={chapa.id} className={`rounded-2xl border p-4 sm:p-5 ${lider ? "border-[var(--brand)]/30 bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-black text-[var(--brand)]">{index + 1}</span>
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--brand)]">Chapa {String(chapa.numero).padStart(2, "0")}</span>
                  {lider ? <Badge variant="info">Mais votada</Badge> : null}
                </div>
                <h4 className="mt-2 truncate text-base font-black sm:text-lg">{chapa.nome}</h4>
              </div>

              <div className="flex items-end gap-3 sm:block sm:text-right">
                <div className="text-2xl font-black tracking-tight">{percentual.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%</div>
                <div className="text-xs font-semibold text-[var(--muted)] sm:mt-1">{chapa.quantidade_votos} voto(s)</div>
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${Math.max(0, Math.min(percentual, 100))}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ResumoVotacaoChart({ resultado }: { resultado: EleicaoAdminResultadoDados }) {
  const total = resultado.resumo.total_votos || 1;
  const validos = (resultado.resumo.votos_validos / total) * 100;
  const brancos = (resultado.resumo.votos_brancos / total) * 100;
  const nulos = (resultado.resumo.votos_nulos / total) * 100;

  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full bg-slate-100" aria-label="Composição dos votos">
        <div className="bg-[var(--brand)]" style={{ width: `${validos}%` }} title={`Válidos: ${validos.toFixed(1)}%`} />
        <div className="bg-amber-400" style={{ width: `${brancos}%` }} title={`Brancos: ${brancos.toFixed(1)}%`} />
        <div className="bg-slate-400" style={{ width: `${nulos}%` }} title={`Nulos: ${nulos.toFixed(1)}%`} />
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2"><span>Válidos</span><strong>{resultado.resumo.votos_validos}</strong></div>
        <div className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2"><span>Brancos</span><strong>{resultado.resumo.votos_brancos}</strong></div>
        <div className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2"><span>Nulos</span><strong>{resultado.resumo.votos_nulos}</strong></div>
      </div>
    </div>
  );
}

const AUTO_REFRESH_INTERVAL_MS = 30000;
const AUDITORIA_PAGE_SIZE = 20;

export default function AdminPainelPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const entidade = useEleicaoEntidade();
  const tokenAdmin = obterTokenAdmin(slug);
  const nomeAdmin = obterNomeAdmin(slug);
  const logoEmpresa = imagemBase64(entidade?.logo);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [data, setData] = useState<EleicaoAdminPainelDados | null>(null);
  const [resultado, setResultado] = useState<EleicaoAdminResultadoDados | null>(null);
  const [resultadoLoading, setResultadoLoading] = useState(false);
  const [resultadoError, setResultadoError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"painel" | "relatorios" | "auditoria">("painel");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmApuracaoOpen, setConfirmApuracaoOpen] = useState(false);
  const [confirmFinalizarOpen, setConfirmFinalizarOpen] = useState(false);
  const [confirmPublicarOpen, setConfirmPublicarOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [apurando, setApurando] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [auditoriaLoading, setAuditoriaLoading] = useState(false);
  const [auditoriaError, setAuditoriaError] = useState<string | null>(null);
  const [auditoria, setAuditoria] = useState<EleicaoAuditoriaItem[] | null>(null);
  const [auditoriaPage, setAuditoriaPage] = useState(1);
  const [filtroTipoEvento, setFiltroTipoEvento] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [filtroSucesso, setFiltroSucesso] = useState("");
  const [filtroDataInicial, setFiltroDataInicial] = useState("");
  const [filtroDataFinal, setFiltroDataFinal] = useState("");
  const [filtroMensagem, setFiltroMensagem] = useState<string | null>(null);
  const [auditoriaFiltrosAplicados, setAuditoriaFiltrosAplicados] = useState<AuditoriaRelatorioFiltros>({});

  const [relatorioImpressao, setRelatorioImpressao] = useState<RelatorioImpressaoTipo | null>(null);
  const [relatorioGeradoEm, setRelatorioGeradoEm] = useState<Date | null>(null);

  const evolucaoItems = useMemo(() => data?.evolucao || [], [data]);
  const auditoriaPaginada = useMemo(() => {
    if (!auditoria) return [];
    const inicio = (auditoriaPage - 1) * AUDITORIA_PAGE_SIZE;
    return auditoria.slice(inicio, inicio + AUDITORIA_PAGE_SIZE);
  }, [auditoria, auditoriaPage]);

  useEffect(() => {
    if (!tokenAdmin) {
      router.replace(`/${slug}/admin/login`);
      return;
    }
    void fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

  useEffect(() => {
    if (!autoRefreshEnabled || !tokenAdmin) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible" || refreshing || closing || apurando || finalizando || publicando) return;
      void fetchData();
    }, AUTO_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefreshEnabled, tokenAdmin, slug, refreshing, closing, apurando, finalizando, publicando]);

  useEffect(() => {
    const onAfterPrint = () => setRelatorioImpressao(null);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  async function fetchResultado(silent = false) {
    if (!tokenAdmin) return;
    if (!silent || !resultado) setResultadoLoading(true);
    setResultadoError(null);
    try {
      const res = await buscarResultadoAdminEleicao(slug, tokenAdmin);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao carregar resultado.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        if (!silent) setResultadoError(msg);
        return;
      }
      setResultado(res.dados);
    } catch {
      if (!silent) setResultadoError("Erro ao carregar resultado da apuração.");
    } finally {
      setResultadoLoading(false);
    }
  }

  async function fetchData(initialLoad = false) {
    if (initialLoad) {
      setLoading(true);
      setError(null);
    }
    setRefreshError(null);

    try {
      const response = await buscarPainelAdminEleicao(slug, tokenAdmin || "");
      if (response.erro) {
        const msg = response.mensagem || "Erro ao carregar painel.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        if (initialLoad) setError(msg);
        else setRefreshError("Não foi possível atualizar os dados. As informações anteriores foram mantidas.");
        return;
      }

      setData(response.dados);
      const situacao = response.dados?.eleicao?.situacao;
      if (situacao === "APURADA" || situacao === "PUBLICADA") {
        await fetchResultado(!initialLoad);
      } else {
        setResultado(null);
        setResultadoError(null);
      }
      setLastUpdatedAt(new Date());
    } catch {
      if (initialLoad) setError("Erro ao carregar painel.");
      else setRefreshError("Não foi possível atualizar os dados. As informações anteriores foram mantidas.");
    } finally {
      if (initialLoad) setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      await fetchData();
      if (activeTab === "auditoria") await fetchAuditoria(true);
    } finally {
      setRefreshing(false);
    }
  }

  async function executarAcao(
    acao: () => Promise<{ erro: boolean; mensagem: string; dados: unknown }>,
    mensagemSucesso: string,
    setBusy: (value: boolean) => void,
    fechar: () => void,
  ) {
    if (!tokenAdmin) {
      limparSessaoAdmin(slug);
      router.replace(`/${slug}/admin/login`);
      return;
    }

    setBusy(true);
    setActionMessage(null);
    try {
      const res = await acao();
      if (res.erro) {
        const msg = res.mensagem || "Não foi possível concluir a ação.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        setActionMessage(msg);
        return;
      }
      fechar();
      setActionMessage(mensagemSucesso);
      await fetchData();
    } catch {
      setActionMessage("Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  }

  async function fetchAuditoria(useFiltros = true, resetPage = false) {
    if (!tokenAdmin) return;
    if (resetPage) setAuditoriaPage(1);
    setAuditoriaLoading(true);
    setAuditoriaError(null);
    setFiltroMensagem(null);

    if (filtroDataInicial && filtroDataFinal && new Date(filtroDataFinal) < new Date(filtroDataInicial)) {
      setFiltroMensagem("A data final não pode ser menor que a data inicial.");
      setAuditoriaLoading(false);
      return;
    }

    const filtros = useFiltros
      ? {
          tipo_evento: filtroTipoEvento || undefined,
          origem: filtroOrigem || undefined,
          sucesso: filtroSucesso || undefined,
          data_inicial: filtroDataInicial || undefined,
          data_final: filtroDataFinal || undefined,
        }
      : undefined;

    try {
      const res = await buscarAuditoriaAdminEleicao(slug, tokenAdmin, filtros);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao carregar auditoria.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        setAuditoriaError(msg);
        setAuditoria(null);
        return;
      }
      setAuditoria(res.dados || []);
      setAuditoriaFiltrosAplicados(
        useFiltros
          ? {
              tipoEvento: filtroTipoEvento || undefined,
              origem: filtroOrigem || undefined,
              sucesso: filtroSucesso || undefined,
              dataInicial: filtroDataInicial || undefined,
              dataFinal: filtroDataFinal || undefined,
            }
          : {},
      );
    } catch {
      setAuditoriaError("Erro ao carregar auditoria.");
    } finally {
      setAuditoriaLoading(false);
    }
  }

  function onLogout() {
    limparSessaoAdmin(slug);
    router.replace(`/${slug}/admin/login`);
  }

  function imprimirRelatorio(tipo: RelatorioImpressaoTipo) {
    if (tipo === "evolucao" && evolucaoItems.length === 0) return;
    if ((tipo === "resultado" || tipo === "ata") && !resultado) return;
    if (tipo === "auditoria" && (!auditoria || auditoria.length === 0)) return;
    setRelatorioGeradoEm(new Date());
    setRelatorioImpressao(tipo);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.print()));
  }

  function formatDateTime(value: string | null) {
    if (!value) return "-";
    const dataHora = new Date(value);
    return Number.isNaN(dataHora.getTime()) ? value : dataHora.toLocaleString("pt-BR");
  }

  function mapEventoLabel(tipo: string) {
    const mapa: Record<string, string> = {
      LOGIN_SUCESSO: "Login realizado",
      LOGIN_FALHA: "Falha no login",
      CODIGO_ENVIADO: "Código enviado",
      CODIGO_VALIDADO: "Código validado",
      CODIGO_INVALIDO: "Código inválido",
      VOTO_REGISTRADO: "Voto registrado",
      ELEICAO_ENCERRADA: "Eleição encerrada",
      APURACAO_INICIADA: "Apuração iniciada",
      APURACAO_FINALIZADA: "Apuração finalizada",
      RESULTADO_PUBLICADO: "Resultado publicado",
    };
    return mapa[tipo] || tipo;
  }

  if (loading) {
    return <EleicaoLayout maxWidthClass="max-w-7xl"><EleicaoLoading /></EleicaoLayout>;
  }

  if (error || !data) {
    return (
      <EleicaoLayout maxWidthClass="max-w-7xl">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-[var(--danger-soft)] p-6 text-center">
          <h1 className="text-lg font-black text-red-900">Não foi possível carregar o painel</h1>
          <p className="mt-2 text-sm text-red-800">{error || "Os dados do painel não foram retornados."}</p>
          <div className="mt-5 flex justify-center gap-2"><Button onClick={() => void fetchData(true)}>Tentar novamente</Button><Button variant="secondary" onClick={() => router.replace(`/${slug}/admin/login`)}>Ir para login</Button></div>
        </div>
      </EleicaoLayout>
    );
  }

  const eleicao = data.eleicao;
  const resumo = data.resumo;
  const podeExibirResultado = eleicao.situacao === "APURADA" || eleicao.situacao === "PUBLICADA";

  return (
    <>
      <EleicaoLayout maxWidthClass="max-w-7xl">
        <div className="space-y-6">
          {actionMessage && !confirmOpen && !confirmApuracaoOpen && !confirmFinalizarOpen && !confirmPublicarOpen ? (
            <div className="rounded-xl border border-emerald-200 bg-[var(--success-soft)] px-4 py-3 text-sm font-medium text-emerald-900">{actionMessage}</div>
          ) : null}

          <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-muted)]">
            <div className="h-1.5 bg-gradient-to-r from-[var(--brand)] via-[var(--brand)] to-[var(--accent)]" />
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm sm:size-24">
                    {logoEmpresa ? <img src={logoEmpresa} alt={`Logo ${entidade?.nome_exibicao || "da empresa"}`} className="h-full w-full object-contain p-2" /> : <span className="text-xl font-black text-[var(--brand)]">{(entidade?.nome_exibicao || "EV").split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Painel administrativo</p><Badge variant={eleicao.situacao === "ABERTA" ? "success" : eleicao.situacao === "PUBLICADA" ? "info" : "muted"}>{eleicao.situacao}</Badge></div>
                    <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{eleicao.nome}</h1>
                    <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{entidade?.nome_exibicao}</p>
                    <div className="mt-3 grid gap-1 text-sm text-[var(--muted)] sm:grid-cols-2 sm:gap-x-6"><span><strong className="text-[var(--foreground)]">Início:</strong> {formatDateTime(eleicao.data_hora_inicio)}</span><span><strong className="text-[var(--foreground)]">Fim:</strong> {formatDateTime(eleicao.data_hora_fim)}</span></div>
                  </div>
                </div>

                <div className="lg:text-right">
                  <div className="text-sm font-bold">Olá, {nomeAdmin || "Administrador"}</div>
                  <div className="mt-1 text-xs text-[var(--muted)]">Última atualização: {lastUpdatedAt ? lastUpdatedAt.toLocaleString("pt-BR") : "-"}</div>
                  <div className="mt-3 flex flex-wrap gap-2 lg:justify-end"><Button variant="secondary" size="sm" onClick={() => setAutoRefreshEnabled((v) => !v)}>{autoRefreshEnabled ? "Auto: 30s" : "Auto: desligado"}</Button><Button size="sm" onClick={onRefresh} disabled={refreshing}>{refreshing ? "Atualizando..." : "Atualizar dados"}</Button><Button size="sm" variant="ghost" onClick={onLogout}>Sair</Button></div>
                </div>
              </div>
            </div>
          </section>

          {refreshError ? <div className="rounded-xl border border-amber-200 bg-[var(--warning-soft)] px-4 py-3 text-sm text-amber-900">{refreshError}</div> : null}

          <nav className="inline-flex w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-1 sm:w-auto"><Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "painel" ? "primary" : "ghost"} onClick={() => setActiveTab("painel")}>Painel</Button><Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "relatorios" ? "primary" : "ghost"} onClick={() => setActiveTab("relatorios")}>Relatórios</Button><Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "auditoria" ? "primary" : "ghost"} onClick={async () => { setActiveTab("auditoria"); if (!auditoria) await fetchAuditoria(true, true); }}>Auditoria</Button></nav>

          {activeTab === "painel" ? (
            <div className="space-y-6">
              <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[{ valor: resumo.total_eleitores, label: "Eleitores aptos" }, { valor: resumo.total_votantes, label: "Votos registrados" }, { valor: resumo.total_nao_votantes, label: "Ainda não votaram" }, { valor: `${resumo.percentual_participacao}%`, label: "Participação" }].map((item) => <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-white p-5 text-center shadow-sm"><div className="text-3xl font-black">{item.valor}</div><div className="mt-1 text-sm text-[var(--muted)]">{item.label}</div></div>)}
              </section>

              {eleicao.situacao === "ABERTA" ? <section className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black">Encerramento da votação</h2><p className="mt-1 text-sm text-[var(--muted)]">Ao encerrar, novos votos não poderão ser registrados.</p></div><Button variant="danger" onClick={() => { setActionMessage(null); setConfirmOpen(true); }}>Encerrar votação</Button></section> : null}
              {eleicao.situacao === "ENCERRADA" ? <section className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black">Apuração disponível</h2><p className="mt-1 text-sm text-[var(--muted)]">Inicie a apuração quando estiver pronto.</p></div><Button onClick={() => setConfirmApuracaoOpen(true)}>Iniciar apuração</Button></section> : null}
              {eleicao.situacao === "EM_APURACAO" ? <section className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black">Apuração em andamento</h2><p className="mt-1 text-sm text-[var(--muted)]">Finalize esta etapa para consolidar o resultado.</p></div><Button onClick={() => setConfirmFinalizarOpen(true)}>Finalizar apuração</Button></section> : null}
              {eleicao.situacao === "APURADA" ? <section className="flex flex-col gap-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black">Resultado pronto para publicação</h2><p className="mt-1 text-sm text-[var(--muted)]">Após publicar, o resultado poderá ser consultado na área pública.</p></div><Button onClick={() => setConfirmPublicarOpen(true)}>Publicar resultado</Button></section> : null}

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h2 className="text-base font-black">Participação</h2><p className="mt-1 text-sm text-[var(--muted)]">Visão geral da adesão dos eleitores.</p><div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><DonutChart yes={resumo.total_votantes} no={resumo.total_nao_votantes} /><div className="grid w-full max-w-xs gap-2 text-sm"><div className="flex justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2"><span>Votaram</span><strong>{resumo.total_votantes}</strong></div><div className="flex justify-between rounded-lg bg-[var(--surface-muted)] px-3 py-2"><span>Não votaram</span><strong>{resumo.total_nao_votantes}</strong></div></div></div></div>
                <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h2 className="text-base font-black">Evolução</h2><p className="mt-1 text-sm text-[var(--muted)]">Votos registrados por faixa de horário.</p><div className="mt-4">{evolucaoItems.length ? <Bars items={evolucaoItems.map((item) => ({ hora: item.hora, quantidade: item.quantidade }))} /> : <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Ainda não há votos registrados.</div>}</div></div>
              </section>

              {podeExibirResultado ? (
                <section className="space-y-5 rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Apuração</p><h2 className="mt-1 text-xl font-black">Resultado por chapa</h2><p className="mt-1 text-sm text-[var(--muted)]">Comparativo visual do resultado consolidado da eleição.</p></div><Badge variant="info">{eleicao.situacao}</Badge></div>
                  {resultadoLoading ? <div className="text-sm text-[var(--muted)]">Carregando resultado...</div> : null}
                  {resultadoError ? <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] p-4 text-sm text-red-800">{resultadoError}</div> : null}
                  {resultado ? (
                    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
                      <div><ResultadoChapas resultado={resultado} /></div>
                      <aside className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-5"><div><p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Votação</p><div className="mt-1 text-3xl font-black">{resultado.resumo.total_votos}</div><div className="text-sm text-[var(--muted)]">voto(s) registrado(s)</div></div><ResumoVotacaoChart resultado={resultado} /></aside>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          ) : activeTab === "relatorios" ? (
            <section className="space-y-5">
              <div><p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Visão administrativa</p><h2 className="mt-1 text-2xl font-black">Relatórios da eleição</h2><p className="mt-1 text-sm text-[var(--muted)]">Consolidação dos dados disponíveis para conferência e impressão.</p></div>
              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h3 className="font-black">Resumo de participação</h3><p className="mt-1 text-sm text-[var(--muted)]">Eleitores aptos, participação e pendências.</p><Button className="mt-4" size="sm" variant="secondary" onClick={() => imprimirRelatorio("participacao")}>Imprimir resumo</Button></article>
                <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h3 className="font-black">Evolução da participação</h3><p className="mt-1 text-sm text-[var(--muted)]">Distribuição dos votos ao longo do período.</p><Button className="mt-4" size="sm" variant="secondary" disabled={!evolucaoItems.length} onClick={() => imprimirRelatorio("evolucao")}>Imprimir evolução</Button></article>
                <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h3 className="font-black">Resultado da apuração</h3><p className="mt-1 text-sm text-[var(--muted)]">Resultado consolidado por chapa.</p><Button className="mt-4" size="sm" variant="secondary" disabled={!resultado} onClick={() => imprimirRelatorio("resultado")}>Imprimir resultado</Button></article>
                <article className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm"><h3 className="font-black">Ata da eleição</h3><p className="mt-1 text-sm text-[var(--muted)]">Documento com participação, resultado e assinaturas.</p><Button className="mt-4" size="sm" variant="secondary" disabled={!resultado} onClick={() => imprimirRelatorio("ata")}>Gerar ata</Button></article>
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-black">Auditoria</h2><p className="mt-1 text-sm text-[var(--muted)]">Eventos operacionais registrados para esta eleição.</p></div><Button size="sm" variant="secondary" disabled={!auditoria?.length} onClick={() => imprimirRelatorio("auditoria")}>Imprimir auditoria</Button></div>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-semibold">Evento<Select className="mt-2" value={filtroTipoEvento} onChange={(e) => setFiltroTipoEvento(e.target.value)}><option value="">Todos</option><option value="LOGIN_SUCESSO">Login realizado</option><option value="LOGIN_FALHA">Falha no login</option><option value="VOTO_REGISTRADO">Voto registrado</option><option value="ELEICAO_ENCERRADA">Eleição encerrada</option><option value="APURACAO_INICIADA">Apuração iniciada</option><option value="APURACAO_FINALIZADA">Apuração finalizada</option><option value="RESULTADO_PUBLICADO">Resultado publicado</option></Select></label><label className="text-xs font-semibold">Origem<Select className="mt-2" value={filtroOrigem} onChange={(e) => setFiltroOrigem(e.target.value)}><option value="">Todas</option><option value="ELEITOR">Eleitor</option><option value="ADMIN">Admin</option><option value="SISTEMA">Sistema</option></Select></label><label className="text-xs font-semibold">Status<Select className="mt-2" value={filtroSucesso} onChange={(e) => setFiltroSucesso(e.target.value)}><option value="">Todos</option><option value="S">Sucesso</option><option value="N">Falha</option></Select></label><label className="text-xs font-semibold">Data inicial<Input className="mt-2" type="date" value={filtroDataInicial} onChange={(e) => setFiltroDataInicial(e.target.value)} /></label><label className="text-xs font-semibold">Data final<Input className="mt-2" type="date" value={filtroDataFinal} onChange={(e) => setFiltroDataFinal(e.target.value)} /></label></div><div className="mt-4 flex gap-2"><Button size="sm" onClick={() => void fetchAuditoria(true, true)}>{auditoriaLoading ? "Filtrando..." : "Filtrar"}</Button><Button size="sm" variant="secondary" onClick={() => { setFiltroTipoEvento(""); setFiltroOrigem(""); setFiltroSucesso(""); setFiltroDataInicial(""); setFiltroDataFinal(""); void fetchAuditoria(false, true); }}>Limpar filtros</Button></div>{filtroMensagem ? <div className="mt-3 text-sm text-red-700">{filtroMensagem}</div> : null}</div>
              {auditoriaError ? <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] p-4 text-sm text-red-800">{auditoriaError}</div> : null}
              {!auditoriaLoading && auditoria && auditoria.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">Nenhum evento encontrado.</div> : null}
              {auditoria && auditoria.length > 0 ? <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-[var(--surface-muted)] text-left text-xs uppercase text-[var(--muted)]"><tr><th className="px-4 py-3">Data/Hora</th><th className="px-4 py-3">Evento</th><th className="px-4 py-3">Origem</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Descrição</th></tr></thead><tbody>{auditoriaPaginada.map((item) => <tr key={item.id} className="border-t border-[var(--line)]"><td className="whitespace-nowrap px-4 py-3">{formatDateTime(item.criado_em)}</td><td className="px-4 py-3 font-semibold">{mapEventoLabel(item.tipo_evento)}</td><td className="px-4 py-3">{item.origem}</td><td className="px-4 py-3"><Badge variant={item.sucesso === "S" ? "success" : "danger"}>{item.sucesso === "S" ? "Sucesso" : "Falha"}</Badge></td><td className="min-w-[240px] px-4 py-3">{item.descricao}</td></tr>)}</tbody></table></div><Pagination page={auditoriaPage} pageSize={AUDITORIA_PAGE_SIZE} totalItems={auditoria.length} itemLabel="registro(s)" onPageChange={setAuditoriaPage} /></div> : null}
            </section>
          )}
        </div>

        <ConfirmDialog open={confirmOpen} title="Encerrar votação?" message="Após o encerramento, novos votos não poderão ser registrados. Deseja continuar?" confirmLabel={closing ? "Encerrando..." : "Encerrar votação"} isLoading={closing} error={confirmOpen ? actionMessage : null} confirmVariant="danger" onCancel={() => { setActionMessage(null); setConfirmOpen(false); }} onConfirm={() => void executarAcao(() => encerrarEleicaoAdmin(slug, tokenAdmin || ""), "Eleição encerrada com sucesso.", setClosing, () => setConfirmOpen(false))} />
        <ConfirmDialog open={confirmApuracaoOpen} title="Iniciar apuração?" message="A votação já foi encerrada. Deseja iniciar a etapa de apuração?" confirmLabel={apurando ? "Iniciando..." : "Iniciar apuração"} isLoading={apurando} error={confirmApuracaoOpen ? actionMessage : null} confirmVariant="primary" onCancel={() => { setActionMessage(null); setConfirmApuracaoOpen(false); }} onConfirm={() => void executarAcao(() => iniciarApuracaoAdmin(slug, tokenAdmin || ""), "Apuração iniciada com sucesso.", setApurando, () => setConfirmApuracaoOpen(false))} />
        <ConfirmDialog open={confirmFinalizarOpen} title="Finalizar apuração?" message="Ao finalizar, a eleição será marcada como APURADA. Deseja continuar?" confirmLabel={finalizando ? "Finalizando..." : "Finalizar apuração"} isLoading={finalizando} error={confirmFinalizarOpen ? actionMessage : null} confirmVariant="primary" onCancel={() => { setActionMessage(null); setConfirmFinalizarOpen(false); }} onConfirm={() => void executarAcao(() => finalizarApuracaoAdmin(slug, tokenAdmin || ""), "Apuração finalizada com sucesso.", setFinalizando, () => setConfirmFinalizarOpen(false))} />
        <ConfirmDialog open={confirmPublicarOpen} title="Publicar resultado?" message="Após a publicação, o resultado poderá ser consultado publicamente. Deseja continuar?" confirmLabel={publicando ? "Publicando..." : "Publicar resultado"} isLoading={publicando} error={confirmPublicarOpen ? actionMessage : null} confirmVariant="primary" onCancel={() => { setActionMessage(null); setConfirmPublicarOpen(false); }} onConfirm={() => void executarAcao(() => publicarResultadoAdmin(slug, tokenAdmin || ""), "Resultado publicado com sucesso.", setPublicando, () => setConfirmPublicarOpen(false))} />
      </EleicaoLayout>

      <AdminRelatorioImpressao tipo={relatorioImpressao} nomeEntidade={entidade?.nome_exibicao} eleicao={eleicao} resumo={resumo} evolucao={evolucaoItems} resultado={resultado} auditoria={auditoria || []} auditoriaFiltros={auditoriaFiltrosAplicados} geradoEm={relatorioGeradoEm} />
    </>
  );
}
