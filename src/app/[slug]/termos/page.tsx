import type { Metadata } from "next";

import { DocumentoDestaque, DocumentoLista, DocumentoSecao, InstitucionalDocumento } from "@/components/eleicao/InstitucionalDocumento";

export const metadata: Metadata = {
  title: "Termos de Uso | Sistema de Votação Digital",
  description: "Termos de uso aplicáveis ao acesso e utilização do Sistema de Votação Digital.",
};

type Props = { params: Promise<{ slug: string }> };

export default async function TermosUsoPage({ params }: Props) {
  const { slug } = await params;

  return (
    <InstitucionalDocumento
      slug={slug}
      eyebrow="Uso da plataforma"
      titulo="Termos de Uso"
      introducao="Estes termos apresentam as condições gerais para utilização do Sistema de Votação Digital. As regras específicas da eleição, estatuto, edital, assembleia ou regulamento da entidade permanecem soberanas sobre o processo eleitoral."
    >
      <DocumentoSecao titulo="1. Aceitação e finalidade">
        <p>Ao utilizar a plataforma, o usuário declara estar acessando o sistema para participar, administrar ou consultar uma eleição disponibilizada pela entidade responsável.</p>
        <p>O sistema não substitui o estatuto, edital, regulamento ou deliberações formais da entidade. Em caso de divergência, devem prevalecer as regras oficialmente aprovadas para a eleição.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="2. Identificação e acesso">
        <DocumentoLista>
          <li>O usuário deve informar dados verdadeiros e utilizar somente sua própria identificação.</li>
          <li>Códigos de confirmação, tokens e demais meios de acesso são pessoais e não devem ser compartilhados.</li>
          <li>A habilitação para votar é determinada pelos dados e regras fornecidos pela entidade responsável pela eleição.</li>
          <li>O sistema poderá encerrar ou recusar uma sessão quando o período de votação tiver terminado, a credencial tiver expirado ou a operação não estiver autorizada.</li>
        </DocumentoLista>
      </DocumentoSecao>

      <DocumentoSecao titulo="3. Registro do voto">
        <p>Depois da confirmação do voto e do retorno de sucesso da plataforma, a operação é considerada registrada no sistema. O comprovante confirma a existência do registro, mas não informa a opção escolhida.</p>
        <p>O eleitor deve conferir as informações exibidas antes da confirmação final. Após o registro, a plataforma não oferece alteração da escolha pelo próprio usuário.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="4. Uso adequado">
        <DocumentoLista>
          <li>Não tentar acessar contas, sessões ou áreas administrativas de terceiros.</li>
          <li>Não tentar interferir, automatizar indevidamente, sobrecarregar ou contornar mecanismos de segurança da plataforma.</li>
          <li>Não compartilhar códigos de confirmação ou credenciais administrativas.</li>
          <li>Utilizar equipamento, navegador e conexão adequados durante o processo eleitoral.</li>
        </DocumentoLista>
      </DocumentoSecao>

      <DocumentoSecao titulo="5. Disponibilidade e comunicação">
        <p>A plataforma utiliza serviços de rede e integrações externas. Em caso de indisponibilidade temporária, o usuário deve seguir as orientações e canais oficiais divulgados pela entidade responsável pela eleição.</p>
        <p>Questões sobre elegibilidade, chapas, calendário, regras, empate, impugnações ou decisões eleitorais devem ser direcionadas à própria entidade.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="6. Resultados e decisões eleitorais">
        <p>A plataforma apresenta os dados de apuração conforme o estágio autorizado da eleição. Resultado público somente deve ser considerado disponível quando oficialmente publicado no sistema.</p>
        <p>Critérios de desempate ou decisões extraordinárias não são presumidos pela plataforma e dependem das regras formalmente definidas pela entidade.</p>
      </DocumentoSecao>

      <DocumentoDestaque>
        Estes termos são um padrão operacional da plataforma e podem ser complementados pela entidade responsável para refletir seu estatuto, edital, regulamento e demais regras específicas da eleição.
      </DocumentoDestaque>
    </InstitucionalDocumento>
  );
}
