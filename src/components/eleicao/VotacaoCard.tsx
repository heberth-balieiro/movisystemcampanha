import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";
import type { EleicaoEntidade, EleicaoPublica, StatusVotacao } from "@/types/eleicao";
import { cn } from "@/utils/cn";

type VotacaoCardProps = {
  slug: string;
  eleicao: EleicaoPublica;
  entidade: EleicaoEntidade;
};

const statusClasses: Record<StatusVotacao, string> = {
  AGENDADA: "border-amber-200 bg-amber-50 text-amber-800",
  ABERTA: "border-[var(--brand)]/25 bg-[var(--brand-soft)] text-[var(--brand-strong)]",
  ENCERRADA: "border-slate-200 bg-slate-100 text-slate-700",
  EM_APURACAO: "border-blue-200 bg-blue-50 text-blue-800",
  APURADA: "border-violet-200 bg-violet-50 text-violet-800",
  PUBLICADA: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const statusLabels: Record<StatusVotacao, string> = {
  AGENDADA: "Agendada",
  ABERTA: "Votação aberta",
  ENCERRADA: "Encerrada",
  EM_APURACAO: "Em apuração",
  APURADA: "Apurada",
  PUBLICADA: "Resultado publicado",
};

const statusInfo: Record<StatusVotacao, { titulo: string; mensagem: string; className: string }> = {
  AGENDADA: {
    titulo: "Votação agendada",
    mensagem: "A votação ainda não foi iniciada. Aguarde a data e o horário programados para acessar.",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  ABERTA: {
    titulo: "Votação em andamento",
    mensagem: "A participação está liberada para os eleitores aptos.",
    className: "border-[var(--brand)]/20 bg-[var(--brand-soft)] text-[var(--brand-strong)]",
  },
  ENCERRADA: {
    titulo: "Votação encerrada",
    mensagem: "O período de votação foi finalizado.",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  EM_APURACAO: {
    titulo: "Apuração em andamento",
    mensagem: "A votação foi encerrada e os resultados estão em processo de apuração.",
    className: "border-blue-200 bg-blue-50 text-blue-900",
  },
  APURADA: {
    titulo: "Apuração concluída",
    mensagem: "A apuração foi concluída. Aguarde a publicação oficial do resultado.",
    className: "border-violet-200 bg-violet-50 text-violet-900",
  },
  PUBLICADA: {
    titulo: "Resultado publicado",
    mensagem: "A votação foi concluída e o resultado oficial está disponível para consulta.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
};

function formatarDataHora(valor?: string | null) {
  if (!valor) return null;

  const valorNormalizado = valor.replace(" ", "T");
  const [data, hora] = valorNormalizado.split("T");
  const [ano, mes, dia] = data.split("-");

  if (!ano || !mes || !dia) return valor;

  return `${dia}/${mes}/${ano}${hora ? ` às ${hora.substring(0, 5)}` : ""}`;
}

export function VotacaoCard({ slug, eleicao, entidade }: VotacaoCardProps) {
  const inicio = formatarDataHora(entidade.data_hora_inicio);
  const fim = formatarDataHora(entidade.data_hora_fim);
  const informacaoStatus = statusInfo[eleicao.situacao];
  const isAberta = eleicao.situacao === "ABERTA";
  const isPublicada = eleicao.situacao === "PUBLICADA";

  return (
    <article className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white shadow-[0_20px_50px_-36px_rgba(15,23,42,0.45)]">
      <div className="h-1.5 bg-gradient-to-r from-[var(--brand)] via-[var(--brand)] to-[var(--accent)]" />

      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand)]">
              Eleição em destaque
            </p>
            <h2 className="max-w-4xl text-2xl font-black tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              {eleicao.nome}
            </h2>
            {eleicao.descricao ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                {eleicao.descricao}
              </p>
            ) : null}
          </div>

          <span
            className={cn(
              "inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold",
              statusClasses[eleicao.situacao],
            )}
          >
            <span className="size-2 rounded-full bg-current opacity-80" />
            {statusLabels[eleicao.situacao]}
          </span>
        </div>

        {(inicio || fim) ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {inicio ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-soft)]">
                    <Icon name="calendar" />
                  </span>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]">
                    Início da votação
                  </p>
                </div>
                <p className="mt-3 text-sm font-bold text-[var(--foreground)] sm:text-base">{inicio}</p>
              </div>
            ) : null}

            {fim ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-soft)]">
                    <Icon name="clock" />
                  </span>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]">
                    Encerramento da votação
                  </p>
                </div>
                <p className="mt-3 text-sm font-bold text-[var(--foreground)] sm:text-base">{fim}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={cn("mt-5 rounded-2xl border px-4 py-4 sm:px-5", informacaoStatus.className)}>
          <p className="text-sm font-extrabold">{informacaoStatus.titulo}</p>
          <p className="mt-1.5 text-sm leading-6 opacity-90">{informacaoStatus.mensagem}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isAberta ? (
            <ButtonLink href={`/${slug}/login`} icon={<Icon name="login" />} size="lg">
              Participar da votação
            </ButtonLink>
          ) : isPublicada ? (
            <ButtonLink href={`/${slug}/resultado`} icon={<Icon name="trend" />} size="lg">
              Ver resultado
            </ButtonLink>
          ) : (
            <div
              aria-disabled="true"
              className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-400"
              title="A votação ainda não está disponível"
            >
              Participação indisponível neste momento
            </div>
          )}

          <ButtonLink
            href={`/${slug}/validar-comprovante`}
            icon={<Icon name="ticket" />}
            size="lg"
            variant="secondary"
          >
            Validar comprovante
          </ButtonLink>

          <ButtonLink
            href={`/${slug}/admin`}
            icon={<Icon name="settings" />}
            size="lg"
            variant="ghost"
          >
            Painel administrativo
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
