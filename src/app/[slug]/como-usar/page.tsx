import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ComoUsarMockup, type ComoUsarMockupTipo } from "@/components/eleicao/ComoUsarMockups";
import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Como votar | Sistema de Votação Digital",
  description: "Passo a passo visual para acessar a eleição, confirmar sua identidade, registrar o voto e guardar o comprovante.",
};

type Props = { params: Promise<{ slug: string }> };

type Passo = {
  numero: string;
  titulo: string;
  icone: Parameters<typeof Icon>[0]["name"];
  mockup: ComoUsarMockupTipo;
  conteudo: ReactNode;
  observacao?: ReactNode;
};

export default async function ComoUsarPage({ params }: Props) {
  const { slug } = await params;

  const passos: Passo[] = [
    {
      numero: "01",
      titulo: "Acesse a eleição",
      icone: "login",
      mockup: "acesso",
      conteudo: (
        <>
          <p>Acesse o endereço da eleição informado pela entidade responsável.</p>
          <p>Na página inicial, confira o nome da eleição, a descrição quando disponível, o período e a situação da votação.</p>
          <p>Quando a votação estiver aberta, selecione <strong>Participar da votação</strong>.</p>
        </>
      ),
    },
    {
      numero: "02",
      titulo: "Faça sua identificação",
      icone: "user",
      mockup: "login",
      conteudo: (
        <>
          <p>Na tela <strong>Identificação do eleitor</strong>, informe seu <strong>CPF</strong> e sua <strong>Matrícula</strong>.</p>
          <p>Depois de preencher os dados, selecione <strong>Continuar</strong>.</p>
        </>
      ),
      observacao: "A matrícula fica oculta durante a digitação.",
    },
    {
      numero: "03",
      titulo: "Receba o código pelo WhatsApp",
      icone: "whatsapp",
      mockup: "whatsapp",
      conteudo: (
        <>
          <p>Após sua identificação, o sistema solicita automaticamente um código de confirmação.</p>
          <p>O código de <strong>6 dígitos</strong> é enviado primeiro ao <strong>WhatsApp cadastrado</strong>.</p>
          <p>Aguarde o recebimento antes de solicitar uma nova tentativa.</p>
        </>
      ),
      observacao: "Não compartilhe o código de confirmação com outras pessoas.",
    },
    {
      numero: "04",
      titulo: "Reenvie se necessário",
      icone: "whatsapp",
      mockup: "codigo",
      conteudo: (
        <>
          <p>Digite os 6 dígitos recebidos no campo <strong>Código de confirmação</strong> e selecione <strong>Confirmar código</strong>.</p>
          <p>Se a mensagem não chegar ou o código expirar, aguarde o tempo indicado e use <strong>Reenviar código</strong>.</p>
          <p>O sistema informará quando um novo envio estiver disponível.</p>
        </>
      ),
    },
    {
      numero: "05",
      titulo: "Receba por e-mail",
      icone: "mail",
      mockup: "codigo",
      conteudo: (
        <>
          <p>Se o reenvio pelo WhatsApp não resolver e houver um e-mail disponível para seu cadastro, a opção <strong>Receber por e-mail</strong> será apresentada.</p>
          <p>Use o novo código recebido por e-mail no mesmo campo <strong>Código de confirmação</strong>.</p>
        </>
      ),
      observacao: "A alternativa por e-mail aparece somente quando esse canal estiver disponível para o seu cadastro.",
    },
    {
      numero: "06",
      titulo: "Peça orientação à entidade",
      icone: "users",
      mockup: "codigo",
      conteudo: (
        <>
          <p>Se você não consegue acessar nenhum dos canais de confirmação, entre em contato com a <strong>entidade responsável pela eleição</strong>.</p>
          <p>A entidade poderá orientar você sobre como prosseguir com segurança.</p>
        </>
      ),
      observacao: "Nunca compartilhe sua senha nem o conteúdo do seu voto ao solicitar ajuda.",
    },
    {
      numero: "07",
      titulo: "Escolha seu voto",
      icone: "ticket",
      mockup: "cedula",
      conteudo: (
        <>
          <p>Na <strong>Cédula de votação</strong>, confira o nome e a descrição da eleição quando disponível.</p>
          <p>Selecione uma das <strong>chapas</strong>. A tela também permite <strong>Voto em Branco</strong> e <strong>Voto Nulo</strong>.</p>
          <p>Depois de escolher, selecione <strong>Continuar</strong>.</p>
        </>
      ),
    },
    {
      numero: "08",
      titulo: "Revise sua escolha",
      icone: "eye",
      mockup: "revisao",
      conteudo: (
        <>
          <p>Na etapa <strong>Confirme seu voto</strong>, confira com atenção a opção selecionada.</p>
          <p>Se quiser corrigir antes do registro, selecione <strong>Voltar e revisar</strong>.</p>
        </>
      ),
    },
    {
      numero: "09",
      titulo: "Confirme seu voto",
      icone: "save",
      mockup: "confirmacao",
      conteudo: (
        <>
          <p>Depois de revisar, selecione <strong>Confirmar voto</strong> para registrar sua participação.</p>
        </>
      ),
      observacao: (
        <span className="font-semibold text-amber-900">
          Após o registro, o voto não poderá ser alterado ou substituído.
        </span>
      ),
    },
    {
      numero: "10",
      titulo: "Guarde seu comprovante",
      icone: "ticket",
      mockup: "comprovante",
      conteudo: (
        <>
          <p>Ao concluir, o sistema apresenta <strong>Voto registrado com sucesso</strong> e o código do comprovante.</p>
          <p>Você pode <strong>Copiar comprovante</strong>, <strong>Compartilhar comprovante</strong> e usar <strong>Validar comprovante</strong>.</p>
        </>
      ),
      observacao: "O comprovante confirma a participação sem revelar nem permitir identificar a opção escolhida.",
    },
  ];

  const duvidas = [
    {
      pergunta: "Não recebi meu código no WhatsApp. O que devo fazer?",
      resposta: "Aguarde o tempo indicado na tela e use “Reenviar código”. Se ainda não receber e houver e-mail disponível no seu cadastro, a opção “Receber por e-mail” será apresentada.",
    },
    {
      pergunta: "Posso receber o código por e-mail?",
      resposta: "Sim, quando houver um e-mail disponível para o seu cadastro. A alternativa por e-mail é apresentada depois da tentativa de reenvio pelo WhatsApp.",
    },
    {
      pergunta: "Não tenho acesso ao WhatsApp nem ao e-mail. O que faço?",
      resposta: "Entre em contato com a entidade responsável pela eleição para receber orientação sobre como prosseguir.",
    },
    {
      pergunta: "Posso alterar meu voto?",
      resposta: "Antes do registro definitivo, sim. Na tela de confirmação, use “Voltar e revisar”. Depois que “Confirmar voto” concluir o registro, a escolha não pode ser alterada ou substituída.",
    },
    {
      pergunta: "Como sei que meu voto foi registrado?",
      resposta: "O sistema exibe “Voto registrado com sucesso” e apresenta um código de comprovante que pode ser copiado, compartilhado e validado.",
    },
    {
      pergunta: "Posso votar novamente?",
      resposta: "Não. Depois que o voto é registrado, a aplicação bloqueia uma nova votação para o mesmo eleitor nessa eleição.",
    },
    {
      pergunta: "Não consigo acessar. O que faço?",
      resposta: "Confira se o CPF e a matrícula foram informados corretamente. Se seus dados não forem reconhecidos, entre em contato com a entidade responsável pela eleição.",
    },
  ];

  return (
    <EleicaoLayout subtitulo="Orientações para participar da votação com segurança.">
      <article className="mx-auto max-w-5xl">
        <header className="text-center">
          <span className="inline-flex rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
            Manual do eleitor
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Como votar
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base lg:text-lg">
            Veja visualmente como acessar a eleição, confirmar sua identidade, registrar seu voto e guardar o comprovante.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="passo-a-passo-title">
          <h2 id="passo-a-passo-title" className="sr-only">Passo a passo para votar</h2>

          <div className="space-y-7 sm:space-y-9">
            {passos.map((passo, index) => {
              const inverter = index % 2 === 1;

              return (
                <section
                  className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-white shadow-[0_18px_45px_-38px_rgba(15,23,42,0.45)]"
                  key={passo.numero}
                >
                  <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8">
                    <div className={inverter ? "lg:order-2" : ""}>
                      <ComoUsarMockup tipo={passo.mockup} />
                    </div>

                    <div className={`min-w-0 ${inverter ? "lg:order-1" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] font-black text-[var(--brand)]">
                          {passo.numero}
                        </span>
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--brand)]">
                          <Icon name={passo.icone} className="size-4" />
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--foreground)] sm:text-2xl">
                        {passo.titulo}
                      </h3>

                      <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                        {passo.conteudo}
                      </div>

                      {passo.observacao ? (
                        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
                          {passo.observacao}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section
          className="mt-12 rounded-[28px] border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-7 lg:p-8"
          aria-labelledby="duvidas-title"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
              <Icon name="search" className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">Ajuda rápida</p>
              <h2 id="duvidas-title" className="mt-1 text-2xl font-black tracking-tight text-[var(--foreground)]">
                Dúvidas frequentes
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {duvidas.map((item) => (
              <section key={item.pergunta} className="rounded-2xl border border-[var(--line)] bg-white p-5">
                <h3 className="text-sm font-black leading-6 text-[var(--foreground)] sm:text-base">{item.pergunta}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.resposta}</p>
              </section>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <ButtonLink href={`/${slug}`} variant="secondary" className="w-full sm:w-auto">
            Voltar para eleição
          </ButtonLink>
        </div>
      </article>
    </EleicaoLayout>
  );
}
