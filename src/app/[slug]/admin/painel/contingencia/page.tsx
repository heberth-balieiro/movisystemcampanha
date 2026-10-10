"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { limparSessaoAdmin, mensagemIndicaSessaoExpirada, obterTokenAdmin } from "@/services/eleicao/eleicao-session.service";
import {
  buscarEleitoresContingencia,
  gerarCodigoTemporario,
  type CodigoTemporarioGerado,
  type EleitorContingencia,
} from "@/services/eleicao/eleicao-codigo-temporario.service";

export default function AdminContingenciaPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const tokenAdmin = obterTokenAdmin(slug);

  const [termo, setTermo] = useState("");
  const [eleitores, setEleitores] = useState<EleitorContingencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [gerandoId, setGerandoId] = useState<number | null>(null);
  const [eleitorSelecionado, setEleitorSelecionado] = useState<EleitorContingencia | null>(null);
  const [codigoGerado, setCodigoGerado] = useState<CodigoTemporarioGerado | null>(null);

  useEffect(() => {
    if (!tokenAdmin) {
      router.replace(`/${slug}/admin/login`);
      return;
    }

    void carregarEleitores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

  async function carregarEleitores() {
    if (!tokenAdmin) return;
    setBuscando(true);
    setErro(null);
    try {
      const response = await buscarEleitoresContingencia(slug, tokenAdmin, termo);
      if (response.erro) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        setErro(response.mensagem || "Não foi possível localizar os eleitores.");
        setEleitores([]);
        return;
      }
      setEleitores(response.dados || []);
    } finally {
      setBuscando(false);
      setLoading(false);
    }
  }

  async function onGerar(eleitor: EleitorContingencia) {
    if (!tokenAdmin || eleitor.ja_votou) return;

    setGerandoId(eleitor.id_usuario);
    setErro(null);
    setCodigoGerado(null);
    setEleitorSelecionado(eleitor);
    try {
      const response = await gerarCodigoTemporario(slug, tokenAdmin, eleitor.id_usuario);
      if (response.erro || !response.dados) {
        if (mensagemIndicaSessaoExpirada(response.mensagem)) {
          limparSessaoAdmin(slug, true);
          router.replace(`/${slug}/admin/login`);
          return;
        }
        setErro(response.mensagem || "Não foi possível gerar o código temporário.");
        return;
      }
      setCodigoGerado(response.dados);
    } finally {
      setGerandoId(null);
    }
  }

  async function copiarCodigo() {
    if (!codigoGerado?.codigo) return;
    await navigator.clipboard.writeText(codigoGerado.codigo);
  }

  if (loading) {
    return <EleicaoLayout maxWidthClass="max-w-7xl"><EleicaoLoading /></EleicaoLayout>;
  }

  return (
    <EleicaoLayout maxWidthClass="max-w-7xl">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-muted)]">
          <div className="h-1.5 bg-gradient-to-r from-[var(--brand)] via-[var(--brand)] to-[var(--accent)]" />
          <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Contingência administrativa</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Código temporário do eleitor</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Use esta opção somente quando os canais normais de confirmação não puderem ser utilizados. O código é gerado pela API, vinculado ao eleitor e possui validade curta.
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.replace(`/${slug}/admin/painel`)}>Voltar ao painel</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-bold text-[var(--foreground)]">
              Localizar eleitor
              <Input
                className="mt-2"
                placeholder="Nome, CPF ou matrícula"
                value={termo}
                onChange={(event) => setTermo(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void carregarEleitores();
                }}
              />
            </label>
            <Button onClick={() => void carregarEleitores()} disabled={buscando} icon={<Icon name="search" />}>
              {buscando ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {erro ? (
            <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">
              {erro}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {eleitores.length === 0 && !buscando ? (
              <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
                Nenhum eleitor encontrado.
              </div>
            ) : null}

            {eleitores.map((eleitor) => (
              <article key={eleitor.id_usuario} className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black text-[var(--foreground)]">{eleitor.nome}</h2>
                      {eleitor.ja_votou ? <Badge variant="muted">Voto já registrado</Badge> : <Badge variant="success">Apto</Badge>}
                    </div>
                    <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
                      <span><strong className="text-[var(--foreground)]">CPF:</strong> {eleitor.cpf || "-"}</span>
                      <span><strong className="text-[var(--foreground)]">Matrícula:</strong> {eleitor.matricula || "-"}</span>
                      <span><strong className="text-[var(--foreground)]">E-mail:</strong> {eleitor.email || "Não cadastrado"}</span>
                      <span><strong className="text-[var(--foreground)]">WhatsApp:</strong> {eleitor.tem_whatsapp ? "Cadastrado" : "Não cadastrado"}</span>
                    </div>
                  </div>

                  <Button
                    disabled={eleitor.ja_votou || gerandoId === eleitor.id_usuario}
                    onClick={() => void onGerar(eleitor)}
                    icon={<Icon name="plus" />}
                  >
                    {gerandoId === eleitor.id_usuario ? "Gerando..." : "Gerar código temporário"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {codigoGerado && eleitorSelecionado ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 shadow-sm sm:p-6" aria-live="polite">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">Código temporário gerado</p>
            <h2 className="mt-2 text-xl font-black text-amber-950">{eleitorSelecionado.nome}</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Informe este código ao eleitor autorizado. Um novo código invalida o anterior e este código só pode ser utilizado uma vez.
            </p>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Código</div>
                <div className="mt-1 font-mono text-4xl font-black tracking-[0.18em] text-[var(--foreground)]">{codigoGerado.codigo}</div>
                <div className="mt-2 text-sm text-[var(--muted)]">
                  Expira em {Math.ceil(codigoGerado.validade_segundos / 60)} minuto(s) — {new Date(codigoGerado.expira_em).toLocaleString("pt-BR")}
                </div>
              </div>
              <Button variant="secondary" onClick={() => void copiarCodigo()} icon={<Icon name="copy" />}>Copiar código</Button>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
          <strong className="text-[var(--foreground)]">Segurança:</strong> o operador não escolhe o código. A geração é limitada e registrada com empresa, eleição, eleitor, operador, data/hora, status e expiração.
        </section>
      </div>
    </EleicaoLayout>
  );
}
