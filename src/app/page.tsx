import Link from "next/link";
import { Brand } from "@/components/plataforma/Brand";
import { HomeCarousel } from "@/components/plataforma/HomeCarousel";

const processos = [
  {
    tipo: "ELEIÇÃO",
    titulo: "Eleições online",
    descricao: "Os processos eleitorais abertos das entidades aparecerão aqui assim que a listagem pública for conectada à API.",
  },
  {
    tipo: "ASSEMBLEIA",
    titulo: "Assembleias e deliberações",
    descricao: "Assembleias em andamento e próximas consultas também serão exibidas nesta área da plataforma.",
  },
];

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
    <main className="min-h-screen bg-[#f5f8f7] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Brand />

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex" aria-label="Navegação principal">
            <a href="#processos" className="transition hover:text-emerald-700">Eleições e assembleias</a>
            <a href="#como-funciona" className="transition hover:text-emerald-700">Como funciona</a>
            <a href="#sobre" className="transition hover:text-emerald-700">Sobre</a>
            <a href="#contato" className="transition hover:text-emerald-700">Contato</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/atualizar-cadastro"
              className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Atualizar cadastro
            </Link>
            <Link
              href="/acesso"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Acessar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_20%_15%,rgba(5,150,105,0.13),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.10),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">MoviSystem · Eleições &amp; Assembleias</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              Participação digital para eleições e assembleias online.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Uma plataforma para aproximar entidades e participantes, reunindo acesso à votação, deliberações, atualização cadastral, gestão e resultados em uma experiência simples e responsiva.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#processos"
                className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800"
              >
                Ver eleições e assembleias
              </a>
              <Link
                href="/acesso"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:border-emerald-700 hover:text-emerald-800"
              >
                Acessar painel
              </Link>
              <Link
                href="/atualizar-cadastro"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:border-emerald-700 hover:text-emerald-800"
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
                <div key={titulo} className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
                  <strong className="block text-sm text-emerald-800">{titulo}</strong>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-6">
            <div className="absolute -left-4 -top-6 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Identidade MoviSystem</p>
              <div className="mt-8 flex min-h-48 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-20 w-20 rotate-45 rounded-[24px] border-[5px] border-emerald-700" />
                    <span className="absolute h-9 w-9 rotate-45 rounded-[10px] bg-emerald-700" />
                  </div>
                  <strong className="mt-5 block text-3xl font-black tracking-tight">MoviSystem</strong>
                  <span className="mt-1 block text-sm font-semibold text-slate-500">Eleições &amp; Assembleias</span>
                  <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-slate-500">
                    Espaço preparado para receber o logotipo oficial da MoviSystem em fundo transparente, sem moldura ou caixa ao redor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="processos" className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Participação aberta</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Eleições e assembleias</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Esta área será alimentada pela API pública e mostrará processos disponíveis para participação em todas as entidades que utilizam a plataforma.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
              Integração com a API será a próxima etapa
            </span>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {processos.map((processo) => (
              <article key={processo.tipo} className="group rounded-3xl border border-slate-200 bg-[#f8faf9] p-6 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black tracking-wide text-emerald-800">{processo.tipo}</span>
                  <span className="text-xs font-bold text-slate-400">Em breve</span>
                </div>
                <h3 className="mt-5 text-xl font-black">{processo.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{processo.descricao}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <span>Processos públicos aparecerão automaticamente</span>
                  <span aria-hidden="true">→</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeCarousel />
        </div>
      </section>

      <section id="como-funciona" className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">Como funciona</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Do acesso à participação em poucos passos.</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["01", "Encontre", "Localize sua eleição ou assembleia."],
              ["02", "Identifique-se", "Faça a identificação conforme as regras da entidade."],
              ["03", "Participe", "Acesse a cédula, chapa, questão ou opção disponível."],
              ["04", "Confirme", "Registre sua participação com segurança."],
              ["05", "Comprovante", "Receba a confirmação do registro realizado."],
            ].map(([numero, titulo, texto]) => (
              <div key={numero} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-sm font-black text-emerald-300">{numero}</span>
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
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Plataforma integrada</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Recursos para entidades e participantes.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              O módulo reúne o processo de votação digital e assembleias ao ecossistema MoviSystem, mantendo administração, participação e retorno de resultados organizados.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {recursos.map((recurso) => (
              <div key={recurso} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8faf9] p-4 font-semibold text-slate-700">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800" aria-hidden="true">✓</span>
                {recurso}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] bg-emerald-800 p-7 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">Sobre a MoviSystem</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Tecnologia para aproximar entidades e pessoas.</h2>
            <p className="mt-5 leading-7 text-emerald-50/90">
              A MoviSystem desenvolve soluções digitais voltadas à gestão, comunicação e participação. O módulo de Eleições &amp; Assembleias amplia esse ecossistema com processos eleitorais e deliberativos online.
            </p>
          </div>

          <div id="contato" className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Contato</p>
            <h2 className="mt-3 text-2xl font-black">Fale com a MoviSystem</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Este espaço está reservado para os canais oficiais de atendimento comercial, suporte, telefone, e-mail e endereço da empresa. Os dados serão publicados somente após confirmação oficial.
            </p>
            <p className="mt-6 text-sm font-semibold text-slate-500">Desenvolvimento e operação da plataforma: MoviSystem.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <Brand />
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Plataforma MoviSystem para eleições, assembleias, participação digital e gestão de processos eleitorais.
            </p>
          </div>
          <div>
            <strong className="text-sm text-white">Plataforma</strong>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a href="#processos" className="hover:text-white">Eleições e assembleias</a>
              <Link href="/atualizar-cadastro" className="hover:text-white">Atualizar cadastro</Link>
              <Link href="/acesso" className="hover:text-white">Acesso administrativo</Link>
            </div>
          </div>
          <div>
            <strong className="text-sm text-white">MoviSystem</strong>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <a href="#sobre" className="hover:text-white">Sobre a empresa</a>
              <a href="#contato" className="hover:text-white">Contato</a>
              <span>Desenvolvido pela MoviSystem</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <span>© 2026 MoviSystem. Todos os direitos reservados.</span>
            <span>Eleições &amp; Assembleias Online</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
