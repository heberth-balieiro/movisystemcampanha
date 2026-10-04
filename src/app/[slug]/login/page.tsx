"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { loginEleicao } from "@/services/eleicao/eleicao.service";
import { consumirAvisoSessaoExpirada, salvarSessaoIdentificacaoEleicao } from "@/services/eleicao/eleicao-session.service";

function somenteDigitos(value: string) {
  return value.replace(/\D/g, "");
}

function formatarCpf(value: string) {
  const digits = somenteDigitos(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export default function EleicaoLoginPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [erro, setErro] = useState("");
  const [avisoSessao, setAvisoSessao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const jaVotouMessage = "Seu voto já foi registrado nesta eleição.";

  useEffect(() => {
    if (consumirAvisoSessaoExpirada(slug, "eleitor")) {
      setAvisoSessao("Sua sessão expirou por segurança. Identifique-se novamente para continuar.");
    }
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const cpfNormalizado = somenteDigitos(cpf);
    const matriculaNormalizada = matricula.trim();

    if (!cpfNormalizado) {
      setErro("Informe o CPF.");
      return;
    }
    if (cpfNormalizado.length !== 11) {
      setErro("Informe um CPF com 11 dígitos.");
      return;
    }
    if (!matriculaNormalizada) {
      setErro("Informe a matrícula.");
      return;
    }

    setErro("");
    setAvisoSessao("");
    setIsLoading(true);
    let redirecionou = false;

    try {
      const response = await loginEleicao(slug, cpfNormalizado, matriculaNormalizada);
      if (response.erro === false && response.dados !== null && response.dados.identificado === "S" && response.dados.token_identificacao) {
        salvarSessaoIdentificacaoEleicao(slug, response.dados.token_identificacao, response.dados.nome);
        redirecionou = true;
        router.push(`/${slug}/confirmacao`);
        return;
      }
      setErro(response.mensagem || "Não foi possível validar os dados informados.");
    } catch {
      setErro("Não foi possível realizar a identificação no momento. Tente novamente.");
    } finally {
      if (!redirecionou) setIsLoading(false);
    }
  }

  return (
    <EleicaoLayout subtitulo="Utilize seus dados para acessar a votação.">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Acesso do eleitor</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Identificação do associado</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            Para continuar, informe os dados cadastrados junto à entidade.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            CPF
            <Input
              autoComplete="off"
              className="mt-2"
              disabled={isLoading}
              inputMode="numeric"
              maxLength={14}
              onChange={(event) => setCpf(formatarCpf(event.target.value))}
              placeholder="___.___.___-__"
              value={cpf}
            />
          </label>

          <label className="block text-sm font-semibold">
            Matrícula
            <Input
              autoComplete="off"
              className="mt-2"
              disabled={isLoading}
              onChange={(event) => setMatricula(event.target.value)}
              type="password"
              value={matricula}
            />
          </label>

          {avisoSessao ? (
            <p className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-4 py-3 text-sm leading-6 text-[var(--brand-strong)]" role="status">
              {avisoSessao}
            </p>
          ) : null}

          {erro ? (
            <p className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800" role="alert">
              {erro}
            </p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <Button disabled={isLoading || erro === jaVotouMessage} icon={<Icon name="login" />} type="submit">
              {isLoading ? "Validando..." : "Continuar"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push(`/${slug}`)}>
              Voltar para eleição
            </Button>
          </div>
        </form>

        <p className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
          Seus dados de identificação são utilizados somente para validar sua participação na votação.
        </p>
      </div>
    </EleicaoLayout>
  );
}
