Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Adicionar no painel ADMIN a ação para encerrar a votação.

Página:

/{slug}/admin/painel

Exemplo:

/asmuv/admin/painel

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

POST /api/v1/eleicao/{slug}/admin/encerrar

Header:

Authorization: Bearer {token_admin}

Retorno de sucesso:

{
  "erro": false,
  "mensagem": "Eleição encerrada com sucesso.",
  "dados": {
    "situacao": "ENCERRADA"
  }
}

Retorno em nova tentativa:

{
  "erro": true,
  "mensagem": "Somente eleições abertas podem ser encerradas.",
  "dados": null
}

--------------------------------------------------
2. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

encerrarEleicaoAdmin(slug, tokenAdmin)

Ela deve:

- executar POST;
- enviar token_admin;
- não enviar body;
- retornar resposta tipada;
- não redirecionar;
- não alterar sessão.

--------------------------------------------------
3. TYPES
--------------------------------------------------

Atualizar:

src/types/eleicao/index.ts

Criar tipos equivalentes a:

type EleicaoAdminEncerrarDados = {
  situacao: string;
};

type EleicaoAdminEncerrarResponse =
  ApiResponse<Nullable<EleicaoAdminEncerrarDados>>;

Seguir o padrão atual do projeto.

--------------------------------------------------
4. PAINEL ADMIN
--------------------------------------------------

Atualizar:

src/app/[slug]/admin/painel/page.tsx

Quando:

eleicao.situacao === "ABERTA"

mostrar botão:

Encerrar votação

Não mostrar o botão quando a situação for:

ENCERRADA
EM_APURACAO
APURADA
PUBLICADA

--------------------------------------------------
5. CONFIRMAÇÃO
--------------------------------------------------

Ao clicar em:

Encerrar votação

NÃO executar imediatamente.

Mostrar confirmação clara.

Pode usar modal/dialog já existente no projeto.

Se não houver componente adequado, criar solução simples seguindo o padrão visual atual.

Mensagem:

Encerrar votação?

Após o encerramento, novos votos não poderão ser registrados.

Deseja continuar?

Botões:

Cancelar
Encerrar votação

--------------------------------------------------
6. AÇÃO DE ENCERRAMENTO
--------------------------------------------------

Ao confirmar:

- obter token_admin;
- chamar encerrarEleicaoAdmin;
- desabilitar botão durante request;
- mostrar:

Encerrando...

- impedir duplo clique.

--------------------------------------------------
7. SUCESSO
--------------------------------------------------

Quando a API retornar sucesso:

- fechar confirmação;
- mostrar mensagem:

Eleição encerrada com sucesso.

- atualizar os dados do painel;
- situação deve passar para:

ENCERRADA

- esconder o botão "Encerrar votação".

Preferir reutilizar a função já existente que carrega o painel.

Não recarregar a página inteira se não for necessário.

--------------------------------------------------
8. ERRO
--------------------------------------------------

Se a API retornar erro:

mostrar a mensagem retornada.

Exemplo:

Somente eleições abertas podem ser encerradas.

Não usar alert().

Não alterar a situação local manualmente em caso de erro.

--------------------------------------------------
9. TOKEN INVÁLIDO
--------------------------------------------------

Se o token ADMIN estiver inválido ou expirado:

- limpar somente sessão administrativa;
- redirecionar para:

/{slug}/admin/login

Nunca redirecionar para:

/login

--------------------------------------------------
10. VISUAL DA SITUAÇÃO
--------------------------------------------------

Após encerramento, manter destaque claro:

Situação: ENCERRADA

Pode usar badge/status já existente.

Não mostrar resultado eleitoral nesta etapa.

--------------------------------------------------
11. SEGURANÇA / REGRA
--------------------------------------------------

O frontend apenas controla UX.

A regra definitiva continua sendo da API.

Não tentar encerrar eleição alterando somente estado local.

Sempre executar o endpoint real.

--------------------------------------------------
12. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- iniciar apuração;
- finalizar apuração;
- publicar resultado;
- votos por chapa;
- votos brancos;
- votos nulos;
- ranking;
- resultado parcial;
- novos endpoints;
- alterações no backend.

--------------------------------------------------
13. TESTES
--------------------------------------------------

Cenário 1:

situação = ABERTA
→ botão "Encerrar votação" aparece

Cenário 2:

clicar botão
→ confirmação aparece

Cenário 3:

cancelar
→ nada é alterado

Cenário 4:

confirmar
→ POST /admin/encerrar
→ sucesso
→ painel atualiza
→ situação = ENCERRADA
→ botão desaparece

Cenário 5:

erro da API
→ mostrar mensagem
→ painel permanece como estava

Cenário 6:

token inválido
→ limpar sessão admin
→ /{slug}/admin/login

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivos alterados;
2. tipos adicionados;
3. função criada no service;
4. como o botão foi exibido;
5. como funciona a confirmação;
6. como o painel é atualizado após sucesso;
7. como erros foram tratados;
8. pendências encontradas.

Depois disso, parar.

Não implementar a etapa de apuração ainda.