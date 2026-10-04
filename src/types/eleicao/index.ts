import type { ApiResponse, Nullable } from "@/types/api";

export type StatusVotacao = "AGENDADA" | "ABERTA" | "ENCERRADA" | "EM_APURACAO" | "APURADA" | "PUBLICADA";

export type EleicaoEntidade = {
  slug: string;
  nome_exibicao: string;
  mensagem_boas_vindas: Nullable<string>;
  email: Nullable<string>;
  telefone: Nullable<string>;
  cor_primaria: Nullable<string>;
  cor_secundaria: Nullable<string>;
  url_instagram: Nullable<string>;
  url_facebook: Nullable<string>;
  url_youtube: Nullable<string>;
  pagina_publicar: string;
  logo: string;
  banner: string;
  data_hora_inicio: Nullable<string>;
  data_hora_fim: Nullable<string>;
};

export type EleicaoPublica = {
  id: number;
  codigo: number;
  nome: string;
  descricao: Nullable<string>;
  ano: number;
  tipo: string;
  situacao: StatusVotacao;
  data_hora_inicio: Nullable<string>;//nao usando
  data_hora_fim: Nullable<string>;//nao usando
};

export type EleicaoPublicaDados = {
  entidade: EleicaoEntidade;
  eleicao: EleicaoPublica;
};

export type EleicaoPublicaResponse = ApiResponse<Nullable<EleicaoPublicaDados>>;

export type EleicaoLoginRequest = {
  cpf: string;
  matricula: string;
};

export type EleicaoLoginDados = {
  token_identificacao: string;
  identificado: string;
  nome: string;
};

export type EleicaoLoginResponse = ApiResponse<Nullable<EleicaoLoginDados>>;

export type EleicaoPaginaEstado =
  | "carregando"
  | "sucesso"
  | "slug-nao-encontrado"
  | "erro-comunicacao";

export type EleicaoSolicitarCodigoDados = {
  enviado: string;
  destino: string;
  expira_em_segundos: number;
  reenviar_em_segundos: number;
};

export type EleicaoSolicitarCodigoResponse =
  ApiResponse<Nullable<EleicaoSolicitarCodigoDados>>;

export type EleicaoValidarCodigoRequest = {
  codigo: string;
};

export type EleicaoValidarCodigoDados = {
  confirmado: string;
  token_votacao: string;
};

export type EleicaoValidarCodigoResponse =
  ApiResponse<Nullable<EleicaoValidarCodigoDados>>;

export type EleicaoChapaMembro = {
  id: number;
  codigo: number;
  nome: string;
  cargo: string;
  tipo: string;
  observacao: string | null;
  tem_foto: string;
  foto_url?: string | null;
};

export type EleicaoChapa = {
  id: number;
  codigo: number;
  numero: number;
  nome: string;
  slogan: string | null;
  observacao: string | null;
  situacao: string;
  membros: EleicaoChapaMembro[];
};

export type EleicaoVotacao = {
  eleicao: {
    id: number;
    codigo: number;
    nome: string;
    descricao: string | null;
    ano: number;
    tipo: string;
    situacao: StatusVotacao;
  };
  chapas: EleicaoChapa[];
};

export type EleicaoVotacaoDados = EleicaoVotacao;

export type EleicaoVotacaoResponse = ApiResponse<Nullable<EleicaoVotacaoDados>>;

export type TipoVoto = "CHAPA" | "BRANCO" | "NULO";

export type EleicaoRegistrarVotoRequest = {
  tipo_voto: TipoVoto;
  id_chapa?: number;
};

export type EleicaoRegistrarVotoDados = {
  confirmado: string;
  comprovante: string;
};

export type EleicaoRegistrarVotoResponse = ApiResponse<Nullable<EleicaoRegistrarVotoDados>>;

export type EleicaoValidarComprovanteRequest = {
  comprovante: string;
};

export type EleicaoValidarComprovanteDados = {
  valido: string;
  eleicao?: string;
  registrado_em?: string;
};

export type EleicaoValidarComprovanteResponse = ApiResponse<Nullable<EleicaoValidarComprovanteDados>>;

export type EleicaoAdminLoginRequest = {
  email: string;
  senha: string;
};

export type EleicaoAdminLoginDados = {
  token: string;
  nome: string;
};

export type EleicaoAdminLoginResponse = ApiResponse<Nullable<EleicaoAdminLoginDados>>;

export type EleicaoAdminPainelEleicao = {
  id: number;
  nome: string;
  situacao: string;
  data_hora_inicio: string | null;
  data_hora_fim: string | null;
};

export type EleicaoAdminPainelResumo = {
  total_eleitores: number;
  total_votantes: number;
  total_nao_votantes: number;
  percentual_participacao: number;
};

export type EleicaoAdminPainelEvolucaoItem = {
  hora: string;
  quantidade: number;
  acumulado: number;
};

export type EleicaoAdminPainelDados = {
  eleicao: EleicaoAdminPainelEleicao;
  resumo: EleicaoAdminPainelResumo;
  evolucao: EleicaoAdminPainelEvolucaoItem[];
};

export type EleicaoAdminPainelResponse = ApiResponse<Nullable<EleicaoAdminPainelDados>>;

export type EleicaoAdminEncerrarDados = {
  situacao: string;
};

export type EleicaoAdminEncerrarResponse = ApiResponse<Nullable<EleicaoAdminEncerrarDados>>;

export type EleicaoAdminIniciarApuracaoDados = {
  situacao: string;
};

export type EleicaoAdminIniciarApuracaoResponse = ApiResponse<Nullable<EleicaoAdminIniciarApuracaoDados>>;

export type EleicaoAdminFinalizarApuracaoDados = {
  situacao: string;
};

export type EleicaoAdminFinalizarApuracaoResponse = ApiResponse<Nullable<EleicaoAdminFinalizarApuracaoDados>>;

export type EleicaoAdminResultadoEleicao = {
  id: number;
  nome: string;
  situacao: string;
};

export type EleicaoAdminResultadoResumo = {
  total_votos: number;
  votos_validos: number;
  votos_brancos: number;
  votos_nulos: number;
};

export type EleicaoAdminResultadoChapa = {
  id: number;
  numero: number;
  nome: string;
  quantidade_votos: number;
  percentual: number;
};

export type EleicaoAdminResultadoDados = {
  eleicao: EleicaoAdminResultadoEleicao;
  resumo: EleicaoAdminResultadoResumo;
  chapas: EleicaoAdminResultadoChapa[];
};

export type EleicaoAdminResultadoResponse = ApiResponse<Nullable<EleicaoAdminResultadoDados>>;

export type EleicaoAdminPublicarResultadoDados = {
  situacao: string;
};

export type EleicaoAdminPublicarResultadoResponse = ApiResponse<Nullable<EleicaoAdminPublicarResultadoDados>>;

export type EleicaoResultadoPublicoEleicao = {
  id: number;
  nome: string;
  situacao: string;
};

export type EleicaoResultadoPublicoResumo = {
  total_votos: number;
  votos_validos: number;
  votos_brancos: number;
  votos_nulos: number;
};

export type EleicaoResultadoPublicoChapa = {
  id: number;
  numero: number;
  nome: string;
  quantidade_votos: number;
  percentual: number;
};

export type EleicaoResultadoPublicoDados = {
  eleicao: EleicaoResultadoPublicoEleicao;
  resumo: EleicaoResultadoPublicoResumo;
  chapas: EleicaoResultadoPublicoChapa[];
};

export type EleicaoResultadoPublicoResponse = ApiResponse<Nullable<EleicaoResultadoPublicoDados>>;

export type EleicaoAuditoriaItem = {
  id: number;
  tipo_evento: string;
  origem: string;
  sucesso: string;
  descricao: string;
  ip: string;
  user_agent: string;
  criado_em: string;
  usuario_id: number | null;
};

export type EleicaoAuditoriaResponse = ApiResponse<Nullable<EleicaoAuditoriaItem[]>>;
