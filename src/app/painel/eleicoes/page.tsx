import Link from "next/link";
import { PageHeader } from "@/components/plataforma/PageHeader";

export default function EleicoesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Eleições" description="Cadastro e preparação dos processos eleitorais." actions={
        <Link href="/painel/eleicoes/nova" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Nova eleição</Link>
      } />
      <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">
        Listagem das eleições.
      </div>
    </div>
  );
}
