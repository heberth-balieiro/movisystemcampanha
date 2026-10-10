import { SiteFooter } from "@/components/plataforma/SiteFooter";
import { SiteHeader } from "@/components/plataforma/SiteHeader";

const contatos = [
  {
    titulo: "Comercial",
    valor: "comercial@movisystem.com.br",
    href: "mailto:comercial@movisystem.com.br",
  },
  {
    titulo: "Contato",
    valor: "contato@movisystem.com.br",
    href: "mailto:contato@movisystem.com.br",
  },
  {
    titulo: "Telefone / WhatsApp",
    valor: "+55 69 99216-1179",
    href: "https://wa.me/5569992161179",
  },
  {
    titulo: "Instagram",
    valor: "@movi.system",
    href: "https://www.instagram.com/movi.system",
  },
];

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#07131f]">
      <SiteHeader />

      <section className="border-b border-[#dbe5e1] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#00745c]">Contato</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Fale com a MoviSystem.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#566679]">
            Entre em contato com nossa equipe para informações comerciais, suporte e dúvidas sobre as soluções MoviSystem.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {contatos.map((contato) => (
              <a
                key={contato.titulo}
                href={contato.href}
                target={contato.href.startsWith("http") ? "_blank" : undefined}
                rel={contato.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-3xl border border-[#dbe5e1] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#9fd4c5] hover:shadow-xl hover:shadow-[#006b57]/5"
              >
                <span className="text-sm font-black uppercase tracking-[0.14em] text-[#00745c]">{contato.titulo}</span>
                <strong className="mt-3 block break-words text-lg text-[#07131f]">{contato.valor}</strong>
              </a>
            ))}
          </div>

          <div className="rounded-[2rem] bg-[#07131f] p-7 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#62d6b7]">MoviSystem</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Atendimento e relacionamento.</h2>
            <p className="mt-5 leading-7 text-slate-300">
              Utilize os canais oficiais ao lado para falar com a equipe MoviSystem. Para um atendimento mais rápido, você também pode utilizar o botão flutuante de WhatsApp disponível em todas as páginas.
            </p>
            <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-6 text-slate-400">
              <strong className="block text-white">MOVISYSTEM TECNOLOGIA DESENVOLVIMENTO DE SOFTWARE CUSTOMIZAVE</strong>
              <span className="mt-1 block">CNPJ 69.235.892/0001-06</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
