import { PageHeader } from "@/components/plataforma/PageHeader";

export default function EmpresaPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Dados da empresa" description="Identificação e contatos da entidade." />
      <form className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-2">
        {["Razão social", "Nome fantasia", "CPF/CNPJ", "Telefone", "E-mail"].map((x) => (
          <label key={x} className="grid gap-1 text-sm font-medium">{x}<input className="rounded-xl border px-3 py-2.5" /></label>
        ))}
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-white sm:col-span-2">Salvar</button>
      </form>
    </div>
  );
}
