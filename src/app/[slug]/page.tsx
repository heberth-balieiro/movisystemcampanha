import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { VotacaoCard } from "@/components/eleicao/VotacaoCard";
import { Icon } from "@/components/ui/icon";
import { buscarEleicaoPorSlug, EleicaoPublicaNaoEncontradaError } from "@/services/eleicao/eleicao.service";
import type { EleicaoPaginaEstado, EleicaoPublicaDados } from "@/types/eleicao";
import { imagemBase64 } from "@/lib/image";

type SlugPageProps = { params: Promise<{ slug: string }> };

function EleicaoConteudo({
  slug,
  estado,
  dados,
}: {
  slug: string;
  estado: EleicaoPaginaEstado;
  dados: EleicaoPublicaDados | null;
}) {
  if (estado === "carregando") return <EleicaoLoading />;

  if (estado === "erro-comunicacao") {
    return (
      <EleicaoMensagem
        titulo="Não foi possível carregar a votação"
        mensagem="O serviço de votação está temporariamente indisponível ou não foi possível estabelecer conexão. Tente novamente em alguns instantes."
        acaoHref={`/${slug}`}
        acaoTexto="Tentar novamente"
      />
    );
  }

  if (estado === "slug-nao-encontrado" || !dados) {
    return (
      <EleicaoMensagem
        titulo="Votação não localizada"
        mensagem="Não foi possível localizar uma votação por este endereço. Confira o link recebido ou entre em contato com a entidade responsável pela eleição."
        acaoHref="/"
        acaoTexto="Voltar para página inicial"
      />
    );
  }

  const { entidade, eleicao } = dados;
  const bannerSrc = imagemBase64(entidade.banner);

  return (
    <div className="space-y-7">
      {entidade.mensagem_boas_vindas ? (
        <section className="relative overflow-hidden rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)] px-5 py-4 text-center sm:px-7 sm:py-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[var(--brand)]" />
          <p className="mx-auto max-w-3xl text-sm font-semibold leading-6 text-[var(--brand-strong)] sm:text-base">
            {entidade.mensagem_boas_vindas}
          </p>
        </section>
      ) : null}

      {bannerSrc ? (
        <section className="group relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-white shadow-[0_20px_50px_-38px_rgba(15,23,42,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent opacity-60" />
          <img
            src={bannerSrc}
            alt={`Banner ${entidade.nome_exibicao}`}
            className="max-h-[300px] w-full object-cover transition duration-500 group-hover:scale-[1.01]"
          />
        </section>
      ) : null}

      <VotacaoCard slug={slug} eleicao={eleicao} entidade={entidade} />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.4)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon name="check" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">
                Jornada do eleitor
              </p>
              <h3 className="mt-1 text-lg font-black tracking-tight">Como funciona</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["01", "Identifique-se", "Informe os dados solicitados para localizar seu cadastro."],
              ["02", "Valide o acesso", "Confirme sua identidade antes de entrar na votação."],
              ["03", "Registre seu voto", "Faça sua escolha durante o período em que a votação estiver aberta."],
              ["04", "Guarde o comprovante", "Use o código gerado para consultar a validade do registro."],
            ].map(([numero, titulo, texto]) => (
              <div key={numero} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                <span className="text-xs font-black text-[var(--brand)]">{numero}</span>
                <p className="mt-1 text-sm font-extrabold text-[var(--foreground)]">{titulo}</p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.4)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon name="users" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand)]">
                Confiança
              </p>
              <h3 className="mt-1 text-lg font-black tracking-tight">Participação com clareza</h3>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              "Ambiente digital dedicado à eleição da entidade.",
              "Etapas de acesso e participação apresentadas de forma objetiva.",
              "Registro de participação e comprovante para consulta.",
              "Informações institucionais e período da eleição sempre visíveis.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon name="check" className="size-3.5" />
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function EleicaoSlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  let estado: EleicaoPaginaEstado = "sucesso";
  let dados: EleicaoPublicaDados | null = null;

  try {
    dados = await buscarEleicaoPorSlug(slug);
  } catch (error) {
    estado = error instanceof EleicaoPublicaNaoEncontradaError ? "slug-nao-encontrado" : "erro-comunicacao";
  }

  return (
    <EleicaoLayout
      nomeEntidade={dados?.entidade.nome_exibicao}
      subtitulo={dados ? "Ambiente seguro para participação em votações digitais." : undefined}
      corPrimaria={dados?.entidade.cor_primaria}
      corSecundaria={dados?.entidade.cor_secundaria}
      email={dados?.entidade.email}
      telefone={dados?.entidade.telefone}
      instagramUrl={dados?.entidade.url_instagram}
      facebookUrl={dados?.entidade.url_facebook}
      youtubeUrl={dados?.entidade.url_youtube}
    >
      <EleicaoConteudo slug={slug} estado={estado} dados={dados} />
    </EleicaoLayout>
  );
}
