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
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
            <Icon name="user" className="size-6" />
          </div>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">Acesso do eleitor</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Identificação do eleitor</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Para continuar, informe os dados cadastrados junto à entidade responsável pela votação.
          </p>
        </div>

        <form className="mt-7 rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-7" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              CPF
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-[var(--brand)]">
                  <Icon name="user" />
                </span>
                <Input
                  autoComplete="off"
                  className="h-12 pl-11"
                  disabled={isLoading}
                  inputMode="numeric"
                  maxLength={14}
                  onChange={(event) => setCpf(formatarCpf(event.target.value))}
                  placeholder="000.000.000-00"
                  value={cpf}
                />
              </div>
            </label>

            <label className="block text-sm font-bold text-[var(--foreground)]">
              Matrícula
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-[var(--brand)]">
                  <Icon name="ticket" />
                </span>
                <Input
                  autoComplete="off"
                  className="h-12 pl-11 pr-11"
                  disabled={isLoading}
                  inputMode="numeric"
                  onChange={(event) => setMatricula(somenteDigitos(event.target.value))}
                  placeholder="Informe sua matrícula"
                  type="password"
                  value={matricula}
                />
                {matricula ? (
                  <span className="pointer-events-none absolute inset-y-0 right-0 grid w-11 place-items-center text-[var(--muted)]">
                    <Icon name="eye" />
                  </span>
                ) : null}
              </div>
              <span className="mt-2 block text-xs font-medium text-[var(--muted)]">
                Sua matrícula fica oculta durante a digitação.
              </span>
            </label>
          </div>

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

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button size="lg" disabled={isLoading || erro === jaVotouMessage} icon={<Icon name="login" />} type="submit">
              {isLoading ? "Validando..." : "Continuar"}
            </Button>
            <Button size="lg" type="button" variant="secondary" onClick={() => router.push(`/${slug}`)}>
              Voltar para eleição
            </Button>
          </div>
        </form>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-4 py-4 text-sm leading-6 text-[var(--brand-strong)]">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/80 text-[var(--brand)] shadow-sm">
            <Icon name="check" className="size-3.5" />
          </span>
          <p>
            Seus dados são utilizados somente para confirmar sua identidade e verificar sua aptidão para participar desta votação.
          </p>
        </div>
      </div>
    </EleicaoLayout>
  );
}
