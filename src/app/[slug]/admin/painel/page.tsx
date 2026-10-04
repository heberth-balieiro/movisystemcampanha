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

import { limparSessaoAdmin, mensagemIndicaSessaoExpirada, obterNomeAdmin, obterTokenAdmin } from "@/services/eleicao/eleicao-session.service";
import { buscarPainelAdminEleicao, buscarResultadoAdminEleicao, buscarAuditoriaAdminEleicao } from "@/services/eleicao/eleicao.service";
import { encerrarEleicaoAdmin, iniciarApuracaoAdmin, finalizarApuracaoAdmin, publicarResultadoAdmin } from "@/services/eleicao/eleicao.service";
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
        <text y="6" textAnchor="middle" fontSize="14" fontWeight={700} fill="var(--foreground)">{pct}%</text>
      </g>
    </svg>
  );
}

function Bars({ items }: { items: { hora: string; quantidade: number }[] }) {
  const max = Math.max(...items.map((i) => i.quantidade), 1);
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-end gap-2 pt-3">
        {items.map((it) => (
          <div key={it.hora} className="flex w-10 flex-col items-center justify-end text-center">
            <div className="text-[10px] font-semibold text-[var(--muted)]">{it.quantidade}</div>
            <div style={{ height: `${Math.max((it.quantidade / max) * 112, 6)}px` }} className="mt-1 w-7 rounded-t-md bg-[var(--brand)]" />
            <div className="mt-1 text-[10px] text-[var(--muted)]">{it.hora}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AUTO_REFRESH_INTERVAL_MS = 30000;

export default function AdminPainelPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const entidade = useEleicaoEntidade();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [data, setData] = useState<EleicaoAdminPainelDados | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const tokenAdmin = obterTokenAdmin(slug);
  const nomeAdmin = obterNomeAdmin(slug);

  useEffect(() => {
    if (!tokenAdmin) {
      router.replace(`/${slug}/admin/login`);
      return;
    }

    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

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

        if (!silent) {
          setResultadoError(msg);
          setResultado(null);
        }
        return;
      }

      setResultado(res.dados);
    } catch {
      if (!silent) {
        setResultadoError("Erro ao carregar resultado da apuração.");
        setResultado(null);
      }
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
      if (activeTab === 'auditoria') await fetchAuditoria(true);
    } finally {
      setRefreshing(false);
    }
  }

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [confirmApuracaoOpen, setConfirmApuracaoOpen] = useState(false);
  const [apurando, setApurando] = useState(false);
  const [confirmFinalizarOpen, setConfirmFinalizarOpen] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [resultado, setResultado] = useState<EleicaoAdminResultadoDados | null>(null);
  const [resultadoLoading, setResultadoLoading] = useState(false);
  const [resultadoError, setResultadoError] = useState<string | null>(null);
  const [confirmPublicarOpen, setConfirmPublicarOpen] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [relatorioImpressao, setRelatorioImpressao] = useState<RelatorioImpressaoTipo | null>(null);
  const [relatorioGeradoEm, setRelatorioGeradoEm] = useState<Date | null>(null);

  // Auditoria
  const [activeTab, setActiveTab] = useState<'painel' | 'relatorios' | 'auditoria'>('painel');
  const [auditoriaLoading, setAuditoriaLoading] = useState(false);
  const [auditoriaError, setAuditoriaError] = useState<string | null>(null);
  const [auditoria, setAuditoria] = useState<EleicaoAuditoriaItem[] | null>(null);
  // filtros
  const [filtroTipoEvento, setFiltroTipoEvento] = useState<string>('');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('');
  const [filtroSucesso, setFiltroSucesso] = useState<string>('');
  const [filtroDataInicial, setFiltroDataInicial] = useState<string>('');
  const [filtroDataFinal, setFiltroDataFinal] = useState<string>('');
  const [filtroMensagem, setFiltroMensagem] = useState<string | null>(null);
  const [auditoriaFiltrosAplicados, setAuditoriaFiltrosAplicados] = useState<AuditoriaRelatorioFiltros>({});

  // Paginação apenas no frontend. A API continua retornando a lista filtrada completa.
  const [auditoriaPage, setAuditoriaPage] = useState<number>(1);
  const auditoriaLimit = 20;
  const auditoriaTotalItems = auditoria?.length ?? 0;
  const auditoriaPaginada = useMemo(() => {
    if (!auditoria) return [];
    const inicio = (auditoriaPage - 1) * auditoriaLimit;
    return auditoria.slice(inicio, inicio + auditoriaLimit);
  }, [auditoria, auditoriaPage]);

  useEffect(() => {
    if (!autoRefreshEnabled || !tokenAdmin) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible" || refreshing || closing || apurando || finalizando || publicando) return;
      void fetchData();
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
    // O intervalo deve reagir somente às opções de atualização e ao contexto da eleição.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefreshEnabled, tokenAdmin, slug, refreshing, closing, apurando, finalizando, publicando]);

  useEffect(() => {
    const onAfterPrint = () => setRelatorioImpressao(null);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  function imprimirRelatorio(tipo: RelatorioImpressaoTipo) {
    if (tipo === "evolucao" && evolucaoItems.length === 0) return;
    if ((tipo === "resultado" || tipo === "ata") && !resultado) return;
    if (tipo === "auditoria" && (!auditoria || auditoria.length === 0)) return;

    setRelatorioGeradoEm(new Date());
    setRelatorioImpressao(tipo);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.print());
    });
  }

  async function handleConfirmEncerrar() {
    if (!tokenAdmin) {
      limparSessaoAdmin(slug);
      router.replace(`/${slug}/admin/login`);
      return;
    }

    setClosing(true);
    setActionMessage(null);
    try {
      const res = await encerrarEleicaoAdmin(slug, tokenAdmin);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao encerrar eleição.";
        // token inválido?
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }

        setActionMessage(msg);
        setClosing(false);
        return;
      }

      // sucesso
      setActionMessage("Eleição encerrada com sucesso.");
      setConfirmOpen(false);
      // atualizar painel usando função existente
      await fetchData();
    } catch {
      setActionMessage("Erro ao encerrar eleição.");
    } finally {
      setClosing(false);
    }
  }

  async function handleConfirmIniciarApuracao() {
    if (!tokenAdmin) {
      limparSessaoAdmin(slug);
      router.replace(`/${slug}/admin/login`);
      return;
    }

    setApurando(true);
    setActionMessage(null);
    try {
      const res = await iniciarApuracaoAdmin(slug, tokenAdmin);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao iniciar apuração.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }

        setActionMessage(msg);
        setApurando(false);
        return;
      }

      setActionMessage("Apuração iniciada com sucesso.");
      setConfirmApuracaoOpen(false);
      await fetchData();
    } catch {
      setActionMessage("Erro ao iniciar apuração.");
    } finally {
      setApurando(false);
    }
  }

  async function handleConfirmFinalizarApuracao() {
    if (!tokenAdmin) {
      limparSessaoAdmin(slug);
      router.replace(`/${slug}/admin/login`);
      return;
    }

    setFinalizando(true);
    setActionMessage(null);
    try {
      const res = await finalizarApuracaoAdmin(slug, tokenAdmin);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao finalizar apuração.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }

        setActionMessage(msg);
        setFinalizando(false);
        return;
      }

      setActionMessage("Apuração finalizada com sucesso.");
      setConfirmFinalizarOpen(false);
      await fetchData();
    } catch {
      setActionMessage("Erro ao finalizar apuração.");
    } finally {
      setFinalizando(false);
    }
  }

  async function handleConfirmPublicarResultado() {
    if (!tokenAdmin) {
      limparSessaoAdmin(slug);
      router.replace(`/${slug}/admin/login`);
      return;
    }

    setPublicando(true);
    setActionMessage(null);
    try {
      const res = await publicarResultadoAdmin(slug, tokenAdmin);
      if (res.erro) {
        const msg = res.mensagem || "Erro ao publicar resultado.";
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        setActionMessage(msg);
        return;
      }

      setActionMessage("Resultado publicado com sucesso.");
      setConfirmPublicarOpen(false);
      await fetchData();
    } catch {
      setActionMessage("Erro ao publicar resultado.");
    } finally {
      setPublicando(false);
    }
  }

  function onLogout() {
    limparSessaoAdmin(slug);
    router.replace(`/${slug}/admin/login`);
  }

  const evolucaoItems = useMemo(() => data?.evolucao || [], [data]);

  function mapEventoLabel(tipo: string) {
    const map: Record<string, string> = {
      LOGIN_SUCESSO: 'Login realizado',
      LOGIN_FALHA: 'Falha no login',
      CODIGO_ENVIADO: 'Código enviado',
      CODIGO_VALIDADO: 'Código validado',
      CODIGO_INVALIDO: 'Código inválido',
      VOTO_REGISTRADO: 'Voto registrado',
      ELEICAO_ENCERRADA: 'Eleição encerrada',
      APURACAO_INICIADA: 'Apuração iniciada',
      APURACAO_FINALIZADA: 'Apuração finalizada',
      RESULTADO_PUBLICADO: 'Resultado publicado',
    };

    return map[tipo] || tipo;
  }

  function formatDateTime(s: string | null) {
    if (!s) return '-';
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function fetchAuditoria(useFiltros = true, resetPage = false) {
    if (!tokenAdmin) return;
    if (resetPage) setAuditoriaPage(1);
    setAuditoriaLoading(true);
    setAuditoriaError(null);
    setFiltroMensagem(null);

    // validação de datas
    if (filtroDataInicial && filtroDataFinal) {
      const di = new Date(filtroDataInicial);
      const df = new Date(filtroDataFinal);
      if (df < di) {
        setFiltroMensagem('A data final não pode ser menor que a data inicial.');
        setAuditoriaLoading(false);
        return;
      }
    }

    try {
      const filtros = useFiltros
        ? {
            tipo_evento: filtroTipoEvento || undefined,
            origem: filtroOrigem || undefined,
            sucesso: filtroSucesso || undefined,
            data_inicial: filtroDataInicial || undefined,
            data_final: filtroDataFinal || undefined,
          }
        : undefined;

      const filtrosAplicados: AuditoriaRelatorioFiltros = useFiltros
        ? {
            tipoEvento: filtroTipoEvento || undefined,
            origem: filtroOrigem || undefined,
            sucesso: filtroSucesso || undefined,
            dataInicial: filtroDataInicial || undefined,
            dataFinal: filtroDataFinal || undefined,
          }
        : {};

      const res = await buscarAuditoriaAdminEleicao(slug, tokenAdmin, filtros);
      if (res.erro) {
        const msg = res.mensagem || 'Erro ao carregar auditoria.';
        if (mensagemIndicaSessaoExpirada(msg)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }

        setAuditoriaError(msg);
        setAuditoria(null);
        setAuditoriaLoading(false);
        return;
      }

      const itens = res.dados || [];
      setAuditoria(itens);
      setAuditoriaFiltrosAplicados(filtrosAplicados);

      if (!resetPage) {
        const totalPaginas = Math.max(1, Math.ceil(itens.length / auditoriaLimit));
        setAuditoriaPage((paginaAtual) => Math.min(paginaAtual, totalPaginas));
      }
    } catch {
      setAuditoriaError('Erro ao carregar auditoria.');
      setAuditoria(null);
    } finally {
      setAuditoriaLoading(false);
    }
  }

  if (loading) {
    return (
      <EleicaoLayout maxWidthClass="max-w-7xl">
        <EleicaoLoading />
      </EleicaoLayout>
    );
  }

  if (error || !data) {
    return (
      <EleicaoLayout maxWidthClass="max-w-7xl">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-[var(--danger-soft)] p-5 text-center sm:p-6">
          <h1 className="text-lg font-black text-red-900">Não foi possível carregar o painel</h1>
          <p className="mt-2 text-sm leading-6 text-red-800">{error || "Os dados do painel não foram retornados pelo serviço de votação."}</p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={() => void fetchData(true)}>Tentar novamente</Button>
            <Button variant="secondary" onClick={() => router.replace(`/${slug}/admin/login`)}>Ir para login</Button>
          </div>
        </div>
      </EleicaoLayout>
    );
  }

  const eleicao = data.eleicao;
  const resumo = data.resumo;
  const podeExibirResultado = eleicao.situacao === "APURADA" || eleicao.situacao === "PUBLICADA";
  const possuiFiltroAuditoria = Boolean(filtroTipoEvento || filtroOrigem || filtroSucesso || filtroDataInicial || filtroDataFinal);

  return (
    <>
      <EleicaoLayout maxWidthClass="max-w-7xl">
      <div className="space-y-6">
        {actionMessage && !confirmOpen && !confirmApuracaoOpen && !confirmFinalizarOpen && !confirmPublicarOpen ? (
          <div className="rounded-xl border border-emerald-200 bg-[var(--success-soft)] px-4 py-3 text-sm font-medium text-emerald-900" role="status">
            {actionMessage}
          </div>
        ) : null}

        <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Painel administrativo</p>
                <Badge variant={eleicao.situacao === "ABERTA" ? "success" : eleicao.situacao === "PUBLICADA" ? "info" : "muted"}>{eleicao.situacao}</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{eleicao.nome}</h1>
              <div className="mt-3 grid gap-1 text-sm text-[var(--muted)] sm:grid-cols-2 sm:gap-x-6">
                <div><span className="font-semibold text-[var(--foreground)]">Início:</span> {eleicao.data_hora_inicio ? new Date(eleicao.data_hora_inicio).toLocaleString("pt-BR") : "-"}</div>
                <div><span className="font-semibold text-[var(--foreground)]">Fim:</span> {eleicao.data_hora_fim ? new Date(eleicao.data_hora_fim).toLocaleString("pt-BR") : "-"}</div>
              </div>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[360px] lg:text-right">
              <div className="text-sm font-semibold">Olá, {nomeAdmin || "Administrador"}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">
                Última atualização: {lastUpdatedAt ? lastUpdatedAt.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-"}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:flex lg:justify-end">
                <Button variant="secondary" size="sm" aria-pressed={autoRefreshEnabled} onClick={() => setAutoRefreshEnabled((ativo) => !ativo)}>
                  {autoRefreshEnabled ? "Auto: 30s" : "Auto: desligado"}
                </Button>
                <Button size="sm" onClick={onRefresh} disabled={refreshing}>{refreshing ? "Atualizando..." : "Atualizar dados"}</Button>
                <Button size="sm" variant="ghost" onClick={onLogout}>Sair</Button>
              </div>
            </div>
          </div>
        </section>

        {refreshError ? <div className="rounded-xl border border-amber-200 bg-[var(--warning-soft)] px-4 py-3 text-sm text-amber-900">{refreshError}</div> : null}

        <nav aria-label="Seções do painel" className="inline-flex w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-1 sm:w-auto">
          <Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "painel" ? "primary" : "ghost"} onClick={() => setActiveTab("painel")}>Painel</Button>
          <Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "relatorios" ? "primary" : "ghost"} onClick={() => setActiveTab("relatorios")}>Relatórios</Button>
          <Button className="flex-1 sm:flex-none" size="sm" variant={activeTab === "auditoria" ? "primary" : "ghost"} onClick={async () => { setActiveTab("auditoria"); if (!auditoria && !auditoriaLoading) await fetchAuditoria(true, true); }}>Auditoria</Button>
        </nav>

        {activeTab === "painel" ? (
          <div className="space-y-6">
            <section aria-label="Resumo da participação" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { valor: resumo.total_eleitores, label: "Eleitores aptos" },
                { valor: resumo.total_votantes, label: "Votos registrados" },
                { valor: resumo.total_nao_votantes, label: "Ainda não votaram" },
                { valor: `${String(resumo.percentual_participacao)}%`, label: "Participação" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-white p-4 text-center shadow-sm sm:p-5">
                  <div className="text-2xl font-black tracking-tight sm:text-3xl">{item.valor}</div>
                  <div className="mt-1 text-xs font-medium text-[var(--muted)] sm:text-sm">{item.label}</div>
                </div>
              ))}
            </section>

            {eleicao.situacao === "ABERTA" ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-black">Encerramento da votação</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Ao encerrar, novos votos não poderão ser registrados.</p></div>
                <Button className="w-full sm:w-auto" variant="danger" onClick={() => { setActionMessage(null); setConfirmOpen(true); }}>Encerrar votação</Button>
              </section>
            ) : null}

            {eleicao.situacao === "ENCERRADA" ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-black">Apuração disponível</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">A votação foi encerrada. Inicie a etapa de apuração quando estiver pronto.</p></div>
                <Button className="w-full sm:w-auto" onClick={() => { setActionMessage(null); setConfirmApuracaoOpen(true); }}>Iniciar apuração</Button>
              </section>
            ) : null}

            {eleicao.situacao === "EM_APURACAO" ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-black">Apuração em andamento</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Finalize esta etapa para marcar a eleição como APURADA.</p></div>
                <Button className="w-full sm:w-auto" onClick={() => { setActionMessage(null); setConfirmFinalizarOpen(true); }}>Finalizar apuração</Button>
              </section>
            ) : null}

            {eleicao.situacao === "APURADA" ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-black">Resultado pronto para publicação</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Após publicar, o resultado poderá ser consultado na área pública.</p></div>
                <Button className="w-full sm:w-auto" onClick={() => { setActionMessage(null); setConfirmPublicarOpen(true); }}>Publicar resultado</Button>
              </section>
            ) : null}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
                <h2 className="text-base font-black">Participação</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Visão geral da adesão dos eleitores.</p>
                <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <DonutChart yes={resumo.total_votantes} no={resumo.total_nao_votantes} />
                  <div className="grid w-full max-w-xs gap-2 text-sm">
                    <div className="flex justify-between gap-4 rounded-lg bg-[var(--surface-muted)] px-3 py-2"><span className="text-[var(--muted)]">Votaram</span><strong>{resumo.total_votantes}</strong></div>
                    <div className="flex justify-between gap-4 rounded-lg bg-[var(--surface-muted)] px-3 py-2"><span className="text-[var(--muted)]">Não votaram</span><strong>{resumo.total_nao_votantes}</strong></div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
                <h2 className="text-base font-black">Evolução</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Votos registrados por faixa de horário.</p>
                <div className="mt-4">
                  {evolucaoItems.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Ainda não há votos registrados para exibir evolução.</div> : <Bars items={evolucaoItems.map((it) => ({ hora: it.hora, quantidade: it.quantidade }))} />}
                </div>
              </div>
            </section>

            {podeExibirResultado ? (
              <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
                <div><h2 className="text-lg font-black tracking-tight">Resultado da apuração</h2><p className="mt-1 text-sm text-[var(--muted)]">Resultado disponível somente após a etapa de apuração.</p></div>

                {resultadoLoading ? <div className="text-sm text-[var(--muted)]">Carregando resultado da apuração...</div> : null}
                {resultadoError ? <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{resultadoError}</div> : null}

                {resultado ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {[
                        { valor: resultado.resumo.total_votos, label: "Total de votos" },
                        { valor: resultado.resumo.votos_validos, label: "Votos válidos" },
                        { valor: resultado.resumo.votos_brancos, label: "Votos em branco" },
                        { valor: resultado.resumo.votos_nulos, label: "Votos nulos" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center">
                          <div className="text-2xl font-black">{item.valor}</div><div className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-black">Resultado por chapa</h3>
                      {!resultado.chapas.length || resultado.chapas.every((c) => c.quantidade_votos === 0) ? (
                        <div className="mt-3 text-sm text-[var(--muted)]">Não há votos válidos por chapa para exibir.</div>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {resultado.chapas.map((chapa) => {
                            const max = Math.max(...resultado.chapas.map((c) => c.quantidade_votos), 1);
                            const widthPct = Math.round((chapa.quantidade_votos / max) * 100);
                            const maisVotada = chapa.quantidade_votos > 0 && chapa.quantidade_votos === max;
                            return (
                              <div key={chapa.id} className={`rounded-xl border p-4 ${maisVotada ? "border-[var(--brand)]/30 bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div><div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Chapa {String(chapa.numero).padStart(2, "0")}</div><div className="mt-1 font-black">{chapa.nome}</div></div>
                                  <div className="text-sm sm:text-right"><strong>{chapa.quantidade_votos} votos</strong><div className="text-[var(--muted)]">{String(chapa.percentual)}%</div></div>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div style={{ width: `${widthPct}%` }} className="h-full rounded-full bg-[var(--brand)]" /></div>
                                {maisVotada ? <div className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-strong)]">Mais votada</div> : null}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </section>
            ) : null}
          </div>
        ) : activeTab === "relatorios" ? (
          <section className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Visão administrativa</p>
              <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Relatórios da eleição</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">Consolidação dos dados já disponíveis nesta eleição. Os resultados por chapa permanecem protegidos até a conclusão da apuração.</p>
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-black">Resumo de participação</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">Consolidado quantitativo dos eleitores aptos e da participação registrada.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={eleicao.situacao === "ABERTA" ? "success" : eleicao.situacao === "PUBLICADA" ? "info" : "muted"}>{eleicao.situacao}</Badge>
                  <Button size="sm" variant="secondary" onClick={() => imprimirRelatorio("participacao")}>Imprimir</Button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { valor: resumo.total_eleitores, label: "Eleitores aptos" },
                  { valor: resumo.total_votantes, label: "Participaram" },
                  { valor: resumo.total_nao_votantes, label: "Não participaram" },
                  { valor: `${String(resumo.percentual_participacao)}%`, label: "Participação" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center">
                    <div className="text-2xl font-black tracking-tight">{item.valor}</div>
                    <div className="mt-1 text-xs font-semibold text-[var(--muted)] sm:text-sm">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-3">
                <div><div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">Eleição</div><div className="mt-1 font-semibold">{eleicao.nome}</div></div>
                <div><div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">Início</div><div className="mt-1 font-semibold">{eleicao.data_hora_inicio ? new Date(eleicao.data_hora_inicio).toLocaleString("pt-BR") : "-"}</div></div>
                <div><div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">Fim</div><div className="mt-1 font-semibold">{eleicao.data_hora_fim ? new Date(eleicao.data_hora_fim).toLocaleString("pt-BR") : "-"}</div></div>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-black">Evolução da participação</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">Distribuição dos registros de voto pelas faixas de horário retornadas pelo painel.</p>
                </div>
                <Button size="sm" variant="secondary" disabled={evolucaoItems.length === 0} onClick={() => imprimirRelatorio("evolucao")}>Imprimir</Button>
              </div>

              {evolucaoItems.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Ainda não há dados de evolução para esta eleição.</div>
              ) : (
                <>
                  <div className="mt-5 hidden overflow-hidden rounded-xl border border-[var(--line)] sm:block">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[var(--surface-muted)] text-left text-xs uppercase tracking-[0.08em] text-[var(--muted)]"><tr><th className="px-4 py-3">Horário</th><th className="px-4 py-3">Quantidade</th><th className="px-4 py-3">Acumulado</th></tr></thead>
                      <tbody>{evolucaoItems.map((item) => <tr key={item.hora} className="border-t border-[var(--line)]"><td className="px-4 py-3 font-semibold">{item.hora}</td><td className="px-4 py-3">{item.quantidade}</td><td className="px-4 py-3">{item.acumulado}</td></tr>)}</tbody>
                    </table>
                  </div>
                  <div className="mt-5 space-y-3 sm:hidden">
                    {evolucaoItems.map((item) => <div key={item.hora} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4"><div><div className="text-xs text-[var(--muted)]">Horário</div><div className="font-black">{item.hora}</div></div><div className="text-right"><div className="text-xs text-[var(--muted)]">Votos / acumulado</div><div className="font-semibold">{item.quantidade} / {item.acumulado}</div></div></div>)}
                  </div>
                </>
              )}
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-black">Resultado da apuração</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">Resumo final disponível somente depois da conclusão da apuração.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {podeExibirResultado ? <Badge variant="info">Disponível</Badge> : <Badge variant="muted">Protegido</Badge>}
                  <Button size="sm" variant="secondary" disabled={!podeExibirResultado || resultadoLoading || !resultado} onClick={() => imprimirRelatorio("resultado")}>Imprimir</Button>
                </div>
              </div>

              {!podeExibirResultado ? (
                <div className="mt-5 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm leading-6 text-[var(--muted)]">O resultado por chapa não é exibido enquanto a eleição não estiver APURADA ou PUBLICADA.</div>
              ) : resultadoLoading ? (
                <div className="mt-5 text-sm text-[var(--muted)]">Carregando resultado...</div>
              ) : resultadoError ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{resultadoError}</div>
              ) : resultado ? (
                <div className="mt-5 space-y-5">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      { valor: resultado.resumo.total_votos, label: "Total de votos" },
                      { valor: resultado.resumo.votos_validos, label: "Votos válidos" },
                      { valor: resultado.resumo.votos_brancos, label: "Brancos" },
                      { valor: resultado.resumo.votos_nulos, label: "Nulos" },
                    ].map((item) => <div key={item.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center"><div className="text-2xl font-black">{item.valor}</div><div className="mt-1 text-xs font-semibold text-[var(--muted)] sm:text-sm">{item.label}</div></div>)}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                    <div className="bg-[var(--surface-muted)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">Resultado por chapa</div>
                    <div className="divide-y divide-[var(--line)]">
                      {resultado.chapas.map((chapa, index) => {
                        const maiorVotacao = Math.max(...resultado.chapas.map((item) => item.quantidade_votos), 0);
                        const maisVotada = maiorVotacao > 0 && chapa.quantidade_votos === maiorVotacao;
                        return (
                          <div key={chapa.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                            <div><div className="flex flex-wrap items-center gap-2"><span className="font-black">Chapa {String(chapa.numero).padStart(2, "0")} - {chapa.nome}</span>{maisVotada ? <Badge variant="info">Mais votada</Badge> : null}</div><div className="mt-1 text-xs text-[var(--muted)]">Posição visual: {index + 1}</div></div>
                            <div className="text-sm"><span className="text-[var(--muted)]">Votos:</span> <strong>{chapa.quantidade_votos}</strong></div>
                            <div className="text-sm"><span className="text-[var(--muted)]">Percentual:</span> <strong>{String(chapa.percentual)}%</strong></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs leading-5 text-[var(--muted)]">Em caso de igualdade na maior votação, o sistema apenas identifica o empate visualmente. O critério de desempate não é aplicado automaticamente.</p>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-black">Ata da eleição</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Gere uma ata de apuração com participação, resultado por chapa e espaço para assinaturas dos responsáveis.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {podeExibirResultado ? <Badge variant="info">Disponível</Badge> : <Badge variant="muted">Após apuração</Badge>}
                  <Button size="sm" variant="secondary" disabled={!podeExibirResultado || resultadoLoading || !resultado} onClick={() => imprimirRelatorio("ata")}>Gerar ata</Button>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-xs leading-5 text-[var(--muted)]">
                A ata é montada com os dados consolidados do sistema. Em caso de empate, o documento registra o empate e não aplica critério de desempate automaticamente.
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-6">
              <h3 className="text-base font-black">Auditoria operacional</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">A relação detalhada dos eventos continua disponível na aba Auditoria, com filtros por evento, origem, status e período.</p>
              <Button className="mt-4 w-full sm:w-auto" variant="secondary" onClick={async () => { setActiveTab("auditoria"); if (!auditoria && !auditoriaLoading) await fetchAuditoria(true, true); }}>Abrir auditoria</Button>
            </section>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="text-xl font-black tracking-tight">Auditoria</h2><p className="mt-1 text-sm text-[var(--muted)]">Consulte os eventos operacionais registrados para esta eleição.</p></div>
              <Button className="w-full sm:w-auto" size="sm" variant="secondary" disabled={auditoriaLoading || !auditoria || auditoria.length === 0} onClick={() => imprimirRelatorio("auditoria")}>Imprimir auditoria</Button>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5">
              <h3 className="text-sm font-black">Filtros</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">Refine os eventos exibidos na auditoria.</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="text-xs font-semibold text-[var(--muted)]">Evento
                  <Select className="mt-2" value={filtroTipoEvento} onChange={(e) => setFiltroTipoEvento(e.target.value)}>
                    <option value="">Todos</option><option value="LOGIN_SUCESSO">Login realizado</option><option value="LOGIN_FALHA">Falha no login</option><option value="CODIGO_ENVIADO">Código enviado</option><option value="CODIGO_VALIDADO">Código validado</option><option value="CODIGO_INVALIDO">Código inválido</option><option value="VOTO_REGISTRADO">Voto registrado</option><option value="ELEICAO_ENCERRADA">Eleição encerrada</option><option value="APURACAO_INICIADA">Apuração iniciada</option><option value="APURACAO_FINALIZADA">Apuração finalizada</option><option value="RESULTADO_PUBLICADO">Resultado publicado</option>
                  </Select>
                </label>
                <label className="text-xs font-semibold text-[var(--muted)]">Origem
                  <Select className="mt-2" value={filtroOrigem} onChange={(e) => setFiltroOrigem(e.target.value)}><option value="">Todas</option><option value="ELEITOR">Eleitor</option><option value="ADMIN">Admin</option><option value="SISTEMA">Sistema</option></Select>
                </label>
                <label className="text-xs font-semibold text-[var(--muted)]">Status
                  <Select className="mt-2" value={filtroSucesso} onChange={(e) => setFiltroSucesso(e.target.value)}><option value="">Todos</option><option value="S">Sucesso</option><option value="N">Falha</option></Select>
                </label>
                <label className="text-xs font-semibold text-[var(--muted)]">Data inicial
                  <Input className="mt-2" type="date" value={filtroDataInicial} onChange={(e) => setFiltroDataInicial(e.target.value)} />
                </label>
                <label className="text-xs font-semibold text-[var(--muted)]">Data final
                  <Input className="mt-2" type="date" value={filtroDataFinal} onChange={(e) => setFiltroDataFinal(e.target.value)} />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button onClick={async () => { setFiltroMensagem(null); await fetchAuditoria(true, true); }} disabled={auditoriaLoading}>{auditoriaLoading ? "Filtrando..." : "Filtrar"}</Button>
                <Button variant="secondary" onClick={async () => { setFiltroTipoEvento(""); setFiltroOrigem(""); setFiltroSucesso(""); setFiltroDataInicial(""); setFiltroDataFinal(""); setFiltroMensagem(null); await fetchAuditoria(false, true); }} disabled={auditoriaLoading}>Limpar filtros</Button>
              </div>

              {filtroMensagem ? <div className="mt-3 rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{filtroMensagem}</div> : null}
            </div>

            {auditoriaLoading ? <div className="rounded-xl border border-[var(--line)] bg-white p-5 text-sm text-[var(--muted)]">Carregando auditoria...</div> : null}
            {auditoriaError ? <div className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{auditoriaError}</div> : null}
            {!auditoriaLoading && !auditoriaError && auditoria && auditoria.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">{possuiFiltroAuditoria ? "Nenhum evento encontrado para os filtros informados." : "Nenhum evento de auditoria registrado para esta eleição."}</div>
            ) : null}

            {!auditoriaLoading && !auditoriaError && auditoria && auditoria.length > 0 ? (
              <div>
                <div className="hidden overflow-hidden rounded-2xl border border-[var(--line)] bg-white md:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                      <thead className="bg-[var(--surface-muted)] text-left text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                        <tr><th className="px-4 py-3">Data/Hora</th><th className="px-4 py-3">Evento</th><th className="px-4 py-3">Origem</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Descrição</th><th className="px-4 py-3">Usuário</th></tr>
                      </thead>
                      <tbody>
                        {auditoriaPaginada.map((it) => (
                          <tr key={it.id} className="border-t border-[var(--line)] align-top transition hover:bg-[var(--surface-muted)]/70">
                            <td className="whitespace-nowrap px-4 py-3">{formatDateTime(it.criado_em)}</td>
                            <td className="px-4 py-3"><div className="font-semibold">{mapEventoLabel(it.tipo_evento)}</div><div className="mt-0.5 font-mono text-[10px] text-[var(--muted)]">{it.tipo_evento}</div></td>
                            <td className="px-4 py-3"><Badge variant="muted">{it.origem}</Badge></td>
                            <td className="px-4 py-3"><Badge variant={it.sucesso === "S" ? "success" : "danger"}>{it.sucesso === "S" ? "Sucesso" : "Falha"}</Badge></td>
                            <td className="min-w-[240px] px-4 py-3 leading-5">{it.descricao}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{it.usuario_id === null ? "Não identificado" : `Usuário ${it.usuario_id}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3 md:hidden">
                  {auditoriaPaginada.map((it) => (
                    <article key={it.id} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold text-[var(--muted)]">{formatDateTime(it.criado_em)}</span><Badge variant={it.sucesso === "S" ? "success" : "danger"}>{it.sucesso === "S" ? "Sucesso" : "Falha"}</Badge></div>
                      <div className="mt-3 font-black">{mapEventoLabel(it.tipo_evento)}</div>
                      <div className="mt-1 font-mono text-[10px] text-[var(--muted)]">{it.tipo_evento}</div>
                      <div className="mt-3 text-sm leading-6">{it.descricao}</div>
                      <div className="mt-3 flex flex-wrap gap-2"><Badge variant="muted">{it.origem}</Badge><span className="text-xs text-[var(--muted)]">{it.usuario_id === null ? "Usuário não identificado" : `Usuário ${it.usuario_id}`}</span></div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)]">
                  <Pagination page={auditoriaPage} pageSize={auditoriaLimit} totalItems={auditoriaTotalItems} itemLabel="registro(s)" onPageChange={setAuditoriaPage} />
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Encerrar votação?"
        message="Após o encerramento, novos votos não poderão ser registrados. Deseja continuar?"
        confirmLabel={closing ? "Encerrando..." : "Encerrar votação"}
        isLoading={closing}
        error={confirmOpen ? actionMessage : null}
        confirmVariant="danger"
        onCancel={() => { setActionMessage(null); setConfirmOpen(false); }}
        onConfirm={handleConfirmEncerrar}
      />
      <ConfirmDialog
        open={confirmApuracaoOpen}
        title="Iniciar apuração?"
        message="A votação já foi encerrada e não será possível registrar novos votos. Deseja iniciar a etapa de apuração?"
        confirmLabel={apurando ? "Iniciando..." : "Iniciar apuração"}
        isLoading={apurando}
        error={confirmApuracaoOpen ? actionMessage : null}
        confirmVariant="primary"
        onCancel={() => { setActionMessage(null); setConfirmApuracaoOpen(false); }}
        onConfirm={handleConfirmIniciarApuracao}
      />
      <ConfirmDialog
        open={confirmFinalizarOpen}
        title="Finalizar apuração?"
        message="Ao finalizar esta etapa, a eleição será marcada como APURADA. Deseja continuar?"
        confirmLabel={finalizando ? "Finalizando..." : "Finalizar apuração"}
        isLoading={finalizando}
        error={confirmFinalizarOpen ? actionMessage : null}
        confirmVariant="primary"
        onCancel={() => { setActionMessage(null); setConfirmFinalizarOpen(false); }}
        onConfirm={handleConfirmFinalizarApuracao}
      />
      <ConfirmDialog
        open={confirmPublicarOpen}
        title="Publicar resultado?"
        message="Após a publicação, o resultado poderá ser disponibilizado publicamente para consulta. Deseja continuar?"
        confirmLabel={publicando ? "Publicando..." : "Publicar resultado"}
        isLoading={publicando}
        error={confirmPublicarOpen ? actionMessage : null}
        confirmVariant="primary"
        onCancel={() => { setActionMessage(null); setConfirmPublicarOpen(false); }}
        onConfirm={handleConfirmPublicarResultado}
      />
      </EleicaoLayout>
      <AdminRelatorioImpressao
        tipo={relatorioImpressao}
        nomeEntidade={entidade?.nome_exibicao}
        eleicao={eleicao}
        resumo={resumo}
        evolucao={evolucaoItems}
        resultado={resultado}
        auditoria={auditoria || []}
        auditoriaFiltros={auditoriaFiltrosAplicados}
        geradoEm={relatorioGeradoEm}
      />
    </>
  );
}
