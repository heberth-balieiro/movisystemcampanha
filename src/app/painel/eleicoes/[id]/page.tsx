import Link from "next/link";
import { PageHeader } from "@/components/plataforma/PageHeader";

export default async function EleicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cards = [
    ["Configuração", `/painel/eleicoes/${id}/configuracao`],
    ["Chapas", `/painel/eleicoes/${id}/chapas`],
    ["Eleitores aptos", `/painel/eleitores?eleicao=${id}`],
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={`Eleição #${id}`} description="Central de preparação da eleição." />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(([x, href]) => <Link key={href} href={href} className="rounded-2xl border bg-white p-6 font-bold shadow-sm">{x}</Link>)}
      </div>
    </div>
  );
}
