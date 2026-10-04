import Link from "next/link";
import { PageHeader } from "@/components/plataforma/PageHeader";

export default function AssociadosPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Associados" description="Cadastre e mantenha a base eleitoral." actions={
        <div className="flex gap-2">
          <Link href="/painel/associados/importar" className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold">Importar</Link>
          <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Novo associado</button>
        </div>
      } />
      <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">Listagem, filtros por nome, CPF e matrícula.</div>
    </div>
  );
}
