import Link from "next/link";
import { Brand } from "@/components/plataforma/Brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dbe5e1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#42546a] lg:flex" aria-label="Navegação principal">
          <Link href="/#processos" className="transition hover:text-[#00866a]">Eleições e assembleias</Link>
          <Link href="/#como-funciona" className="transition hover:text-[#00866a]">Como funciona</Link>
          <Link href="/sobre" className="transition hover:text-[#00866a]">Sobre</Link>
          <Link href="/contato" className="transition hover:text-[#00866a]">Contato</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/atualizar-cadastro"
            className="hidden rounded-xl px-3 py-2 text-sm font-bold text-[#314255] transition hover:bg-[#edf4f1] sm:inline-flex"
          >
            Atualizar cadastro
          </Link>
          <Link
            href="/acesso"
            className="rounded-xl bg-[#07131f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#006b57]"
          >
            Acessar
          </Link>
        </div>
      </div>
    </header>
  );
}
