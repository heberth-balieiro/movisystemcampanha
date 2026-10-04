export const endpoints = {
  cadastro: "/api/v1/plataforma/cadastro",
  login: "/api/v1/plataforma/login",
  empresa: "/api/v1/plataforma/empresa",
  eleicoes: "/api/v1/plataforma/eleicoes",
  eleicao: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}`,
  configuracao: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}/configuracao`,
  chapas: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}/chapas`,
  membros: (id: string | number, chapaId: string | number) =>
    `/api/v1/plataforma/eleicoes/${id}/chapas/${chapaId}/membros`,
  associados: "/api/v1/plataforma/associados",
  importarAssociados: "/api/v1/plataforma/associados/importar",
  eleitoresAptos: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}/eleitores/aptos`,
  gerarAptos: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}/eleitores/gerar`,
  criarUsuarios: (id: string | number) => `/api/v1/plataforma/eleicoes/${id}/eleitores/criar-usuarios`,
};
