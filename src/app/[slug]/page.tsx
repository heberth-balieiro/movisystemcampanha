import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoLoading } from "@/components/eleicao/EleicaoLoading";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { VotacaoCard } from "@/components/eleicao/VotacaoCard";
import { ButtonLink } from "@/components/ui/button-link";
import { buscarEleicaoPorSlug, EleicaoPublicaNaoEncontradaError } from "@/services/eleicao/eleicao.service";
import type { EleicaoPaginaEstado, EleicaoPublicaDados } from "@/types/eleicao";
import { imagemBase64 } from "@/lib/image";

type SlugPageProps = { params: Promise<{ slug: string }> };

function EleicaoConteudo({ slug, estado, dados }: { slug: string; estado: EleicaoPaginaEstado; dados: EleicaoPublicaDados | null }) {
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
    <div className="space-y-6">
      {entidade.mensagem_boas_vindas ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-center sm:px-6">
          <p className="mx-auto max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">{entidade.mensagem_boas_vindas}</p>
        </div>
      ) : null}

      {bannerSrc ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
          <img
            src={bannerSrc}
            alt={`Banner ${entidade.nome_exibicao}`}
            className="max-h-[280px] w-full object-cover"
          />
        </div>
      ) : null}  

      {eleicao.situacao === "PUBLICADA" ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
          <div className="h-1 bg-[var(--brand)]" />
          <div className="p-5 text-center sm:p-7">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Resultado publicado</span>
            <h2 className="mt-3 text-xl font-black sm:text-2xl">{eleicao.nome}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">A votação foi concluída e o resultado oficial está disponível para consulta.</p>
            <ButtonLink className="mt-5" href={`/${slug}/resultado`}>Ver resultado</ButtonLink>
          </div>
        </section>
      ) : (
        <VotacaoCard slug={slug} eleicao={eleicao} entidade={entidade}  />
      )}

      <div className="flex justify-center">
        <ButtonLink href={`/${slug}/validar-comprovante`} size="sm" variant="ghost">Validar comprovante de votação</ButtonLink>
      </div>
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
