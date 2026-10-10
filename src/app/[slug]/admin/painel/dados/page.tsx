"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminPainelNav } from "@/components/eleicao/AdminPainelNav";
import { useEleicaoEntidade } from "@/components/eleicao/EleicaoContext";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { imagemBase64 } from "@/lib/image";
import { obterTokenAdmin } from "@/services/eleicao/eleicao-session.service";
import { buscarEleicaoPorSlug } from "@/services/eleicao/eleicao.service";
import type { EleicaoPublicaDados } from "@/types/eleicao";

type CampoProps = {
  label: string;
  valor?: string | number | null;
};

function Campo({ label, valor }: CampoProps) {
  const texto = valor === null || valor === undefined || String(valor).trim() === "" ? "Não informado" : String(valor);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--muted)]">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold text-[var(--foreground)]">{texto}</div>
    </div>
  );
}

function formatarDataHora(valor?: string | null) {
  if (!valor) return "Não informado";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? valor : data.toLocaleString("pt-BR");
}

function tipoEleicao(tipo: string) {
  if (tipo === "A") return "Assembleia";
  if (tipo === "E") return "Eleição";
  return tipo || "Não informado";
}

export default function AdminDadosEleicaoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const entidadeContexto = useEleicaoEntidade();
  const [dados, setDados] = useState<EleicaoPublicaDados | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = obterTokenAdmin(slug);
    if (!token) {
      router.replace(`/${slug}/admin/login`);
      return;
    }

    let ativo = true;
    setLoading(true);
    setErro(null);

    buscarEleicaoPorSlug(slug)
      .then((response) => {
        if (!ativo) return;
        setDados(response);
      })
      .catch(() => {
        if (!ativo) return;
        setErro("Não foi possível carregar os dados da eleição.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [router, slug]);

  if (loading) {
    return <EleicaoLayout maxWidthClass="max-w-7xl"><EleicaoLoading /></EleicaoLayout>;
  }

  if (erro || !dados) {
    return (
      <EleicaoLayout maxWidthClass="max-w-7xl">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-[var(--danger-soft)] p-6 text-center">
          <h1 className="text-lg font-black text-red-900">Não foi possível carregar os dados</h1>
          <p className="mt-2 text-sm text-red-800">{erro || "Os dados da eleição não foram retornados."}</p>
          <Button className="mt-5" variant="secondary" onClick={() => router.replace(`/${slug}/admin/painel`)}>Voltar ao painel</Button>
        </div>
      </EleicaoLayout>
    );
  }

  const entidade = dados.entidade || entidadeContexto;
  const eleicao = dados.eleicao;
  const logo = imagemBase64(entidade?.logo);
  const banner = imagemBase64(entidade?.banner);

  return (
    <EleicaoLayout maxWidthClass="max-w-7xl">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-muted)]">
          <div className="h-1.5 bg-gradient-to-r from-[var(--brand)] via-[var(--brand)] to-[var(--accent)]" />
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm sm:size-24">
                {logo ? <img src={logo} alt={`Logo ${entidade?.nome_exibicao || "da entidade"}`} className="h-full w-full object-contain p-2" /> : <span className="text-xl font-black text-[var(--brand)]">{(entidade?.nome_exibicao || "EV").split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()}</span>}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Dados da eleição</p>
                  <Badge variant="muted">Somente leitura</Badge>
                  <Badge variant={eleicao.situacao === "ABERTA" ? "success" : eleicao.situacao === "PUBLICADA" ? "info" : "muted"}>{eleicao.situacao}</Badge>
                </div>
                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{eleicao.nome}</h1>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{entidade?.nome_exibicao}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.replace(`/${slug}/admin/painel`)}>Voltar ao painel</Button>
          </div>
        </section>

        <AdminPainelNav slug={slug} ativa="dados" />

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Comunicação</p>
              <h2 className="mt-1 text-xl font-black">Configuração de e-mail</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Visualize e configure o SMTP utilizado pela contingência por e-mail.</p>
            </div>
            <Button onClick={() => router.push(`/${slug}/admin/painel/dados/email`)}>Configurar e-mail</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Cadastro</p>
            <h2 className="mt-1 text-xl font-black">Dados gerais</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Informações cadastradas para este processo. Esta tela não permite alterações.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Código" valor={eleicao.codigo} />
            <Campo label="Tipo" valor={tipoEleicao(eleicao.tipo)} />
            <Campo label="Ano" valor={eleicao.ano} />
            <Campo label="Situação" valor={eleicao.situacao} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Campo label="Nome" valor={eleicao.nome} />
            <Campo label="Descrição" valor={eleicao.descricao} />
            <Campo label="Início" valor={formatarDataHora(entidade?.data_hora_inicio)} />
            <Campo label="Término" valor={formatarDataHora(entidade?.data_hora_fim)} />
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Página pública</p>
            <h2 className="mt-1 text-xl font-black">Configurações do ambiente</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Identidade e informações exibidas no endereço público do slug.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="Slug" valor={entidade?.slug} />
            <Campo label="Nome de exibição" valor={entidade?.nome_exibicao} />
            <Campo label="Página publicada" valor={entidade?.pagina_publicar === "S" ? "Sim" : "Não"} />
            <Campo label="E-mail" valor={entidade?.email} />
            <Campo label="Telefone" valor={entidade?.telefone} />
            <Campo label="Mensagem de boas-vindas" valor={entidade?.mensagem_boas_vindas} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Campo label="Cor primária" valor={entidade?.cor_primaria} />
            <Campo label="Cor secundária" valor={entidade?.cor_secundaria} />
            <Campo label="Instagram" valor={entidade?.url_instagram} />
            <Campo label="Facebook" valor={entidade?.url_facebook} />
            <Campo label="YouTube" valor={entidade?.url_youtube} />
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Identidade visual</p>
            <h2 className="mt-1 text-xl font-black">Logo e banner</h2>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Logo</div>
              <div className="mt-3 grid min-h-36 place-items-center rounded-xl border border-[var(--line)] bg-white p-4">
                {logo ? <img src={logo} alt="Logo configurada" className="max-h-28 max-w-full object-contain" /> : <span className="text-sm text-[var(--muted)]">Não configurada</span>}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Banner</div>
              <div className="mt-3 grid min-h-36 place-items-center overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                {banner ? <img src={banner} alt="Banner configurado" className="max-h-56 w-full object-contain" /> : <span className="p-4 text-sm text-[var(--muted)]">Não configurado</span>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </EleicaoLayout>
  );
}
