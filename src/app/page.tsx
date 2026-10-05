import Link from "next/link";
import { Brand } from "@/components/plataforma/Brand";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Brand />
          <div className="flex gap-2">
            <Link href="/atualizar-cadastro" className="rounded-lg px-4 py-2 text-sm font-semibold">Atualizar cadastro</Link>
            <Link href="/acesso" className="rounded-lg px-4 py-2 text-sm font-semibold">Acessar</Link>
            <Link href="/cadastro" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Criar conta</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-500">PLATAFORMA EASYELEIÇÃO</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">Eleições digitais do cadastro à votação.</h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Cadastre sua entidade, eleições, chapas, membros e associados. Gere os eleitores aptos e administre todo o processo pela web.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cadastro" className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Começar agora</Link>
            <Link href="/acesso" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold">Acessar painel</Link>
            <Link href="/atualizar-cadastro" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold">Atualizar meus dados</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          {["Empresa", "Eleição e configuração", "Chapas e membros", "Associados", "Eleitores aptos", "Votação"].map((x, i) => (
            <div key={x} className="mb-3 rounded-xl bg-slate-50 px-4 py-4 text-sm font-semibold">{i + 1}. {x}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
