import { PageHeader } from "@/components/plataforma/PageHeader";

export default function MembrosPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Membros da chapa" description="Presidente, vice e demais integrantes." actions={
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Novo membro</button>
      } />
      <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">Listagem de membros e fotos.</div>
    </div>
  );
}
