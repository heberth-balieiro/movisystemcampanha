"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { validarComprovante } from "@/services/eleicao/eleicao.service";
import type { EleicaoValidarComprovanteDados } from "@/types/eleicao";

function formatDateTime(value?: string) {
  if (!value) return "";
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

export default function ValidarComprovantePage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EleicaoValidarComprovanteDados | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const comprovante = value.trim();
    if (!comprovante) {
      setError("Informe o comprovante para validar.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await validarComprovante(slug, comprovante);

      if (response.erro) {
        setError(response.mensagem || "Erro ao validar o comprovante.");
        return;
      }

      if (!response.dados) {
        setError("Resposta inválida da API.");
        return;
      }

      setResult(response.dados);
    } catch {
      setError("Erro ao validar o comprovante.");
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setResult(null);
    setError(null);
    setValue("");
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <EleicaoLayout>
      <div className="mx-auto max-w-4xl">
        <section className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm">
            <Icon name="ticket" className="size-6" />
          </div>

          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">
            Segurança e transparência
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
            Validar comprovante de votação
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Consulte se o comprovante recebido após a votação está registrado nesta eleição.
          </p>
        </section>

        <section className="mt-7 rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.45)] sm:p-7">
          {!result ? (
            <form onSubmit={onSubmit}>
              <label className="block text-sm font-bold text-[var(--foreground)]">
                Comprovante
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-[var(--brand)]">
                    <Icon name="ticket" />
                  </span>
                  <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Cole ou digite o comprovante completo"
                    className="h-12 pl-11 font-mono"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
              </label>

              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Utilize o código completo exibido no comprovante gerado após a votação.
              </p>

              {error ? (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800"
                >
                  <strong>Não foi possível validar.</strong>
                  <div>{error}</div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button type="submit" size="lg" disabled={loading} icon={<Icon name="check" />}>
                  {loading ? "Validando comprovante..." : "Validar comprovante"}
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push(`/${slug}`)}
                >
                  Voltar para eleição
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              {result.valido === "S" ? (
                <div className="rounded-[22px] border border-emerald-200 bg-[var(--success-soft)] p-5 text-emerald-950 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/80 text-emerald-700 shadow-sm">
                      <Icon name="check" className="size-5" />
                    </span>

                    <div>
                      <h3 className="text-xl font-black">Comprovante válido</h3>
                      <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                        Este comprovante está registrado nesta eleição.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {result.eleicao ? (
                      <div className="rounded-2xl border border-emerald-200 bg-white/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Eleição</p>
                        <p className="mt-1 text-sm font-bold">{result.eleicao}</p>
                      </div>
                    ) : null}

                    {result.registrado_em ? (
                      <div className="rounded-2xl border border-emerald-200 bg-white/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">Registrado em</p>
                        <p className="mt-1 text-sm font-bold">{formatDateTime(result.registrado_em)}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 border-t border-emerald-200 pt-4 text-xs leading-5 text-emerald-900/75">
                    A validação confirma apenas a existência do comprovante. Nenhuma informação sobre a escolha realizada pelo eleitor é exibida.
                  </div>
                </div>
              ) : (
                <div className="rounded-[22px] border border-amber-200 bg-[var(--warning-soft)] p-5 text-amber-950 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/80 text-amber-700 shadow-sm">
                      <Icon name="search" className="size-5" />
                    </span>

                    <div>
                      <h3 className="text-xl font-black">Comprovante não localizado</h3>
                      <p className="mt-1 text-sm leading-6 text-amber-900/80">
                        Não encontramos este comprovante vinculado a esta eleição. Confira o código informado e tente novamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" size="lg" onClick={onReset} icon={<Icon name="search" />}>
                  Consultar outro comprovante
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push(`/${slug}`)}
                >
                  Voltar para eleição
                </Button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "ticket" as const,
              titulo: "Informe o comprovante",
              texto: "Cole ou digite o código completo recebido após a votação.",
            },
            {
              icon: "search" as const,
              titulo: "Consulte o registro",
              texto: "O sistema verifica se o comprovante pertence a esta eleição.",
            },
            {
              icon: "check" as const,
              titulo: "Veja a validade",
              texto: "A consulta confirma o registro sem revelar a escolha do eleitor.",
            },
          ].map((item) => (
            <div
              key={item.titulo}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-[var(--foreground)]">{item.titulo}</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">{item.texto}</p>
            </div>
          ))}
        </section>
      </div>
    </EleicaoLayout>
  );
}
