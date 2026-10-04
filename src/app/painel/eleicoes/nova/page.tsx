import { PageHeader } from "@/components/plataforma/PageHeader";

export default function NovaEleicaoPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Nova eleição" description="A eleição inicia em RASCUNHO." />
      <form className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium sm:col-span-2">Nome<input className="rounded-xl border px-3 py-2.5" /></label>
        <label className="grid gap-1 text-sm font-medium sm:col-span-2">Descrição<textarea rows={4} className="rounded-xl border px-3 py-2.5" /></label>
        <label className="grid gap-1 text-sm font-medium">Ano inicial<input type="number" className="rounded-xl border px-3 py-2.5" /></label>
        <label className="grid gap-1 text-sm font-medium">Ano final<input type="number" className="rounded-xl border px-3 py-2.5" /></label>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-white sm:col-span-2">Criar eleição</button>
      </form>
    </div>
  );
}
