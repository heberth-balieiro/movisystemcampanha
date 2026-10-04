"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdminEleicao } from "@/services/eleicao/eleicao.service";
import { consumirAvisoSessaoExpirada, salvarSessaoAdmin } from "@/services/eleicao/eleicao-session.service";

export default function AdminLoginPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [avisoSessao, setAvisoSessao] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (consumirAvisoSessaoExpirada(slug, "admin")) {
      setAvisoSessao("Sua sessão administrativa expirou por segurança. Entre novamente para continuar.");
    }
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAvisoSessao(null);

    if (!email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }
    if (!senha.trim()) {
      setErro("Informe a senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginAdminEleicao(slug, email.trim(), senha);
      if (response.erro || !response.dados) {
        setErro(response.mensagem || "Usuário ou senha inválidos.");
        return;
      }

      salvarSessaoAdmin(slug, response.dados.token, response.dados.nome);
      router.replace(`/${slug}/admin/painel`);
    } catch {
      setErro("Erro ao entrar no painel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <EleicaoLayout subtitulo="Área restrita para administração da eleição.">
      <div className="mx-auto max-w-lg">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Área administrativa</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Acesso administrativo</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Apenas administradores autorizados podem acessar este painel.</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            E-mail
            <Input autoComplete="email" className="mt-2" disabled={loading} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="block text-sm font-semibold">
            Senha
            <Input autoComplete="current-password" className="mt-2" disabled={loading} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </label>

          {avisoSessao ? <div role="status" className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-4 py-3 text-sm text-[var(--brand-strong)]">{avisoSessao}</div> : null}
          {erro ? <div role="alert" className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-800">{erro}</div> : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar no painel"}</Button>
            <Button type="button" variant="secondary" onClick={() => router.replace(`/${slug}`)}>Voltar para eleição</Button>
          </div>
        </form>
      </div>
    </EleicaoLayout>
  );
}
