// import { ButtonLink } from "@/components/ui/button-link";
// import { Icon } from "@/components/ui/icon";
// import type { EleicaoPublica, StatusVotacao } from "@/types/eleicao";
// import { cn } from "@/utils/cn";

// type VotacaoCardProps = {
//   slug: string;
//   eleicao: EleicaoPublica;
//   dataHoraInicio?: string | null;
//   dataHoraFim?: string | null;
// };

// const statusClasses: Record<StatusVotacao, string> = {
//   AGENDADA: "border-amber-200 bg-amber-50 text-amber-800",
//   ABERTA: "border-[var(--brand)]/25 bg-[var(--brand-soft)] text-[var(--brand-strong)]",
//   ENCERRADA: "border-[var(--line)] bg-slate-100 text-slate-700",
//   EM_APURACAO: "border-blue-200 bg-blue-50 text-blue-800",
//   APURADA: "border-violet-200 bg-violet-50 text-violet-800",
//   PUBLICADA: "border-emerald-200 bg-emerald-50 text-emerald-800",
// };

// const statusLabels: Record<StatusVotacao, string> = {
//   AGENDADA: "Agendada",
//   ABERTA: "Votação aberta",
//   ENCERRADA: "Encerrada",
//   EM_APURACAO: "Em apuração",
//   APURADA: "Apurada",
//   PUBLICADA: "Resultado publicado",
// };

// // function formatarDataHora(valor: string | null) {
// //   if (!valor) return null;
// //   const data = new Date(valor);
// //   if (Number.isNaN(data.getTime())) return { data: valor, hora: null };

// //   const possuiHora = /[tT ]\d{2}:\d{2}/.test(valor);
// //   return {
// //     data: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(data),
// //     hora: possuiHora
// //       ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(data)
// //       : null,
// //   };
// // }

// function formatarDataHora(valor?: string | null) {
//   if (!valor) return null;

//   const valorNormalizado = valor.replace(" ", "T");
//   const [data, hora] = valorNormalizado.split("T");
//   const [ano, mes, dia] = data.split("-");

//   if (!ano || !mes || !dia)
//     return valor;

//   return `${dia}/${mes}/${ano}${hora ? ` às ${hora.substring(0, 5)}` : ""}`;
// }

// // function formatarPeriodo(eleicao: EleicaoPublica) {
// //   const inicio = formatarDataHora(eleicao.data_hora_inicio);
// //   const fim = formatarDataHora(eleicao.data_hora_fim);
// //   if (!inicio && !fim) return null;

// //   const mesmaData = inicio?.data && fim?.data && inicio.data === fim.data;
// //   if (mesmaData) {
// //     return { data: inicio.data, horario: [inicio?.hora, fim?.hora].filter(Boolean).join(" às ") || null };
// //   }

// //   return {
// //     data: [inicio?.data, fim?.data].filter(Boolean).join(" a "),
// //     horario: [inicio?.hora, fim?.hora].filter(Boolean).join(" às ") || null,
// //   };
// // }

// export function VotacaoCard({ slug, eleicao }: VotacaoCardProps) {
//   const isAberta = eleicao.situacao === "ABERTA";
//   //const periodo = formatarPeriodo(eleicao);
//   const dataHoraInicio = formatarDataHora(eleicao.data_hora_inicio);
//   const dataHoraFim = formatarDataHora(eleicao.data_hora_fim);

//   return (
//     <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
//       <div className="h-1 bg-[var(--brand)]" />
//       <div className="p-5 sm:p-6 lg:p-7">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//           <div className="min-w-0">
//             <h3 className="text-xl font-black tracking-tight sm:text-2xl">{eleicao.nome}</h3>
//             {eleicao.descricao ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">{eleicao.descricao}</p> : null}
//           </div>
//           <span className={cn("w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold", statusClasses[eleicao.situacao])}>
//             {statusLabels[eleicao.situacao]}
//           </span>
//         </div>

//         {dataHoraInicio || dataHoraFim ? (
//           <div className="mt-5 grid gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:grid-cols-2">

//             {dataHoraInicio ? (
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
//                   Início da votação
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
//                   {dataHoraInicio}
//                 </p>
//               </div>
//             ) : null}

//             {dataHoraFim ? (
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
//                   Encerramento da votação
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
//                   {dataHoraFim}
//                 </p>
//               </div>
//             ) : null}

//           </div>
//         ) : null}

//         {/* {periodo ? (
//           <div className="mt-5 grid gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:grid-cols-2">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Data da votação</p>
//               <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{periodo.data}</p>
//             </div>
//             {periodo.horario ? (
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Horário</p>
//                 <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{periodo.horario}</p>
//               </div>
//             ) : null}
//           </div>
//         ) : null} */}

//         {isAberta ? (
//           <ButtonLink className="mt-5 w-full sm:w-auto" href={`/${slug}/login`} icon={<Icon name="login" />} size="lg">
//             Acessar votação
//           </ButtonLink>
//         ) : null}
//       </div>
//     </article>
//   );
// }

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
  ENCERRADA: "border-[var(--line)] bg-slate-100 text-slate-700",
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

const statusInfo: Record<
  StatusVotacao,
  { titulo: string; mensagem: string; className: string }
> = {
  AGENDADA: {
    titulo: "Votação agendada",
    mensagem:
      "A votação ainda não foi iniciada. Aguarde a data e o horário programados para acessar.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },

  ABERTA: {
    titulo: "Votação disponível",
    mensagem:
      "A votação está aberta. Você pode acessar e registrar sua participação até o horário de encerramento.",
    className:
      "border-[var(--brand)]/25 bg-[var(--brand-soft)] text-[var(--brand-strong)]",
  },

  ENCERRADA: {
    titulo: "Votação encerrada",
    mensagem:
      "O período de votação foi encerrado. Agora o processo aguarda o início da apuração dos resultados.",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },

  EM_APURACAO: {
    titulo: "Resultados em apuração",
    mensagem:
      "Os votos estão sendo apurados. Após a conclusão, o resultado ficará disponível para a próxima etapa.",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },

  APURADA: {
    titulo: "Apuração concluída",
    mensagem:
      "A apuração foi concluída. O resultado está aguardando a publicação oficial.",
    className: "border-violet-200 bg-violet-50 text-violet-800",
  },

  PUBLICADA: {
    titulo: "Resultado publicado",
    mensagem:
      "O processo foi concluído e o resultado oficial já está disponível para consulta.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
};

function formatarDataHora(valor?: string | null) {
  if (!valor) return null;

  const valorNormalizado = valor.replace(" ", "T");
  const [data, hora] = valorNormalizado.split("T");
  const [ano, mes, dia] = data.split("-");

  if (!ano || !mes || !dia)
    return valor;

  return `${dia}/${mes}/${ano}${hora ? ` às ${hora.substring(0, 5)}` : ""}`;
}

export function VotacaoCard({
  slug,
  eleicao,
  entidade,
}: VotacaoCardProps) {

  const isAberta = eleicao.situacao === "ABERTA";
  const informacaoStatus = statusInfo[eleicao.situacao];

  const inicio = formatarDataHora(entidade.data_hora_inicio);
  const fim = formatarDataHora(entidade.data_hora_fim);

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="h-1 bg-[var(--brand)]" />

      <div className="p-5 sm:p-6 lg:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">

            <h3 className="text-xl font-black tracking-tight sm:text-2xl">
              {eleicao.nome}
            </h3>

            {eleicao.descricao ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                {eleicao.descricao}
              </p>
            ) : null}

          </div>

          <span
            className={cn(
              "w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold",
              statusClasses[eleicao.situacao]
            )}
          >
            {statusLabels[eleicao.situacao]}
          </span>
        </div>

        {(inicio || fim) ? (
          <div className="mt-5 grid gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 sm:grid-cols-2">

            {inicio ? (
              <div>
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <Icon name="calendar" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Início da votação
                  </p>
                </div>

                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {inicio}
                </p>
              </div>
            ) : null}

            {fim ? (
              <div>
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <Icon name="clock" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    Encerramento da votação
                  </p>
                </div>

                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {fim}
                </p>
              </div>
            ) : null}

          </div>
        ) : null}

        {informacaoStatus ? (
          <div
            className={cn(
              "mt-4 rounded-xl border px-4 py-3",
              informacaoStatus.className
            )}
          >
            <p className="text-sm font-bold">
              {informacaoStatus.titulo}
            </p>

            <p className="mt-1 text-sm leading-5 opacity-90">
              {informacaoStatus.mensagem}
            </p>
          </div>
        ) : null}

        {isAberta ? (
          <ButtonLink
            className="mt-5 w-full sm:w-auto"
            href={`/${slug}/login`}
            icon={<Icon name="login" />}
            size="lg"
          >
            Acessar votação
          </ButtonLink>
        ) : null}

      </div>
    </article>
  );
}