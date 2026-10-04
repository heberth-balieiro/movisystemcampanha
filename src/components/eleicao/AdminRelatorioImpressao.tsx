"use client";

import type {
  EleicaoAdminPainelEleicao,
  EleicaoAdminPainelEvolucaoItem,
  EleicaoAdminPainelResumo,
  EleicaoAdminResultadoDados,
  EleicaoAuditoriaItem,
} from "@/types/eleicao";

export type RelatorioImpressaoTipo = "participacao" | "evolucao" | "resultado" | "auditoria" | "ata";

export type AuditoriaRelatorioFiltros = {
  tipoEvento?: string;
  origem?: string;
  sucesso?: string;
  dataInicial?: string;
  dataFinal?: string;
};

type AdminRelatorioImpressaoProps = {
  tipo: RelatorioImpressaoTipo | null;
  nomeEntidade?: string | null;
  eleicao: EleicaoAdminPainelEleicao;
  resumo: EleicaoAdminPainelResumo;
  evolucao: EleicaoAdminPainelEvolucaoItem[];
  resultado: EleicaoAdminResultadoDados | null;
  auditoria: EleicaoAuditoriaItem[];
  auditoriaFiltros?: AuditoriaRelatorioFiltros;
  geradoEm: Date | null;
};

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(value?: string) {
  if (!value) return "Todos";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function mapEventoLabel(tipo?: string) {
  if (!tipo) return "Todos";
  const map: Record<string, string> = {
    LOGIN_SUCESSO: "Login realizado",
    LOGIN_FALHA: "Falha no login",
    CODIGO_ENVIADO: "Código enviado",
    CODIGO_VALIDADO: "Código validado",
    CODIGO_INVALIDO: "Código inválido",
    VOTO_REGISTRADO: "Voto registrado",
    ELEICAO_ENCERRADA: "Eleição encerrada",
    APURACAO_INICIADA: "Apuração iniciada",
    APURACAO_FINALIZADA: "Apuração finalizada",
    RESULTADO_PUBLICADO: "Resultado publicado",
  };
  return map[tipo] || tipo;
}

function mapOrigemLabel(origem?: string) {
  if (!origem) return "Todas";
  if (origem === "ELEITOR") return "Eleitor";
  if (origem === "ADMIN") return "Admin";
  if (origem === "SISTEMA") return "Sistema";
  return origem;
}

function mapSucessoLabel(sucesso?: string) {
  if (!sucesso) return "Todos";
  return sucesso === "S" ? "Sucesso" : sucesso === "N" ? "Falha" : sucesso;
}

function PrintHeader({ titulo, nomeEntidade, eleicao, geradoEm }: {
  titulo: string;
  nomeEntidade?: string | null;
  eleicao: EleicaoAdminPainelEleicao;
  geradoEm: Date | null;
}) {
  return (
    <header className="print-report-header">
      <div>
        <div className="print-report-kicker">Sistema de Votação Digital</div>
        <h1>{titulo}</h1>
        {nomeEntidade ? <div className="print-report-entity">{nomeEntidade}</div> : null}
      </div>
      <div className="print-report-meta">
        <div><strong>Eleição:</strong> {eleicao.nome}</div>
        <div><strong>Situação:</strong> {eleicao.situacao}</div>
        <div><strong>Período:</strong> {formatDateTime(eleicao.data_hora_inicio)} até {formatDateTime(eleicao.data_hora_fim)}</div>
        <div><strong>Gerado em:</strong> {geradoEm ? geradoEm.toLocaleString("pt-BR") : "-"}</div>
      </div>
    </header>
  );
}

function PrintFooter() {
  return (
    <footer className="print-report-footer">
      Documento gerado pelo Sistema de Votação Digital • Cone Sul Sistemas
    </footer>
  );
}

export function AdminRelatorioImpressao({ tipo, nomeEntidade, eleicao, resumo, evolucao, resultado, auditoria, auditoriaFiltros, geradoEm }: AdminRelatorioImpressaoProps) {
  if (!tipo) return null;

  if (tipo === "participacao") {
    return (
      <div className="print-report-root">
        <article className="print-report-sheet">
          <PrintHeader titulo="Relatório de Participação" nomeEntidade={nomeEntidade} eleicao={eleicao} geradoEm={geradoEm} />

          <section className="print-report-section">
            <h2>Resumo da participação</h2>
            <div className="print-report-summary-grid">
              <div><span>Eleitores aptos</span><strong>{resumo.total_eleitores}</strong></div>
              <div><span>Participaram</span><strong>{resumo.total_votantes}</strong></div>
              <div><span>Não participaram</span><strong>{resumo.total_nao_votantes}</strong></div>
              <div><span>Participação</span><strong>{resumo.percentual_participacao}%</strong></div>
            </div>
          </section>

          <section className="print-report-section">
            <h2>Informações da eleição</h2>
            <table className="print-report-table print-report-table-compact">
              <tbody>
                <tr><th>Eleição</th><td>{eleicao.nome}</td></tr>
                <tr><th>Situação</th><td>{eleicao.situacao}</td></tr>
                <tr><th>Início</th><td>{formatDateTime(eleicao.data_hora_inicio)}</td></tr>
                <tr><th>Fim</th><td>{formatDateTime(eleicao.data_hora_fim)}</td></tr>
              </tbody>
            </table>
          </section>

          <PrintFooter />
        </article>
      </div>
    );
  }

  if (tipo === "evolucao") {
    return (
      <div className="print-report-root">
        <article className="print-report-sheet">
          <PrintHeader titulo="Relatório de Evolução da Participação" nomeEntidade={nomeEntidade} eleicao={eleicao} geradoEm={geradoEm} />

          <section className="print-report-section">
            <h2>Evolução por faixa de horário</h2>
            {evolucao.length === 0 ? (
              <p className="print-report-empty">Não há dados de evolução para esta eleição.</p>
            ) : (
              <table className="print-report-table">
                <thead><tr><th>Horário</th><th className="numeric">Quantidade</th><th className="numeric">Acumulado</th></tr></thead>
                <tbody>
                  {evolucao.map((item) => (
                    <tr key={item.hora}><td>{item.hora}</td><td className="numeric">{item.quantidade}</td><td className="numeric">{item.acumulado}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="print-report-section print-report-note">
            <strong>Participação total:</strong> {resumo.total_votantes} de {resumo.total_eleitores} eleitores aptos ({resumo.percentual_participacao}%).
          </section>

          <PrintFooter />
        </article>
      </div>
    );
  }

  if (tipo === "auditoria") {
    return (
      <div className="print-report-root print-report-auditoria">
        <article className="print-report-sheet">
          <PrintHeader titulo="Relatório de Auditoria" nomeEntidade={nomeEntidade} eleicao={eleicao} geradoEm={geradoEm} />

          <section className="print-report-section">
            <h2>Filtros aplicados</h2>
            <table className="print-report-table print-report-table-compact">
              <tbody>
                <tr><th>Evento</th><td>{mapEventoLabel(auditoriaFiltros?.tipoEvento)}</td><th>Origem</th><td>{mapOrigemLabel(auditoriaFiltros?.origem)}</td></tr>
                <tr><th>Status</th><td>{mapSucessoLabel(auditoriaFiltros?.sucesso)}</td><th>Período</th><td>{formatDateOnly(auditoriaFiltros?.dataInicial)} até {formatDateOnly(auditoriaFiltros?.dataFinal)}</td></tr>
              </tbody>
            </table>
          </section>

          <section className="print-report-section print-report-section-flow">
            <div className="print-report-section-title-row">
              <h2>Eventos registrados</h2>
              <strong>{auditoria.length} registro(s)</strong>
            </div>
            {auditoria.length === 0 ? (
              <p className="print-report-empty">Nenhum evento encontrado para os filtros aplicados.</p>
            ) : (
              <table className="print-report-table print-report-table-auditoria">
                <thead>
                  <tr><th>Data/Hora</th><th>Evento</th><th>Origem</th><th>Status</th><th>Descrição</th><th>Usuário</th></tr>
                </thead>
                <tbody>
                  {auditoria.map((item) => (
                    <tr key={item.id}>
                      <td className="nowrap">{formatDateTime(item.criado_em)}</td>
                      <td><strong>{mapEventoLabel(item.tipo_evento)}</strong><div className="print-report-code">{item.tipo_evento}</div></td>
                      <td>{mapOrigemLabel(item.origem)}</td>
                      <td>{mapSucessoLabel(item.sucesso)}</td>
                      <td>{item.descricao}</td>
                      <td className="nowrap">{item.usuario_id === null ? "Não identificado" : `Usuário ${item.usuario_id}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="print-report-section print-report-note">
            O evento <strong>VOTO_REGISTRADO</strong> permanece anônimo e não deve permitir associação entre o eleitor e a escolha realizada.
          </section>

          <PrintFooter />
        </article>
      </div>
    );
  }

  if (tipo === "ata") {
    const maiorVotacaoAta = resultado ? Math.max(...resultado.chapas.map((item) => item.quantidade_votos), 0) : 0;
    const chapasMaisVotadas = resultado && maiorVotacaoAta > 0 ? resultado.chapas.filter((item) => item.quantidade_votos === maiorVotacaoAta) : [];
    const houveEmpate = chapasMaisVotadas.length > 1;

    return (
      <div className="print-report-root print-report-ata">
        <article className="print-report-sheet">
          <PrintHeader titulo="Ata de Apuração e Resultado" nomeEntidade={nomeEntidade} eleicao={eleicao} geradoEm={geradoEm} />

          {!resultado ? (
            <p className="print-report-empty">A ata somente pode ser gerada após a disponibilização do resultado da apuração.</p>
          ) : (
            <>
              <section className="print-report-section print-ata-text">
                <p>
                  Aos dados e horários registrados pelo Sistema de Votação Digital, realizou-se a apuração da eleição <strong>{eleicao.nome}</strong>{nomeEntidade ? <> da entidade <strong>{nomeEntidade}</strong></> : null}, cuja votação ocorreu no período de <strong>{formatDateTime(eleicao.data_hora_inicio)}</strong> até <strong>{formatDateTime(eleicao.data_hora_fim)}</strong>.
                </p>
                <p>
                  Consta no sistema o total de <strong>{resumo.total_eleitores}</strong> eleitor(es) apto(s), dos quais <strong>{resumo.total_votantes}</strong> participaram da votação e <strong>{resumo.total_nao_votantes}</strong> não participaram, correspondendo a <strong>{resumo.percentual_participacao}%</strong> de participação.
                </p>
                <p>
                  Na apuração foram contabilizados <strong>{resultado.resumo.total_votos}</strong> voto(s), sendo <strong>{resultado.resumo.votos_validos}</strong> voto(s) válido(s), <strong>{resultado.resumo.votos_brancos}</strong> voto(s) em branco e <strong>{resultado.resumo.votos_nulos}</strong> voto(s) nulo(s).
                </p>
              </section>

              <section className="print-report-section">
                <h2>Resultado por chapa</h2>
                <table className="print-report-table">
                  <thead><tr><th>Chapa</th><th>Nome</th><th className="numeric">Votos</th><th className="numeric">Percentual</th></tr></thead>
                  <tbody>
                    {resultado.chapas.map((chapa) => (
                      <tr key={chapa.id}>
                        <td>{String(chapa.numero).padStart(2, "0")}</td>
                        <td>{chapa.nome}</td>
                        <td className="numeric">{chapa.quantidade_votos}</td>
                        <td className="numeric">{chapa.percentual}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="print-report-section print-ata-text">
                {chapasMaisVotadas.length === 1 ? (
                  <p>
                    Após a consolidação dos votos, a <strong>Chapa {String(chapasMaisVotadas[0].numero).padStart(2, "0")} - {chapasMaisVotadas[0].nome}</strong> foi identificada como a mais votada, com <strong>{chapasMaisVotadas[0].quantidade_votos}</strong> voto(s), correspondente(s) a <strong>{chapasMaisVotadas[0].percentual}%</strong> dos votos válidos considerados no resultado por chapa.
                  </p>
                ) : houveEmpate ? (
                  <p>
                    Foi identificado <strong>empate na maior votação</strong> entre {chapasMaisVotadas.map((chapa) => `Chapa ${String(chapa.numero).padStart(2, "0")} - ${chapa.nome}`).join("; ")}, todas com <strong>{maiorVotacaoAta}</strong> voto(s). O Sistema de Votação Digital não aplica critério de desempate automaticamente; eventual definição deverá observar a deliberação da assembleia competente.
                  </p>
                ) : (
                  <p>Não houve votos válidos por chapa para indicação de chapa mais votada.</p>
                )}
                <p>
                  A presente ata foi gerada automaticamente a partir dos dados consolidados no Sistema de Votação Digital e deverá ser conferida, aprovada e assinada pelos responsáveis pela condução da eleição.
                </p>
              </section>

              <section className="print-report-section print-ata-signatures" aria-label="Assinaturas">
                <div><span>Presidente / Coordenador(a) da Assembleia</span></div>
                <div><span>Secretário(a)</span></div>
                <div><span>Comissão Eleitoral / Representante da Entidade</span></div>
              </section>
            </>
          )}

          <PrintFooter />
        </article>
      </div>
    );
  }

  const maiorVotacao = resultado ? Math.max(...resultado.chapas.map((item) => item.quantidade_votos), 0) : 0;
  const quantidadeMaisVotadas = resultado && maiorVotacao > 0 ? resultado.chapas.filter((item) => item.quantidade_votos === maiorVotacao).length : 0;

  return (
    <div className="print-report-root">
      <article className="print-report-sheet">
        <PrintHeader titulo="Relatório de Resultado da Apuração" nomeEntidade={nomeEntidade} eleicao={eleicao} geradoEm={geradoEm} />

        {!resultado ? (
          <p className="print-report-empty">Resultado não disponível para impressão.</p>
        ) : (
          <>
            <section className="print-report-section">
              <h2>Resumo da apuração</h2>
              <div className="print-report-summary-grid">
                <div><span>Total de votos</span><strong>{resultado.resumo.total_votos}</strong></div>
                <div><span>Votos válidos</span><strong>{resultado.resumo.votos_validos}</strong></div>
                <div><span>Brancos</span><strong>{resultado.resumo.votos_brancos}</strong></div>
                <div><span>Nulos</span><strong>{resultado.resumo.votos_nulos}</strong></div>
              </div>
            </section>

            <section className="print-report-section">
              <h2>Resultado por chapa</h2>
              <table className="print-report-table">
                <thead><tr><th>Chapa</th><th>Nome</th><th className="numeric">Votos</th><th className="numeric">Percentual</th><th>Observação</th></tr></thead>
                <tbody>
                  {resultado.chapas.map((chapa) => {
                    const maisVotada = maiorVotacao > 0 && chapa.quantidade_votos === maiorVotacao;
                    return (
                      <tr key={chapa.id}>
                        <td>{String(chapa.numero).padStart(2, "0")}</td>
                        <td>{chapa.nome}</td>
                        <td className="numeric">{chapa.quantidade_votos}</td>
                        <td className="numeric">{chapa.percentual}%</td>
                        <td>{maisVotada ? (quantidadeMaisVotadas > 1 ? "Mais votada — empate" : "Mais votada") : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {quantidadeMaisVotadas > 1 ? (
              <section className="print-report-section print-report-note">
                <strong>Empate:</strong> duas ou mais chapas possuem a maior quantidade de votos. O sistema não aplica critério de desempate automaticamente.
              </section>
            ) : null}
          </>
        )}

        <PrintFooter />
      </article>
    </div>
  );
}
