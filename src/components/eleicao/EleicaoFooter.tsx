"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type EleicaoFooterProps = {
  email?: string | null;
  telefone?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
};

function hasValue(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function getTelefoneHref(telefone: string) {
  const digits = telefone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : undefined;
}

function getExternalHttpUrl(value?: string | null) {
  if (!hasValue(value)) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function EleicaoFooter({ email, telefone, instagramUrl, facebookUrl, youtubeUrl }: EleicaoFooterProps) {
  const params = useParams<{ slug?: string | string[] }>();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const baseHref = slug ? `/${slug}` : "";
  const anoAtual = new Date().getFullYear();
  const redesSociais = [
    { label: "Instagram", href: getExternalHttpUrl(instagramUrl) },
    { label: "Facebook", href: getExternalHttpUrl(facebookUrl) },
    { label: "YouTube", href: getExternalHttpUrl(youtubeUrl) },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  const possuiContato = hasValue(email) || hasValue(telefone);
  const telefoneHref = hasValue(telefone) ? getTelefoneHref(telefone) : undefined;

  return (
    <footer className="mt-6 rounded-2xl border border-[var(--line)] bg-white/75 p-5 text-sm text-[var(--muted)] shadow-sm backdrop-blur sm:mt-8 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Sistema de Votação</h2>
          <p className="mt-3 max-w-xs leading-6">Tecnologia desenvolvida pela Cone Sul Sistemas.</p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">Contato</h2>
          {possuiContato ? (
            <div className="mt-3 space-y-2">
              {hasValue(email) ? (
                <a className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : null}
              {hasValue(telefone) ? (
                telefoneHref ? (
                  <a className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]" href={telefoneHref}>
                    {telefone}
                  </a>
                ) : (
                  <span className="block font-semibold text-[var(--foreground)]">{telefone}</span>
                )
              ) : null}
            </div>
          ) : (
            <p className="mt-3 max-w-xs leading-6">Entre em contato com a entidade responsável pela eleição.</p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">Institucional</h2>
          <nav aria-label="Links institucionais" className="mt-3 space-y-2">
            <Link className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]" href={`${baseHref}/sobre`}>Sobre a plataforma</Link>
            <Link className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]" href={`${baseHref}/termos`}>Termos de Uso</Link>
            <Link className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]" href={`${baseHref}/privacidade`}>Privacidade e Proteção de Dados</Link>
          </nav>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">Redes sociais</h2>
          {redesSociais.length > 0 ? (
            <div className="mt-3 space-y-2">
              {redesSociais.map((item) => (
                <a
                  className="focus-ring block rounded font-semibold text-[var(--foreground)] transition hover:text-[var(--brand)]"
                  href={item.href}
                  key={item.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-3 max-w-xs leading-6">Canais oficiais serão exibidos quando informados pela entidade.</p>
          )}
        </section>
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-4 text-center text-xs font-semibold">
        <a
          className="focus-ring rounded transition hover:text-[var(--brand)]"
          href="https://movisystem.com.br"
          rel="noopener noreferrer"
          target="_blank"
        >
          {anoAtual} MoviSystem tecnologia
        </a>
        <span className="mx-2 text-[var(--line)]">|</span>
        Sistema de Votação Digital
      </div>
    </footer>
  );
}
