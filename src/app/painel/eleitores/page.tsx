import { PageHeader } from "@/components/plataforma/PageHeader";

export default function EleitoresPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Eleitores aptos" description="Gere os aptos e crie os usuários vinculados aos associados." />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border bg-white p-6">
          <label className="grid gap-1 text-sm font-medium">
            Eleição
            <select className="rounded-xl border px-3 py-2.5"><option>Selecione</option></select>
          </label>
          <ol className="mt-6 grid gap-2 text-sm text-slate-600">
            <li>1. Aplicar regras de elegibilidade.</li>
            <li>2. Gerar associados aptos.</li>
            <li>3. Revisar impedimentos.</li>
            <li>4. Criar usuários eleitorais.</li>
          </ol>
        </div>
        <div className="space-y-3">
          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Gerar associados aptos</button>
          <button className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Criar usuários dos aptos</button>
        </div>
      </div>
    </div>
  );
}
