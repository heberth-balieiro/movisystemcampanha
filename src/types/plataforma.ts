export type SituacaoEleicao =
  | "RASCUNHO" | "AGENDADA" | "ABERTA" | "ENCERRADA"
  | "EM_APURACAO" | "APURADA" | "PUBLICADA";

export interface Empresa {
  id?: number;
  razao: string;
  fantasia: string;
  cpfcnpj: string;
  email?: string;
  telefone?: string;
  ativo?: "S" | "N";
}

export interface Eleicao {
  id: number;
  nome: string;
  descricao?: string;
  ano: number;
  ano_fim?: number;
  situacao: SituacaoEleicao;
  ativo: "S" | "N";
}

export interface Associado {
  id?: number;
  matricula: string | number;
  nome: string;
  cpf: string;
  whatsapp?: string;
  email?: string;
  ativo: "S" | "N";
}

export interface Chapa {
  id: number;
  num_chapa?: number;
  nome_chapa: string;
  slogan?: string;
  situacao: "INSCRITA" | "HOMOLOGADA" | "INDEFERIDA";
  ativo: "S" | "N";
}

export interface Membro {
  id: number;
  nome: string;
  cpf: string;
  cargo?: string;
  tipo?: string;
  telefone?: string;
  email?: string;
  foto_url?: string | null;
  ativo: "S" | "N";
}
