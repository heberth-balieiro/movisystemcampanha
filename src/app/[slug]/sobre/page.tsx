import type { Metadata } from "next";

import { DocumentoDestaque, DocumentoLista, DocumentoSecao, InstitucionalDocumento } from "@/components/eleicao/InstitucionalDocumento";

export const metadata: Metadata = {
  title: "Sobre a plataforma | Sistema de Votação Digital",
  description: "Conheça os princípios e recursos do Sistema de Votação Digital da Cone Sul Sistemas.",
};

type Props = { params: Promise<{ slug: string }> };

export default async function SobrePlataformaPage({ params }: Props) {
  const { slug } = await params;

  return (
    <InstitucionalDocumento
      slug={slug}
      eyebrow="Institucional"
      titulo="Sobre a plataforma"
      introducao="O Sistema de Votação Digital da Cone Sul Sistemas oferece uma experiência web responsiva para identificação do eleitor, votação, comprovante, auditoria administrativa, apuração e publicação de resultados."
    >
      <DocumentoSecao titulo="Finalidade da plataforma">
        <p>A plataforma apoia processos eleitorais de entidades e associações, respeitando as regras, o calendário, os eleitores habilitados e as demais definições fornecidas pela entidade responsável pela eleição.</p>
        <p>O sistema foi desenvolvido para funcionar em computadores, tablets e celulares, sem alterar as regras institucionais ou estatutárias definidas pela entidade.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="Como funciona">
        <DocumentoLista>
          <li>Identificação do eleitor conforme os dados habilitados para a eleição.</li>
          <li>Confirmação de identidade e liberação segura da sessão de votação.</li>
          <li>Apresentação das chapas e opções de voto disponibilizadas pela eleição.</li>
          <li>Registro do voto com separação entre a identificação de participação e o conteúdo do voto.</li>
          <li>Emissão de comprovante para validação do registro, sem revelar a escolha realizada.</li>
          <li>Painel administrativo com participação, auditoria, apuração e publicação do resultado conforme o estágio da eleição.</li>
        </DocumentoLista>
      </DocumentoSecao>

      <DocumentoSecao titulo="Sigilo e rastreabilidade operacional">
        <p>O fluxo eleitoral foi estruturado para não apresentar ao usuário administrativo uma associação direta entre a identidade do eleitor e a opção escolhida na votação.</p>
        <p>A auditoria registra eventos operacionais relevantes, como acessos, confirmações e ações administrativas, sem utilizar o evento de registro do voto para identificar a escolha do eleitor.</p>
      </DocumentoSecao>

      <DocumentoDestaque>
        <strong>Responsabilidade institucional.</strong> A entidade responsável pela eleição define quem pode votar, período, chapas, regras eleitorais, critérios de apuração e publicação. A plataforma executa o fluxo tecnológico conforme essas definições.
      </DocumentoDestaque>
    </InstitucionalDocumento>
  );
}
