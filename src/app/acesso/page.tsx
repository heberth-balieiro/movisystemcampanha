"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { loginAdminEleicao } from "@/services/eleicao/eleicao.service";
import { salvarSessaoAdmin } from "@/services/eleicao/eleicao-session.service";

function normalizarSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+\//i, "")
    .replace(/^\/+|\/+$/g, "");
}

export default function AcessoPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const slugNormalizado = normalizarSlug(slug);

    if (!slugNormalizado) {
      setErro("Informe o identificador (slug) do ambiente que deseja administrar.");
      return;
    }

    if (!email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }

    if (!senha) {
      setErro("Informe a senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginAdminEleicao(slugNormalizado, email.trim(), senha);

      if (response.erro || !response.dados) {
        setErro(response.mensagem || "Não foi possível acessar este ambiente com os dados informados.");
        return;
      }

      salvarSessaoAdmin(slugNormalizado, response.dados.token, response.dados.nome);
      router.replace(`/${slugNormalizado}/admin/painel`);
    } catch {
      setErro("Não foi possível entrar no painel agora. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#07131f]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_15%_10%,rgba(0,134,106,0.13),transparent_34%),radial-gradient(circle_at_88%_8%,rgba(4,54,76,0.09),transparent_32%)]" />

      <header className="border-b border-[#dbe5e1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center" aria-label="MoviSystem - página inicial">
            <Image
              src="/logo1.png"
              alt="MoviSystem"
              width={320}
              height={120}
              priority
              className="h-auto w-[170px] object-contain sm:w-[190px]"
            />
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-[#cbd8d3] bg-white px-4 py-2.5 text-sm font-bold text-[#314255] transition hover:border-[#00866a] hover:text-[#006b57]"
          >
            Voltar ao site
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#00745c]">Área administrativa</p>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-[#07131f] sm:text-5xl">
            Gestão do seu ambiente de eleições e assembleias.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a6979]">
            Acesse o painel da entidade para acompanhar eleições, participantes, configurações e resultados do ambiente vinculado ao seu endereço.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              ["Ambiente", "Acesso separado pelo slug da entidade"],
              ["Gestão", "Eleições, eleitores e configurações"],
              ["Seguro", "Sessão administrativa por ambiente"],
            ].map(([titulo, texto]) => (
              <div key={titulo} className="rounded-2xl border border-[#dbe5e1] bg-white/85 p-4 shadow-sm backdrop-blur">
                <strong className="block text-sm text-[#006b57]">{titulo}</strong>
                <span className="mt-1 block text-sm leading-5 text-[#657486]">{texto}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#cfe1db] bg-[#eaf7f3] p-5 text-sm leading-6 text-[#345348]">
            <strong className="block text-[#006b57]">Onde encontro o slug?</strong>
            <span className="mt-1 block">
              É o identificador usado no endereço público do seu processo. Exemplo: em <strong>movisystem.com.br/minha-entidade</strong>, o slug é <strong>minha-entidade</strong>.
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[520px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#dbe5e1] bg-white p-6 shadow-[0_30px_80px_-50px_rgba(7,19,31,0.38)] sm:p-8"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00866a]">Acesso restrito</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Entrar no painel</h2>
              <p className="mt-2 text-sm leading-6 text-[#657486]">
                Informe o ambiente e suas credenciais administrativas.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block text-sm font-bold text-[#253546]">
                Slug do ambiente
                <div className="mt-2 flex overflow-hidden rounded-xl border border-[#cbd8d3] bg-white transition focus-within:border-[#00866a] focus-within:ring-4 focus-within:ring-[#00866a]/10">
                  <span className="hidden items-center border-r border-[#e2ebe7] bg-[#f7faf9] px-3 text-xs font-semibold text-[#71808e] sm:flex">
                    /
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    disabled={loading}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="minha-entidade"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium outline-none placeholder:text-[#a0adb7]"
                  />
                </div>
              </label>

              <label className="block text-sm font-bold text-[#253546]">
                E-mail
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  placeholder="nome@entidade.com.br"
                  className="mt-2 w-full rounded-xl border border-[#cbd8d3] bg-white px-4 py-3 text-sm font-medium outline-none transition placeholder:text-[#a0adb7] focus:border-[#00866a] focus:ring-4 focus:ring-[#00866a]/10"
                />
              </label>

              <label className="block text-sm font-bold text-[#253546]">
                Senha
                <input
                  type="password"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  disabled={loading}
                  placeholder="Sua senha"
                  className="mt-2 w-full rounded-xl border border-[#cbd8d3] bg-white px-4 py-3 text-sm font-medium outline-none transition placeholder:text-[#a0adb7] focus:border-[#00866a] focus:ring-4 focus:ring-[#00866a]/10"
                />
              </label>
            </div>

            {erro ? (
              <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                {erro}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#00866a] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#006b57]/10 transition hover:bg-[#006b57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Acessar painel"}
            </button>

            <div className="mt-5 border-t border-[#e2ebe7] pt-5 text-center text-xs leading-5 text-[#7b8997]">
              O acesso administrativo é validado de forma independente para cada ambiente.
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
