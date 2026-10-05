"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Brand } from "@/components/plataforma/Brand";
import { apiFetch } from "@/services/api";

type IdentificacaoDados = {
  identificado: string;
  nome: string;
  token_atualizacao: string;
};

type SolicitacaoDados = {
  solicitacao: number;
  situacao: string;
};

type Etapa = "identificacao" | "dados" | "concluido";

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

export default function AtualizarCadastroPage() {
  const [etapa, setEtapa] = useState<Etapa>("identificacao");
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [solicitacao, setSolicitacao] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function identificar(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const resposta = await apiFetch<IdentificacaoDados>("/api/v1/public/atualizacao-cadastral/identificar", {
        method: "POST",
        body: {
          cpf: somenteNumeros(cpf),
          matricula: somenteNumeros(matricula),
        },
        cache: "no-store",
        redirectOnUnauthorized: false,
      });

      setNome(resposta.dados.nome || "Associado");
      setToken(resposta.dados.token_atualizacao);
      setEtapa("dados");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível identificar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  async function solicitar(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const resposta = await apiFetch<SolicitacaoDados>("/api/v1/public/atualizacao-cadastral/solicitar", {
        method: "POST",
        token,
        body: {
          email: email.trim(),
          telefone: somenteNumeros(telefone),
          whatsapp: somenteNumeros(whatsapp),
        },
        cache: "no-store",
        redirectOnUnauthorized: false,
      });

      setSolicitacao(resposta.dados.solicitacao);
      setEtapa("concluido");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível registrar a atualização.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
            Voltar
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:py-16">
        <div className="self-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
            Atualização cadastral
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Mantenha seus dados atualizados para participar das eleições.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Confirme seu CPF e matrícula e envie seus dados de contato atualizados. A solicitação será encaminhada para a entidade responsável pelo seu cadastro.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["1", "Identificação", "CPF + matrícula"],
              ["2", "Contatos", "E-mail, telefone e WhatsApp"],
              ["3", "Processamento", "A entidade recebe a solicitação"],
            ].map(([numero, titulo, descricao]) => (
              <div key={numero} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{numero}</div>
                <div className="mt-3 font-bold">{titulo}</div>
                <div className="mt-1 text-sm text-slate-500">{descricao}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
          {etapa === "identificacao" ? (
            <form onSubmit={identificar} className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Etapa 1 de 2</p>
                <h2 className="mt-1 text-2xl font-black">Identifique seu cadastro</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Informe os mesmos dados utilizados no cadastro da sua entidade.</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">CPF</span>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(somenteNumeros(e.target.value).slice(0, 11))}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Somente números"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">Matrícula</span>
                <input
                  value={matricula}
                  onChange={(e) => setMatricula(somenteNumeros(e.target.value).slice(0, 20))}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Informe sua matrícula"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  required
                />
              </label>

              {erro ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{erro}</div> : null}

              <button
                type="submit"
                disabled={loading || cpf.length !== 11 || !matricula}
                className="h-12 w-full rounded-xl bg-slate-950 px-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Validando..." : "Continuar"}
              </button>
            </form>
          ) : null}

          {etapa === "dados" ? (
            <form onSubmit={solicitar} className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Etapa 2 de 2</p>
                <h2 className="mt-1 text-2xl font-black">Atualize seus contatos</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Cadastro localizado para <strong>{nome}</strong>. Informe os dados que deseja atualizar.</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">E-mail</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value.slice(0, 180))}
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">Telefone</span>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(somenteNumeros(e.target.value).slice(0, 13))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="DDD + número"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">WhatsApp</span>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(somenteNumeros(e.target.value).slice(0, 13))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="DDD + número"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
                <span className="mt-2 block text-xs leading-5 text-slate-500">A solicitação não altera automaticamente o número usado na autenticação eleitoral.</span>
              </label>

              {erro ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{erro}</div> : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEtapa("identificacao");
                    setToken("");
                    setErro("");
                  }}
                  className="h-12 rounded-xl border border-slate-300 px-4 font-bold text-slate-700"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading || (!email.trim() && !telefone && !whatsapp)}
                  className="h-12 flex-1 rounded-xl bg-slate-950 px-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar atualização"}
                </button>
              </div>
            </form>
          ) : null}

          {etapa === "concluido" ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">Solicitação registrada</p>
              <h2 className="mt-2 text-2xl font-black">Dados enviados com sucesso</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Sua solicitação foi enviada para processamento pela entidade. Os dados não são alterados automaticamente na votação.
              </p>
              {solicitacao ? <div className="mx-auto mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Protocolo #{solicitacao}</div> : null}
              <Link href="/" className="mt-7 block h-12 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800">
                Concluir
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
