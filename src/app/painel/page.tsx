import Link from "next/link";
import { PageHeader } from "@/components/plataforma/PageHeader";

export default function PainelPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Visão geral" description="Gestão completa da plataforma." actions={
        <Link href="/painel/eleicoes/nova" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Nova eleição</Link>
      } />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["Eleições", "Associados", "Eleitores aptos", "Chapas"].map((x) => (
          <div key={x} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{x}</p><p className="mt-2 text-3xl font-bold">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
