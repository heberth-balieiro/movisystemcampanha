import type { Metadata } from "next";

import { DocumentoDestaque, DocumentoLista, DocumentoSecao, InstitucionalDocumento } from "@/components/eleicao/InstitucionalDocumento";

export const metadata: Metadata = {
  title: "Privacidade e Proteção de Dados | Sistema de Votação Digital",
  description: "Informações sobre privacidade e proteção de dados no Sistema de Votação Digital.",
};

type Props = { params: Promise<{ slug: string }> };

export default async function PrivacidadePage({ params }: Props) {
  const { slug } = await params;

  return (
    <InstitucionalDocumento
      slug={slug}
      eyebrow="Privacidade"
      titulo="Privacidade e Proteção de Dados"
      introducao="Esta página descreve, em linguagem objetiva, como informações pessoais e dados técnicos podem ser utilizados durante o processo de votação digital. O tratamento deve observar a legislação aplicável, incluindo a Lei Geral de Proteção de Dados Pessoais (LGPD)."
    >
      <DocumentoSecao titulo="1. Papéis no processo eleitoral">
        <p>A entidade responsável pela eleição define as finalidades, regras, eleitores habilitados e demais parâmetros do processo. A Cone Sul Sistemas fornece a infraestrutura tecnológica da plataforma conforme a contratação e as instruções aplicáveis.</p>
        <p>A definição jurídica específica dos agentes de tratamento e de suas responsabilidades pode variar conforme o contrato e o contexto de cada eleição.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="2. Dados que podem ser tratados">
        <DocumentoLista>
          <li>Dados de identificação necessários à validação do eleitor, como CPF, matrícula e nome.</li>
          <li>Dados de contato utilizados no fluxo de confirmação, quando disponibilizados pela entidade.</li>
          <li>Dados técnicos e de segurança, como endereço IP, navegador, data, hora e eventos de autenticação ou administração.</li>
          <li>Informações relacionadas à participação na eleição, necessárias para impedir duplicidade de voto e gerar indicadores de participação.</li>
          <li>Comprovante técnico do registro do voto, utilizado para validação posterior sem revelar a escolha realizada.</li>
        </DocumentoLista>
      </DocumentoSecao>

      <DocumentoSecao titulo="3. Sigilo do voto">
        <p>A identificação de que um eleitor participou é mantida separada do registro que contém a opção de voto. A interface administrativa não deve apresentar uma relação direta entre a identidade do eleitor e a chapa, voto em branco ou voto nulo escolhido.</p>
        <p>O evento operacional de voto registrado também é tratado sem identificação do eleitor, IP ou User-Agent, preservando a separação entre participação e escolha.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="4. Finalidades do tratamento">
        <DocumentoLista>
          <li>Identificar e habilitar o usuário no processo eleitoral.</li>
          <li>Enviar e validar códigos de confirmação quando aplicável.</li>
          <li>Impedir registro duplicado de voto.</li>
          <li>Manter segurança, auditoria e rastreabilidade das operações autorizadas.</li>
          <li>Gerar indicadores de participação e relatórios administrativos permitidos.</li>
          <li>Atender obrigações legais, contratuais e regras formalmente definidas para a eleição.</li>
        </DocumentoLista>
      </DocumentoSecao>

      <DocumentoSecao titulo="5. Armazenamento no navegador">
        <p>Durante a navegação, a aplicação utiliza armazenamento de sessão do navegador para manter temporariamente tokens e informações necessárias ao fluxo da eleição. Esses dados são separados por eleição e são removidos conforme o encerramento, expiração ou limpeza da sessão.</p>
        <p>O usuário pode fechar o navegador ou limpar os dados do site, observando que isso pode exigir nova identificação para continuar uma operação ainda não concluída.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="6. Segurança e retenção">
        <p>São aplicados controles de acesso, separação de responsabilidades, auditoria e mecanismos técnicos voltados à proteção do processo eleitoral. Em produção, a comunicação deve ocorrer por conexão segura HTTPS.</p>
        <p>Os prazos de retenção devem observar a finalidade do processo eleitoral, obrigações legais e contratuais, necessidade de auditoria e as definições da entidade responsável.</p>
      </DocumentoSecao>

      <DocumentoSecao titulo="7. Direitos do titular">
        <p>O titular pode exercer os direitos previstos na LGPD conforme aplicável ao tratamento, incluindo confirmação e acesso aos dados, correção, informações sobre uso e compartilhamento, oposição ou revogação quando cabíveis e demais direitos legalmente previstos.</p>
        <p>Solicitações relacionadas aos dados da eleição devem ser encaminhadas preferencialmente pelos canais oficiais da entidade responsável exibidos nesta plataforma.</p>
      </DocumentoSecao>

      <DocumentoDestaque>
        <strong>Importante:</strong> a validação pública de comprovante confirma somente que existe um registro correspondente. Ela não revela a identidade do eleitor nem a opção escolhida no voto.
      </DocumentoDestaque>
    </InstitucionalDocumento>
  );
}
