import Image from "next/image";

// export default function HomePage() {
//   return (
//     <main className="election-shell min-h-screen px-4 py-8 text-[var(--foreground)]">
//       <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col items-center justify-center">
//         <div className="w-full rounded-2xl border border-[var(--line)] bg-white/95 p-6 text-center shadow-[0_24px_70px_-42px_rgba(15,23,42,0.42)] sm:p-10">
//           <div className="mx-auto grid size-16 place-items-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
//           <Image src="/icon-96x96.png" alt="Cone Sul Sistemas" width={64} height={64} className="h-full w-full object-contain p-1" priority />
//         </div>
//           <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Sistema de Votação Digital</p>
//           <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Acesso à votação</h1>
//           <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">Utilize o endereço fornecido pela entidade responsável pela eleição para acessar o ambiente de votação.</p>
//           <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
//             Formato do endereço: <strong className="text-[var(--foreground)]">votacao.conesulsistemas.com.br/slug</strong>
//           </div>
//           <div className="mt-6 text-xs text-[var(--muted)]">
//             Tecnologia desenvolvida pela{" "}
//             <a
//               href="https://wa.me/5569992161179"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="font-semibold text-[var(--brand)] hover:underline"
//             >
//               Cone Sul Sistemas
//             </a>.
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

export default function HomePage() {
  return (
    <main className="election-shell min-h-screen px-4 py-8 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col items-center justify-center">
        <div className="w-full rounded-2xl border border-[var(--line)] bg-white/95 p-6 text-center shadow-[0_24px_70px_-42px_rgba(15,23,42,0.42)] sm:p-10">
          
          <div className="mx-auto grid size-16 place-items-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
            <Image
              src="/icon-96x96.png"
              alt="Cone Sul Sistemas"
              width={84}
              height={84}
              className="h-full w-full object-contain p-1"
              priority
            />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
            Plataforma Digital
          </p>

          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            Ambiente não localizado
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Não foi possível identificar a eleição ou assembleia que você deseja acessar.
            Verifique se o endereço informado está correto ou utilize o link fornecido pela
            entidade responsável.
          </p>

          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-4 text-left">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Como acessar
            </p>

            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Cada eleição ou assembleia possui um endereço exclusivo de acesso.
            </p>

            <div className="mt-3 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-center text-sm">
              <span className="text-[var(--muted)]">Exemplo: </span>
              <strong className="break-all text-[var(--foreground)]">
                votacao.conesulsistemas.com.br/sua-entidade
              </strong>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-lg text-xs leading-5 text-[var(--muted)]">
            Caso tenha recebido um link por WhatsApp, e-mail ou outro canal da entidade,
            utilize esse endereço para acessar o ambiente correto.
          </p>

          <div className="mt-8 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)]">
            Tecnologia desenvolvida pela{" "}
            <a
              href="https://wa.me/5569992161179"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--brand)] transition hover:underline"
            >
              Cone Sul Sistemas
            </a>.
          </div>

        </div>
      </div>
    </main>
  );
}