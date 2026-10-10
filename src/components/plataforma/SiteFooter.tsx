import Link from "next/link";
import { Brand } from "@/components/plataforma/Brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#112637] bg-[#07131f] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Brand variant="dark" className="max-w-[190px]" />
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
            Plataforma MoviSystem para eleições, assembleias, participação digital e gestão de processos eleitorais.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            MOVISYSTEM TECNOLOGIA DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVE<br />
            CNPJ 69.235.892/0001-06
          </p>
        </div>

        <div>
          <strong className="text-sm text-white">Plataforma</strong>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link href="/#processos" className="hover:text-white">Eleições e assembleias</Link>
            <Link href="/atualizar-cadastro" className="hover:text-white">Atualizar cadastro</Link>
            <Link href="/acesso" className="hover:text-white">Acesso administrativo</Link>
          </div>
        </div>

        <div>
          <strong className="text-sm text-white">MoviSystem</strong>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link href="/sobre" className="hover:text-white">Sobre a empresa</Link>
            <Link href="/contato" className="hover:text-white">Contato</Link>
            <a href="https://movisystem.com.br" target="_blank" rel="noreferrer" className="hover:text-white">
              Desenvolvido pela MoviSystem
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#112637]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>© 2026 MoviSystem. Todos os direitos reservados.</span>
          <span>Eleições &amp; Assembleias Online</span>
        </div>
      </div>
    </footer>
  );
}
