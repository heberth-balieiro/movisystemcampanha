import Link from "next/link";
import { Brand } from "./Brand";

const items = [
  ["Visão geral", "/painel"],
  ["Empresa", "/painel/empresa"],
  ["Eleições", "/painel/eleicoes"],
  ["Associados", "/painel/associados"],
  ["Importar associados", "/painel/associados/importar"],
  ["Eleitores aptos", "/painel/eleitores"],
];

export function Sidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-4">
      <Brand />
      <nav className="mt-8 grid gap-1">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
