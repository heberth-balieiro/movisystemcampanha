import Image from "next/image";
import Link from "next/link";
import { HomeCarousel } from "@/components/plataforma/HomeCarousel";
import { PublicProcesses } from "@/components/plataforma/PublicProcesses";
import { SiteFooter } from "@/components/plataforma/SiteFooter";
import { SiteHeader } from "@/components/plataforma/SiteHeader";

const recursos = [
  "Votação por chapa",
  "Assembleias por questões e opções",
  "Controle de eleitores aptos",
  "Comprovante de participação",
  "Painel administrativo",
  "Apuração e resultados",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#07131f]">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_20%_15%,rgba(0,134,106,0.12),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(4,54,76,0.08),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#00745c]">MoviSystem · Eleições &amp; Assembleias</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.045em] text-[#07131f] sm:text-5xl lg:text-6xl">
              Participação digital para eleições e assembleias online.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#566679]">
              Uma plataforma para aproximar entidades e participantes, reunindo acesso à votação, deliberações, atualização cadastral, gestão e resultados em uma experiência simples e responsiva.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#processos"
                className="rounded-xl bg-[#00866a] px-5 py-3 font-bold text-white shadow-lg shadow-[#006b57]/10 transition hover:bg-[#006b57]"
              >
                Ver eleições e assembleias
              </a>
              <Link
                href="/acesso"
                className="rounded-xl border border-[#cbd8d3] bg-white px-5 py-3 font-bold text-[#172433] transition hover:border-[#00866a] hover:text-[#006b57]"
              >
                Acessar painel
              </Link>
              <Link
                href="/atualizar-cadastro"
                className="rounded-xl border border-[#cbd8d3] bg-white px-5 py-3 font-bold text-[#172433] transition hover:border-[#00866a] hover:text-[#006b57]"
              >
                Atualizar meus dados
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Online", "Acesso por celular e computador"],
                ["Integrado", "Eleição, assembleia e cadastro"],
                ["Organizado", "Gestão, apuração e resultados"],
              ].map(([titulo, texto]) => (
                <div key={titulo} className="rounded-2xl border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <strong className="block text-sm text-[#006b57]">{titulo}</strong>
                  <span className="mt-1 block text-sm leading-5 text-[#5c6b7a]">{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center lg:min-h-[420px] lg:justify-end">
            <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-[#00866a]/10 blur-3xl sm:h-80 sm:w-80" />
            <div className="relative w-full max-w-[520px] px-4 sm:px-8">
              <Image
                src="/logo1.png"
                alt="MoviSystem"
                width={900}
                height={500}
                priority
                className="h-auto w-full object-contain"
              />
              <p className="mx-auto mt-5 max-w-md text-center text-sm font-semibold leading-6 text-[#657486]">
                Tecnologia em movimento para gestão, participação e decisões digitais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="processos" className="border-y border-[#dbe5e1] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00745c]">Participação aberta</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Eleições e assembleias</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6979]">
              Encontre processos publicados pelas entidades que utilizam a plataforma MoviSystem. Eleições e assembleias em andamento aparecem primeiro, seguidas pelos próximos processos.
            </p>
          </div>

          <PublicProcesses />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeCarousel />
        </div>
      </section>

      <section id="como-funciona" className="bg-[#07131f] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between gap-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#62d6b7]">Como funciona</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Do acesso à participação em poucos passos.</h2>
            </div>
            <Image
              src="/logo2.png"
              alt="MoviSystem"
              width={320}
              height={120}
              className="hidden h-auto w-[190px] object-contain lg:block"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["01", "Encontre", "Localize sua eleição ou assembleia."],
              ["02", "Identifique-se", "Faça a identificação conforme as regras da entidade."],
              ["03", "Participe", "Acesse a cédula, chapa, questão ou opção disponível."],
              ["04", "Confirme", "Registre sua participação com segurança."],
              ["05", "Comprovante", "Receba a confirmação do registro realizado."],
            ].map(([numero, titulo, texto]) => (
              <div key={numero} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <span className="text-sm font-black text-[#62d6b7]">{numero}</span>
                <h3 className="mt-7 text-lg font-black">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00745c]">Plataforma integrada</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Recursos para entidades e participantes.</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#5a6979]">
              O módulo reúne o processo de votação digital e assembleias ao ecossistema MoviSystem, mantendo administração, participação e retorno de resultados organizados.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {recursos.map((recurso) => (
              <div key={recurso} className="flex items-center gap-3 rounded-2xl border border-[#dbe5e1] bg-[#f7faf9] p-4 font-semibold text-[#314255]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#dff5ee] text-[#006b57]" aria-hidden="true">✓</span>
                {recurso}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] bg-[#006b57] p-7 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b9eadc]">Sobre a MoviSystem</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Tecnologia para aproximar entidades e pessoas.</h2>
            <p className="mt-5 leading-7 text-[#e6f7f2]">
              A MoviSystem desenvolve soluções digitais voltadas à gestão, comunicação e participação. O módulo de Eleições &amp; Assembleias amplia esse ecossistema com processos eleitorais e deliberativos online.
            </p>
            <Link href="/sobre" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#006b57] transition hover:bg-[#edf8f4]">
              Conheça a MoviSystem
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#dbe5e1] bg-white p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7b8997]">Contato</p>
            <h2 className="mt-3 text-2xl font-black">Fale com a MoviSystem</h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-[#5a6979]">
              <a href="mailto:comercial@movisystem.com.br" className="font-semibold hover:text-[#006b57]">comercial@movisystem.com.br</a>
              <a href="mailto:contato@movisystem.com.br" className="font-semibold hover:text-[#006b57]">contato@movisystem.com.br</a>
              <a href="https://wa.me/5569992161179" target="_blank" rel="noreferrer" className="font-semibold hover:text-[#006b57]">+55 69 99216-1179</a>
              <a href="https://www.instagram.com/movi.system" target="_blank" rel="noreferrer" className="font-semibold hover:text-[#006b57]">Instagram @movi.system</a>
            </div>
            <Link href="/contato" className="mt-7 inline-flex rounded-xl bg-[#07131f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#006b57]">
              Ver todos os contatos
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
