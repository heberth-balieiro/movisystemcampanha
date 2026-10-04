"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
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
      <EleicaoMensagem titulo="Validar comprovante" mensagem="Consulte se o comprovante recebido após a votação está registrado nesta eleição.">
        <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-5 text-left">
          <label className="block text-sm font-semibold">
            Comprovante
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Cole o comprovante completo aqui"
              className="mt-2 font-mono"
              disabled={loading}
            />
          </label>

          {error ? <div role="alert" className="rounded-xl border border-red-200 bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-red-800">{error}</div> : null}

          {!result ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="submit" disabled={loading}>{loading ? "Validando comprovante..." : "Validar comprovante"}</Button>
              <Button type="button" variant="secondary" onClick={() => router.push(`/${slug}`)}>Voltar para eleição</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {result.valido === "S" ? (
                <div className="rounded-2xl border border-emerald-200 bg-[var(--success-soft)] p-5 text-sm text-emerald-900">
                  <div className="text-lg font-black">Comprovante válido</div>
                  <div className="mt-1 leading-6">Este comprovante corresponde a um voto registrado.</div>
                  {result.eleicao ? <div className="mt-3">Eleição: <strong>{result.eleicao}</strong></div> : null}
                  {result.registrado_em ? <div>Registrado em: <strong>{formatDateTime(result.registrado_em)}</strong></div> : null}
                  <div className="mt-3 border-t border-emerald-200 pt-3 text-xs leading-5">A validação confirma apenas o registro do voto. Por segurança e sigilo, a opção escolhida não é exibida.</div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-[var(--warning-soft)] p-5 text-sm text-amber-900">
                  <div className="font-black">Comprovante não encontrado</div>
                  <div className="mt-1 leading-6">Não foi localizado um voto registrado com o comprovante informado para esta eleição.</div>
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" onClick={onReset}>Consultar outro comprovante</Button>
                <Button type="button" variant="secondary" onClick={() => router.push(`/${slug}`)}>Voltar para eleição</Button>
              </div>
            </div>
          )}
        </form>
      </EleicaoMensagem>
    </EleicaoLayout>
  );
}
