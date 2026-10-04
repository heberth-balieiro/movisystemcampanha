import { PageHeader } from "@/components/plataforma/PageHeader";

export default function ConfigPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Configuração da eleição" description="Período, slug e apresentação pública." />
      <form className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2">
        {["Slug", "Nome de exibição", "Data/hora início", "Data/hora fim", "E-mail", "Telefone"].map((x) => (
          <label key={x} className="grid gap-1 text-sm font-medium">{x}<input className="rounded-xl border px-3 py-2.5" /></label>
        ))}
        <label className="grid gap-1 text-sm font-medium sm:col-span-2">Mensagem de boas-vindas<textarea rows={4} className="rounded-xl border px-3 py-2.5" /></label>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-white sm:col-span-2">Salvar configuração</button>
      </form>
    </div>
  );
}
