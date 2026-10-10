import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Como votar | Sistema de Votação Digital",
  description: "Passo a passo para acessar a eleição, confirmar sua identidade, registrar o voto e guardar o comprovante.",
};

type Props = { params: Promise<{ slug: string }> };

type Passo = {
  numero: string;
  titulo: string;
  icone: Parameters<typeof Icon>[0]["name"];
  conteudo: ReactNode;
};

export default async function ComoUsarPage({ params }: Props) {
  const { slug } = await params;

  const passos: Passo[] = [
    {
      numero: "01",
      titulo: "Acesse a eleição",
      icone: "login",
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
      conteudo: (
        <>
          <p>Na tela <strong>Identificação do eleitor</strong>, informe seu <strong>CPF</strong> e sua <strong>Matrícula</strong>.</p>
          <p>Depois de preencher os dados, selecione <strong>Continuar</strong>.</p>
          <p>A matrícula fica oculta durante a digitação.</p>
        </>
      ),
    },
    {
      numero: "03",
      titulo: "Confirme sua identidade",
      icone: "whatsapp",
      conteudo: (
        <>
          <p>Após a identificação, o sistema envia automaticamente um <strong>código de 6 dígitos para o WhatsApp cadastrado</strong>.</p>
          <ol className="space-y-2 pl-5 marker:font-black marker:text-[var(--brand)] [&>li]:list-decimal">
            <li>Verifique o WhatsApp informado na tela.</li>
            <li>Digite o código recebido no campo <strong>Código de confirmação</strong>.</li>
            <li>Selecione <strong>Confirmar código</strong> para continuar.</li>
          </ol>
          <p>Se o código expirar ou não chegar, aguarde o tempo indicado e use <strong>Reenviar código</strong> quando a opção estiver disponível.</p>
          <p className="font-semibold text-[var(--foreground)]">Não compartilhe o código de confirmação com outras pessoas.</p>
        </>
      ),
    },
    {
      numero: "04",
      titulo: "Confira a cédula",
      icone: "ticket",
      conteudo: (
        <>
          <p>Depois da confirmação, a cédula de votação é exibida.</p>
          <p>Confira o <strong>nome da eleição</strong>, a <strong>descrição</strong> quando disponível e o <strong>ano</strong> apresentado antes de fazer sua escolha.</p>
        </>
      ),
    },
    {
      numero: "05",
      titulo: "Escolha seu voto",
      icone: "check",
      conteudo: (
        <>
          <p>Selecione uma das <strong>chapas</strong> disponíveis na cédula.</p>
          <p>Se preferir, a própria tela também oferece as opções <strong>Voto em Branco</strong> e <strong>Voto Nulo</strong>.</p>
          <p>Depois de escolher, selecione <strong>Continuar</strong>.</p>
        </>
      ),
    },
    {
      numero: "06",
      titulo: "Revise seu voto",
      icone: "eye",
      conteudo: (
        <>
          <p>Na etapa <strong>Confirme seu voto</strong>, o sistema apresenta a opção selecionada para revisão.</p>
          <p>Se quiser corrigir sua escolha antes do registro, selecione <strong>Voltar e revisar</strong>.</p>
        </>
      ),
    },
    {
      numero: "07",
      titulo: "Confirme o voto",
      icone: "save",
      conteudo: (
        <>
          <p>Depois de conferir sua escolha, selecione <strong>Confirmar voto</strong>.</p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-semibold leading-6 text-amber-900">
            Após a confirmação, o voto não poderá ser alterado ou substituído.
          </div>
        </>
      ),
    },
    {
      numero: "08",
      titulo: "Guarde seu comprovante",
      icone: "ticket",
      conteudo: (
        <>
          <p>Após o registro, a tela <strong>Voto registrado com sucesso</strong> apresenta o código do comprovante.</p>
          <p>Você pode <strong>Copiar comprovante</strong>, <strong>Compartilhar comprovante</strong> e usar <strong>Validar comprovante</strong> para consultar a validade do registro.</p>
          <p className="font-semibold text-[var(--foreground)]">O comprovante confirma a participação, mas não revela nem permite identificar a opção escolhida no voto.</p>
        </>
      ),
    },
  ];

  const duvidas = [
    {
      pergunta: "Não recebi meu código de acesso. O que fazer?",
      resposta: "O código é enviado ao WhatsApp cadastrado. Aguarde o tempo indicado na tela e use “Reenviar código” quando a opção estiver disponível. Se o problema continuar, entre em contato com a entidade responsável para conferir seus dados cadastrais.",
    },
    {
      pergunta: "Posso alterar meu voto?",
      resposta: "Sim, antes do registro definitivo. Na tela de confirmação, use “Voltar e revisar” para retornar à cédula. Depois de selecionar “Confirmar voto” e o registro ser concluído, a escolha não pode ser alterada ou substituída.",
    },
    {
      pergunta: "Como sei que meu voto foi registrado?",
      resposta: "Após a conclusão, o sistema exibe a mensagem “Voto registrado com sucesso” e apresenta um código de comprovante que pode ser copiado, compartilhado e validado.",
    },
    {
      pergunta: "Posso votar novamente?",
      resposta: "Não. Depois que o voto é registrado, a aplicação bloqueia uma nova votação para o mesmo eleitor nessa eleição.",
    },
    {
      pergunta: "Meu acesso não está funcionando. O que faço?",
      resposta: "Confira se o CPF e a matrícula foram informados corretamente. Se o acesso continuar indisponível ou seus dados não forem reconhecidos, entre em contato com a entidade responsável pela eleição.",
    },
  ];

  return (
    <EleicaoLayout subtitulo="Orientações para participar da votação com segurança.">
      <article className="mx-auto max-w-5xl">
        <header className="text-center">
          <span className="inline-flex rounded-full border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand)]">
            Manual do eleitor
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">Como votar</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base lg:text-lg">
            Veja o passo a passo para acessar a eleição, confirmar sua identidade e registrar seu voto com segurança.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="passo-a-passo-title">
          <h2 id="passo-a-passo-title" className="sr-only">Passo a passo para votar</h2>
          <div className="space-y-4 sm:space-y-5">
            {passos.map((passo) => (
              <section key={passo.numero} className="relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <span className="grid size-12 place-items-center rounded-2xl bg-[var(--brand-soft)] font-black text-[var(--brand)] sm:size-14">
                      {passo.numero}
                    </span>
                    <span className="grid size-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--brand)]">
                      <Icon name={passo.icone} className="size-4" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black tracking-tight text-[var(--foreground)] sm:text-xl">{passo.titulo}</h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                      {passo.conteudo}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[28px] border border-[var(--line)] bg-[var(--surface-muted)] p-5 sm:p-7 lg:p-8" aria-labelledby="duvidas-title">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--brand)] shadow-sm">
              <Icon name="search" className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">Ajuda rápida</p>
              <h2 id="duvidas-title" className="mt-1 text-2xl font-black tracking-tight text-[var(--foreground)]">Dúvidas frequentes</h2>
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
          <ButtonLink href={`/${slug}`} variant="secondary" className="w-full sm:w-auto">Voltar para eleição</ButtonLink>
        </div>
      </article>
    </EleicaoLayout>
  );
}
