/**
 * Type base para o envelope padrão retornado pela API Delphi/Horse.
 * Usado por todas as chamadas feitas através do apiFetch.
 */
export type ApiResponse<T> = {
  erro: boolean;
  mensagem: string;
  dados: T;
};

/**
 * Type padrão para campos CHAR(1) usados no backend.
 * S = Sim/ativo/permitido, N = Não/inativo/bloqueado.
 */
export type BooleanFlag = "S" | "N";

/**
 * Type auxiliar para campos que podem vir como null do banco/API.
 */
export type Nullable<T> = T | null;

/**
 * Type genérico para retorno de rotas DELETE/PUT sem conteúdo útil.
 */
export type EmptyApiData = null | undefined | Record<string, never>;
