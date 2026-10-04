import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { ButtonLink } from "@/components/ui/button-link";
import { buscarResultadoPublicoEleicao } from "@/services/eleicao/eleicao.service";
import type { EleicaoResultadoPublicoDados } from "@/types/eleicao";

type Props = { params: Promise<{ slug: string }> };

function ResumoCard({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center sm:p-5">
      <div className="text-2xl font-black tracking-tight sm:text-3xl">{valor}</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{label}</div>
    </div>
  );
}

export default async function ResultadoPublicoPage({ params }: Props) {
  const { slug } = await params;
  let response;

  try {
    response = await buscarResultadoPublicoEleicao(slug);
  } catch {
    return (
      <EleicaoLayout>
        <EleicaoMensagem titulo="Não foi possível carregar o resultado" mensagem="Ocorreu uma falha de comunicação. Tente novamente em alguns instantes." acaoHref={`/${slug}`} acaoTexto="Voltar para eleição" />
      </EleicaoLayout>
    );
  }

  if (response.erro || !response.dados) {
    return (
      <EleicaoLayout>
        <EleicaoMensagem
          titulo="Resultado ainda não disponível"
          mensagem={response.mensagem || "O resultado desta eleição ainda não foi publicado."}
          acaoHref={`/${slug}`}
          acaoTexto="Voltar para eleição"
        />
      </EleicaoLayout>
    );
  }

  const dados: EleicaoResultadoPublicoDados = response.dados;
  const maxVotos = Math.max(...dados.chapas.map((c) => c.quantidade_votos), 1);
  const possuiVotosPorChapa = dados.chapas.length > 0 && dados.chapas.some((c) => c.quantidade_votos > 0);

  return (
    <EleicaoLayout>
      <div className="space-y-7">
        <header className="border-b border-[var(--line)] pb-5">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Resultado oficial publicado</span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Resultado da eleição</h1>
          <p className="mt-1 text-base font-semibold text-[var(--foreground)]">{dados.eleicao.nome}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Situação: {dados.eleicao.situacao}</p>
        </header>

        <section aria-label="Resumo do resultado" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ResumoCard valor={dados.resumo.total_votos} label="Total de votos" />
          <ResumoCard valor={dados.resumo.votos_validos} label="Votos válidos" />
          <ResumoCard valor={dados.resumo.votos_brancos} label="Votos em branco" />
          <ResumoCard valor={dados.resumo.votos_nulos} label="Votos nulos" />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-black tracking-tight sm:text-xl">Resultado por chapa</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Distribuição dos votos válidos entre as chapas participantes.</p>
          </div>

          {!possuiVotosPorChapa ? (
            <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--muted)]">Não há votos válidos por chapa para exibir.</div>
          ) : (
            <div className="space-y-3">
              {dados.chapas.map((chapa) => {
                const largura = Math.round((chapa.quantidade_votos / maxVotos) * 100);
                const maisVotada = chapa.quantidade_votos > 0 && chapa.quantidade_votos === maxVotos;
                return (
                  <article key={chapa.id} className={`rounded-2xl border p-4 sm:p-5 ${maisVotada ? "border-[var(--brand)]/30 bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Chapa {String(chapa.numero).padStart(2, "0")}</div>
                        <div className="mt-1 text-base font-black">{chapa.nome}</div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-black">{chapa.quantidade_votos} votos</div>
                        <div className="text-sm font-semibold text-[var(--muted)]">{String(chapa.percentual)}%</div>
                      </div>
                    </div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div style={{ width: `${largura}%` }} className="h-full rounded-full bg-[var(--brand)]" />
                    </div>
                    {maisVotada ? <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-strong)]">Mais votada</div> : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="border-t border-[var(--line)] pt-5">
          <ButtonLink className="w-full sm:w-auto" href={`/${slug}`}>Voltar para eleição</ButtonLink>
        </div>
      </div>
    </EleicaoLayout>
  );
}
