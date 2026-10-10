import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";

export type ComoUsarMockupTipo =
  | "acesso"
  | "login"
  | "whatsapp"
  | "codigo"
  | "cedula"
  | "revisao"
  | "confirmacao"
  | "comprovante";

type Props = {
  tipo: ComoUsarMockupTipo;
};

const buttonBase =
  "inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-[11px] font-extrabold shadow-sm";

function Janela({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  return (
    <div
      aria-label={ariaLabel}
      className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-white shadow-[0_22px_55px_-40px_rgba(15,23,42,0.55)]"
      role="img"
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3">
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
          Sistema de Votação Digital
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, masked = false }: { label: string; value: string; masked?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-extrabold text-[var(--foreground)]">{label}</div>
      <div className="mt-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 font-mono text-[11px] font-bold text-[var(--foreground)]">
        {masked ? "••••••••" : value}
      </div>
    </div>
  );
}

function AcessoMockup() {
  return (
    <Janela ariaLabel="Tela inicial da eleição com botão Participar da votação.">
      <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">
              Eleição em destaque
            </div>
            <div className="mt-1.5 text-base font-black text-[var(--foreground)]">Eleição de Demonstração</div>
            <div className="mt-1 text-[10px] leading-5 text-[var(--muted)]">
              Processo demonstrativo para orientar o eleitor.
            </div>
          </div>
          <span className="rounded-full border border-[var(--brand)]/25 bg-[var(--brand-soft)] px-2.5 py-1 text-[9px] font-black text-[var(--brand-strong)]">
            Votação aberta
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--surface-muted)] p-3">
            <div className="text-[9px] font-black uppercase text-[var(--brand)]">Início da votação</div>
            <div className="mt-1 text-[10px] font-bold">01/10/2026 às 08:00</div>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-3">
            <div className="text-[9px] font-black uppercase text-[var(--brand)]">Encerramento da votação</div>
            <div className="mt-1 text-[10px] font-bold">10/10/2026 às 18:00</div>
          </div>
        </div>

        <div className="mt-4">
          <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)]`}>
            <Icon name="login" className="mr-1.5 size-3.5" />
            Participar da votação
          </span>
        </div>
      </div>
    </Janela>
  );
}

function LoginMockup() {
  return (
    <Janela ariaLabel="Tela de identificação do eleitor com campos CPF e Matrícula e botão Continuar.">
      <div className="mx-auto max-w-sm">
        <div className="text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">Acesso do eleitor</div>
          <div className="mt-1 text-base font-black">Identificação do eleitor</div>
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <Field label="CPF" value="***.***.***-**" />
          <Field label="Matrícula" value="" masked />
          <div className="grid gap-2 pt-1 sm:grid-cols-2">
            <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)]`}>
              <Icon name="login" className="mr-1.5 size-3.5" />
              Continuar
            </span>
            <span className={`${buttonBase} border border-[var(--line)] bg-white text-[var(--foreground)]`}>
              Voltar para eleição
            </span>
          </div>
        </div>
      </div>
    </Janela>
  );
}

function WhatsAppMockup() {
  return (
    <div
      aria-label="Ilustração de celular com mensagem de WhatsApp contendo um código fictício de confirmação."
      className="mx-auto max-w-[330px] rounded-[34px] border-[5px] border-slate-800 bg-slate-900 p-2 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.7)]"
      role="img"
    >
      <div className="overflow-hidden rounded-[25px] bg-[#eef7f1]">
        <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <span className="grid size-8 place-items-center rounded-full bg-white/15">
            <Icon name="whatsapp" className="size-4" />
          </span>
          <div>
            <div className="text-xs font-black">Sistema de Votação</div>
            <div className="text-[9px] text-white/75">WhatsApp cadastrado</div>
          </div>
        </div>

        <div className="min-h-64 p-4">
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-white p-3 shadow-sm">
            <p className="text-[11px] leading-5 text-slate-700">
              Seu código de confirmação para acessar a votação é:
            </p>
            <p className="mt-2 font-mono text-xl font-black tracking-[0.16em] text-slate-900">123456</p>
            <p className="mt-2 text-[9px] leading-4 text-slate-500">Use este código no portal. Não compartilhe com outras pessoas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodigoMockup() {
  return (
    <Janela ariaLabel="Tela para informar o código de confirmação recebido pelo eleitor no WhatsApp.">
      <div className="mx-auto max-w-sm">
        <div className="text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">
            Confirmação em duas etapas
          </div>
          <div className="mt-1 text-base font-black">Confirmação de identidade</div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] p-3 text-[10px] leading-5 text-[var(--brand-strong)]">
          Olá, <strong>João da Silva.</strong><br />
          Enviamos um código para o WhatsApp cadastrado.<br />
          <strong>(**) *****-1234</strong>
        </div>

        <div className="mt-4">
          <div className="text-[10px] font-extrabold">Código de confirmação</div>
          <div className="mt-1.5 rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-center font-mono text-xl font-black tracking-[0.22em]">
            123456
          </div>
          <div className="mt-2 text-center text-[9px] text-[var(--muted)]">Código válido por 04:32</div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)]`}>
            <Icon name="check" className="mr-1.5 size-3.5" />
            Confirmar código
          </span>
          <span className={`${buttonBase} border border-[var(--line)] bg-white text-[var(--foreground)]`}>
            Voltar para eleição
          </span>
        </div>

        <div className="mt-3 text-center text-[10px] font-bold text-[var(--brand)]">Reenviar código</div>
      </div>
    </Janela>
  );
}

function CedulaMockup() {
  return (
    <Janela ariaLabel="Cédula de votação de demonstração com duas chapas fictícias, voto em branco, voto nulo e botão Continuar.">
      <div>
        <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">Cédula de votação</div>
          <div className="mt-1 text-base font-black">Eleição de Demonstração</div>
          <div className="mt-1 text-[10px] text-[var(--muted)]">Escolha sua opção de voto com atenção.</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["01", "Opção A", true],
            ["02", "Opção B", false],
          ].map(([numero, nome, selected]) => (
            <div
              className={`rounded-2xl border p-3 ${selected ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}
              key={String(numero)}
            >
              <div className="text-[9px] font-black uppercase text-[var(--brand)]">Chapa {numero}</div>
              <div className="mt-1 text-sm font-black">{nome}</div>
              <div className="mt-2 flex justify-end">
                <span className={`grid size-5 place-items-center rounded-full border text-[9px] ${selected ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-contrast)]" : "border-[var(--line)]"}`}>
                  {selected ? "✓" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-3 text-[10px] font-black">Voto em Branco</div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-3 text-[10px] font-black">Voto Nulo</div>
        </div>

        <div className="mt-4 flex justify-end">
          <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)]`}>
            Continuar
            <Icon name="arrow-right" className="ml-1.5 size-3.5" />
          </span>
        </div>
      </div>
    </Janela>
  );
}

function RevisaoMockup({ destacarConfirmacao = false }: { destacarConfirmacao?: boolean }) {
  return (
    <Janela
      ariaLabel={
        destacarConfirmacao
          ? "Tela de confirmação final do voto destacando o botão Confirmar voto e o aviso de que o voto não poderá ser alterado."
          : "Tela de revisão do voto com a opção selecionada e botão Voltar e revisar."
      }
    >
      <div className="mx-auto max-w-sm">
        <div className="text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">Etapa final</div>
          <div className="mt-1 text-base font-black">Confirme seu voto</div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-4 text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--brand)]">Opção selecionada</div>
          <div className="mt-2 text-lg font-black">Chapa 01</div>
          <div className="mt-1 text-[11px] font-bold text-[var(--brand-strong)]">Opção A</div>
        </div>

        <div className={`mt-4 rounded-2xl border px-3 py-3 text-[10px] leading-5 ${destacarConfirmacao ? "border-amber-300 bg-amber-50 text-amber-900" : "border-[var(--line)] bg-[var(--surface-muted)] text-[var(--muted)]"}`}>
          <strong>Revise antes de confirmar.</strong><br />
          Depois do registro, não será possível alterar ou substituir este voto.
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <span className={`${buttonBase} border border-[var(--line)] bg-white text-[var(--foreground)] ${destacarConfirmacao ? "opacity-70" : ""}`}>
            Voltar e revisar
          </span>
          <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)] ${destacarConfirmacao ? "ring-4 ring-[var(--brand)]/15" : ""}`}>
            <Icon name="check" className="mr-1.5 size-3.5" />
            Confirmar voto
          </span>
        </div>
      </div>
    </Janela>
  );
}

function ComprovanteMockup() {
  return (
    <Janela ariaLabel="Tela de comprovante de votação com código fictício e ações Copiar comprovante, Compartilhar comprovante e Validar comprovante.">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <span className="mx-auto grid size-10 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            <Icon name="check" className="size-5" />
          </span>
          <div className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700">Votação concluída</div>
          <div className="mt-1 text-base font-black">Voto registrado com sucesso</div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <div className="text-[9px] font-black uppercase text-[var(--muted)]">Código do comprovante</div>
          <div className="mt-2 break-all font-mono text-xs font-black tracking-[0.04em]">DEMO-7F3A-123456</div>
        </div>

        <div className="mt-3 rounded-xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] p-3 text-[10px] leading-5 text-[var(--brand-strong)]">
          O comprovante confirma o registro da participação e não revela a opção escolhida.
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <span className={`${buttonBase} border border-[var(--line)] bg-white text-[var(--foreground)]`}>
            <Icon name="copy" className="mr-1.5 size-3.5" />
            Copiar comprovante
          </span>
          <span className={`${buttonBase} bg-[var(--brand)] text-[var(--brand-contrast)]`}>
            <Icon name="share" className="mr-1.5 size-3.5" />
            Compartilhar comprovante
          </span>
        </div>
        <div className="mt-2">
          <span className={`${buttonBase} w-full bg-[var(--brand)] text-[var(--brand-contrast)]`}>
            <Icon name="search" className="mr-1.5 size-3.5" />
            Validar comprovante
          </span>
        </div>
      </div>
    </Janela>
  );
}

export function ComoUsarMockup({ tipo }: Props) {
  switch (tipo) {
    case "acesso":
      return <AcessoMockup />;
    case "login":
      return <LoginMockup />;
    case "whatsapp":
      return <WhatsAppMockup />;
    case "codigo":
      return <CodigoMockup />;
    case "cedula":
      return <CedulaMockup />;
    case "revisao":
      return <RevisaoMockup />;
    case "confirmacao":
      return <RevisaoMockup destacarConfirmacao />;
    case "comprovante":
      return <ComprovanteMockup />;
  }
}
