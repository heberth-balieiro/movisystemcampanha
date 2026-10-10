"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminPainelNav } from "@/components/eleicao/AdminPainelNav";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  buscarEmailConfig,
  salvarEmailConfig,
  testarEmailConfig,
  type EleicaoEmailConfig,
  type EleicaoEmailConfigInput,
} from "@/services/eleicao/eleicao-email-config.service";
import {
  limparSessaoAdmin,
  mensagemIndicaSessaoExpirada,
  obterTokenAdmin,
} from "@/services/eleicao/eleicao-session.service";

const configInicial: EleicaoEmailConfigInput = {
  ativo: false,
  smtp_host: "",
  smtp_porta: 587,
  seguranca: "STARTTLS",
  usuario: "",
  senha: "",
  remetente_nome: "",
  remetente_email: "",
  responder_para: "",
};

export default function AdminEmailConfigPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const tokenAdmin = obterTokenAdmin(slug);

  const [form, setForm] = useState<EleicaoEmailConfigInput>(configInicial);
  const [configAtual, setConfigAtual] = useState<EleicaoEmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [testando, setTestando] = useState(false);
  const [destinatarioTeste, setDestinatarioTeste] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenAdmin) {
      router.replace(`/${slug}/admin/login`);
      return;
    }

    void carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, slug]);

  function tratarSessao(mensagem: string | null | undefined) {
    if (!mensagemIndicaSessaoExpirada(mensagem)) return false;
    limparSessaoAdmin(slug, true);
    router.replace(`/${slug}/admin/login`);
    return true;
  }

  function aplicarConfig(config: EleicaoEmailConfig) {
    setConfigAtual(config);
    setForm({
      ativo: Boolean(config.ativo),
      smtp_host: config.smtp_host || "",
      smtp_porta: config.smtp_porta || 587,
      seguranca: config.seguranca || "STARTTLS",
      usuario: config.usuario || "",
      senha: "",
      remetente_nome: config.remetente_nome || "",
      remetente_email: config.remetente_email || "",
      responder_para: config.responder_para || "",
    });
  }

  async function carregar() {
    if (!tokenAdmin) return;
    setLoading(true);
    setErro(null);
    try {
      const response = await buscarEmailConfig(slug, tokenAdmin);
      if (response.erro || !response.dados) {
        if (tratarSessao(response.mensagem)) return;
        setErro(response.mensagem || "Não foi possível carregar a configuração de e-mail.");
        return;
      }
      aplicarConfig(response.dados);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "";
      if (tratarSessao(mensagem)) return;
      setErro("Não foi possível carregar a configuração de e-mail.");
    } finally {
      setLoading(false);
    }
  }

  async function onSalvar() {
    if (!tokenAdmin) return;
    setSalvando(true);
    setErro(null);
    setSucesso(null);
    try {
      const response = await salvarEmailConfig(slug, tokenAdmin, form);
      if (response.erro || !response.dados) {
        if (tratarSessao(response.mensagem)) return;
        setErro(response.mensagem || "Não foi possível salvar a configuração de e-mail.");
        return;
      }
      aplicarConfig(response.dados);
      setSucesso("Configuração de e-mail salva com sucesso.");
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "";
      if (tratarSessao(mensagem)) return;
      setErro(mensagem || "Não foi possível salvar a configuração de e-mail.");
    } finally {
      setSalvando(false);
    }
  }

  async function onTestar() {
    if (!tokenAdmin) return;
    if (!destinatarioTeste.trim()) {
      setErro("Informe o destinatário para o teste de envio.");
      return;
    }

    setTestando(true);
    setErro(null);
    setSucesso(null);
    try {
      const response = await testarEmailConfig(slug, tokenAdmin, destinatarioTeste.trim());
      if (response.erro) {
        if (tratarSessao(response.mensagem)) return;
        setErro(response.mensagem || "Não foi possível enviar o e-mail de teste.");
        return;
      }
      setSucesso("E-mail de teste enviado com sucesso.");
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "";
      if (tratarSessao(mensagem)) return;
      setErro(mensagem || "Não foi possível enviar o e-mail de teste.");
    } finally {
      setTestando(false);
    }
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
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">Dados da eleição</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Configuração de e-mail</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Configure o servidor SMTP utilizado para envio de códigos de contingência por e-mail.
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push(`/${slug}/admin/painel/dados`)}>Voltar aos dados</Button>
          </div>
        </section>

        <AdminPainelNav slug={slug} ativa="dados" />

        {erro ? <div className="rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{erro}</div> : null}
        {sucesso ? <div className="rounded-2xl border border-emerald-200 bg-[var(--success-soft)] px-4 py-3 text-sm text-emerald-900">{sucesso}</div> : null}

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Servidor SMTP</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">A senha salva nunca é exibida novamente.</p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.ativo} onChange={(e) => setForm((atual) => ({ ...atual, ativo: e.target.checked }))} />
              Configuração ativa
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-bold">Host SMTP<Input className="mt-2" value={form.smtp_host} onChange={(e) => setForm((atual) => ({ ...atual, smtp_host: e.target.value }))} placeholder="smtp.exemplo.com.br" /></label>
            <label className="text-sm font-bold">Porta<Input className="mt-2" type="number" min={1} max={65535} value={form.smtp_porta} onChange={(e) => setForm((atual) => ({ ...atual, smtp_porta: Number(e.target.value) || 0 }))} /></label>
            <label className="text-sm font-bold">Segurança<Select className="mt-2" value={form.seguranca} onChange={(e) => setForm((atual) => ({ ...atual, seguranca: e.target.value }))}><option value="STARTTLS">STARTTLS</option><option value="SSL_TLS">SSL/TLS</option><option value="NONE">Sem TLS</option></Select></label>
            <label className="text-sm font-bold">Usuário<Input className="mt-2" value={form.usuario} onChange={(e) => setForm((atual) => ({ ...atual, usuario: e.target.value }))} autoComplete="off" /></label>
            <label className="text-sm font-bold">Senha<Input className="mt-2" type="password" value={form.senha} onChange={(e) => setForm((atual) => ({ ...atual, senha: e.target.value }))} autoComplete="new-password" placeholder={configAtual?.senha_configurada ? "Deixe em branco para manter a senha atual" : "Informe a senha"} /></label>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm">
              <div className="font-bold">Senha armazenada</div>
              <div className="mt-1 text-[var(--muted)]">{configAtual?.senha_configurada ? configAtual.senha_mascarada || "Configurada" : "Não configurada"}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-bold">Nome do remetente<Input className="mt-2" value={form.remetente_nome} onChange={(e) => setForm((atual) => ({ ...atual, remetente_nome: e.target.value }))} /></label>
            <label className="text-sm font-bold">E-mail do remetente<Input className="mt-2" type="email" value={form.remetente_email} onChange={(e) => setForm((atual) => ({ ...atual, remetente_email: e.target.value }))} /></label>
            <label className="text-sm font-bold">Responder para<Input className="mt-2" type="email" value={form.responder_para} onChange={(e) => setForm((atual) => ({ ...atual, responder_para: e.target.value }))} /></label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => void onSalvar()} disabled={salvando}>{salvando ? "Salvando..." : "Salvar configuração"}</Button>
            <Button variant="secondary" onClick={() => void carregar()} disabled={salvando || testando}>Recarregar</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-xl font-black">Testar configuração</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">O teste utiliza a configuração atualmente salva na API.</p>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-bold">Destinatário do teste<Input className="mt-2" type="email" value={destinatarioTeste} onChange={(e) => setDestinatarioTeste(e.target.value)} placeholder="email@exemplo.com.br" /></label>
            <Button variant="secondary" onClick={() => void onTestar()} disabled={testando}>{testando ? "Enviando teste..." : "Enviar e-mail de teste"}</Button>
          </div>
        </section>
      </div>
    </EleicaoLayout>
  );
}
