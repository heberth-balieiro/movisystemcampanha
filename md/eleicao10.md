Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Adicionar no painel ADMIN a ação:

Iniciar apuração

Página:

/{slug}/admin/painel

Exemplo:

/asmuv/admin/painel

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

POST /api/v1/eleicao/{slug}/admin/iniciar-apuracao

Header:

Authorization: Bearer {token_admin}

Retorno de sucesso:

{
  "erro": false,
  "mensagem": "Apuração iniciada com sucesso.",
  "dados": {
    "situacao": "EM_APURACAO"
  }
}

Retorno quando a situação não permite:

{
  "erro": true,
  "mensagem": "Somente eleições encerradas podem iniciar a apuração.",
  "dados": null
}

--------------------------------------------------
2. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

iniciarApuracaoAdmin(slug, tokenAdmin)

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

type EleicaoAdminIniciarApuracaoDados = {
  situacao: string;
};

type EleicaoAdminIniciarApuracaoResponse =
  ApiResponse<Nullable<EleicaoAdminIniciarApuracaoDados>>;

Seguir o padrão atual do projeto.

--------------------------------------------------
4. PAINEL ADMIN
--------------------------------------------------

Atualizar:

src/app/[slug]/admin/painel/page.tsx

Quando:

eleicao.situacao === "ENCERRADA"

mostrar botão:

Iniciar apuração

Não mostrar esse botão quando estiver:

ABERTA
EM_APURACAO
APURADA
PUBLICADA

--------------------------------------------------
5. CONFIRMAÇÃO
--------------------------------------------------

Ao clicar em:

Iniciar apuração

mostrar uma confirmação antes de chamar a API.

Mensagem sugerida:

Iniciar apuração?

A votação já foi encerrada e não será possível registrar novos votos.

Deseja iniciar a etapa de apuração?

Botões:

Cancelar
Iniciar apuração

Reutilizar modal/dialog já existente no projeto.

--------------------------------------------------
6. AÇÃO
--------------------------------------------------

Ao confirmar:

- obter token_admin;
- chamar iniciarApuracaoAdmin;
- desabilitar botões durante request;
- mostrar:

Iniciando apuração...

- impedir duplo clique.

--------------------------------------------------
7. SUCESSO
--------------------------------------------------

Quando a API retornar sucesso:

- fechar modal;
- mostrar mensagem:

Apuração iniciada com sucesso.

- atualizar os dados do painel;
- situação deve passar para:

EM_APURACAO

- esconder o botão "Iniciar apuração".

Preferir reutilizar a função atual de carregamento do painel.

--------------------------------------------------
8. VISUAL DA SITUAÇÃO
--------------------------------------------------

Quando:

situacao === "EM_APURACAO"

mostrar claramente no painel:

Situação: EM APURAÇÃO

Manter o padrão visual dos demais status.

--------------------------------------------------
9. RESULTADO
--------------------------------------------------

IMPORTANTE:

Mesmo em:

EM_APURACAO

NÃO mostrar ainda:

- votos por chapa;
- votos brancos;
- votos nulos;
- ranking;
- resultado;
- percentual por candidato.

Nesta tarefa apenas alterar a situação da eleição.

--------------------------------------------------
10. ERRO
--------------------------------------------------

Se a API retornar erro:

mostrar a mensagem retornada.

Exemplo:

Somente eleições encerradas podem iniciar a apuração.

Não usar alert().

Não alterar a situação local manualmente se a API falhar.

--------------------------------------------------
11. TOKEN INVÁLIDO
--------------------------------------------------

Se token ADMIN estiver inválido ou expirado:

- limpar somente sessão administrativa;
- redirecionar para:

/{slug}/admin/login

Nunca:

/login

--------------------------------------------------
12. REGRAS DOS BOTÕES ADMIN
--------------------------------------------------

O comportamento esperado no painel deve ficar:

ABERTA
→ mostrar "Encerrar votação"

ENCERRADA
→ mostrar "Iniciar apuração"

EM_APURACAO
→ não mostrar nenhum desses dois botões

Não permitir ações incompatíveis com a situação atual.

--------------------------------------------------
13. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- finalizar apuração;
- resultado;
- votos por chapa;
- votos brancos;
- votos nulos;
- publicação de resultado;
- alterações no backend;
- novos endpoints.

--------------------------------------------------
14. TESTES
--------------------------------------------------

Cenário 1:

situação = ENCERRADA
→ botão "Iniciar apuração" aparece

Cenário 2:

clicar
→ modal de confirmação aparece

Cenário 3:

cancelar
→ nada é alterado

Cenário 4:

confirmar
→ POST /admin/iniciar-apuracao
→ sucesso
→ painel atualiza
→ situação = EM_APURACAO
→ botão desaparece

Cenário 5:

situação = ABERTA
→ botão "Iniciar apuração" não aparece

Cenário 6:

erro da API
→ mostrar mensagem
→ não alterar painel incorretamente

Cenário 7:

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
4. regra de exibição do botão;
5. funcionamento da confirmação;
6. atualização do painel após sucesso;
7. tratamento dos erros;
8. pendências encontradas.

Depois disso, parar.

Não implementar finalização da apuração ainda.