import Link from "next/link";
import { SiteFooter } from "@/components/plataforma/SiteFooter";
import { SiteHeader } from "@/components/plataforma/SiteHeader";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#07131f]">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-[#dbe5e1] bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,134,106,0.12),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(7,19,31,0.06),transparent_28%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#00745c]">Sobre a MoviSystem</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Tecnologia em movimento para aproximar empresas, entidades e pessoas.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#566679]">
            A MoviSystem desenvolve soluções digitais voltadas à gestão, comunicação e participação. O módulo de Eleições &amp; Assembleias amplia esse ecossistema com processos eleitorais e deliberativos online.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] bg-[#006b57] p-7 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b9eadc]">Nossa atuação</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Soluções digitais integradas ao ecossistema MoviSystem.</h2>
            <p className="mt-5 leading-7 text-[#e6f7f2]">
              A plataforma reúne gestão, participação digital, atualização cadastral, eleições, assembleias, apuração e resultados em uma experiência organizada para administradores e participantes.
            </p>
            <p className="mt-5 leading-7 text-[#e6f7f2]">
              Nosso objetivo é simplificar processos e tornar a tecnologia mais próxima da rotina das entidades que utilizam a MoviSystem.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#dbe5e1] bg-white p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7b8997]">Dados da empresa</p>
            <div className="mt-6 grid gap-5 text-sm text-[#42546a]">
              <div>
                <span className="block font-bold text-[#07131f]">Razão social</span>
                <span className="mt-1 block leading-6">MOVISYSTEM TECNOLOGIA DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVE</span>
              </div>
              <div>
                <span className="block font-bold text-[#07131f]">CNPJ</span>
                <span className="mt-1 block">69.235.892/0001-06</span>
              </div>
              <div>
                <span className="block font-bold text-[#07131f]">Instagram</span>
                <a
                  href="https://www.instagram.com/movi.system"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-semibold text-[#00745c] hover:text-[#005e4b]"
                >
                  @movi.system
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dbe5e1] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Gestão", "Soluções para organizar processos, informações e rotinas."],
              ["Participação", "Ferramentas digitais para aproximar entidades e participantes."],
              ["Integração", "Recursos conectados ao ecossistema MoviSystem."],
            ].map(([titulo, texto]) => (
              <article key={titulo} className="rounded-3xl border border-[#dbe5e1] bg-[#f7faf9] p-6">
                <h2 className="text-xl font-black">{titulo}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5a6979]">{texto}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contato" className="rounded-xl bg-[#00866a] px-5 py-3 font-bold text-white transition hover:bg-[#006b57]">
              Falar com a MoviSystem
            </Link>
            <a
              href="https://movisystem.com.br"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[#cbd8d3] bg-white px-5 py-3 font-bold text-[#172433] transition hover:border-[#00866a] hover:text-[#006b57]"
            >
              Conhecer a MoviSystem
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
