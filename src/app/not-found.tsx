import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="election-shell min-h-screen px-4 py-8 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-2xl border border-[var(--line)] bg-white p-6 text-center shadow-sm sm:p-9">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-sm font-black text-[var(--brand)]">404</div>
          <h1 className="mt-5 text-2xl font-black tracking-tight">Página não encontrada</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Confira o endereço informado ou utilize novamente o link oficial enviado pela entidade responsável pela votação.</p>
          <ButtonLink className="mt-6" href="/" variant="secondary">Voltar para a página inicial</ButtonLink>
        </section>
      </div>
    </main>
  );
}
