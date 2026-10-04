Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Adicionar no painel ADMIN a ação:

Finalizar apuração

Página:

/{slug}/admin/painel

Exemplo:

/asmuv/admin/painel

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

POST /api/v1/eleicao/{slug}/admin/finalizar-apuracao

Header:

Authorization: Bearer {token_admin}

Retorno de sucesso:

{
  "erro": false,
  "mensagem": "Apuração finalizada com sucesso.",
  "dados": {
    "situacao": "APURADA"
  }
}

Retorno quando a situação não permite:

{
  "erro": true,
  "mensagem": "Somente eleições em apuração podem ser finalizadas.",
  "dados": null
}

--------------------------------------------------
2. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

finalizarApuracaoAdmin(slug, tokenAdmin)

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

type EleicaoAdminFinalizarApuracaoDados = {
  situacao: string;
};

type EleicaoAdminFinalizarApuracaoResponse =
  ApiResponse<Nullable<EleicaoAdminFinalizarApuracaoDados>>;

Seguir o padrão atual do projeto.

--------------------------------------------------
4. PAINEL ADMIN
--------------------------------------------------

Atualizar:

src/app/[slug]/admin/painel/page.tsx

Quando:

eleicao.situacao === "EM_APURACAO"

mostrar botão:

Finalizar apuração

Não mostrar esse botão quando estiver:

ABERTA
ENCERRADA
APURADA
PUBLICADA

--------------------------------------------------
5. CONFIRMAÇÃO
--------------------------------------------------

Ao clicar em:

Finalizar apuração

mostrar confirmação antes de chamar a API.

Mensagem sugerida:

Finalizar apuração?

Ao finalizar esta etapa, a eleição será marcada como APURADA.

Deseja continuar?

Botões:

Cancelar
Finalizar apuração

Reutilizar modal/dialog já existente no projeto.

--------------------------------------------------
6. AÇÃO
--------------------------------------------------

Ao confirmar:

- obter token_admin;
- chamar finalizarApuracaoAdmin;
- desabilitar botões durante request;
- mostrar:

Finalizando apuração...

- impedir duplo clique.

--------------------------------------------------
7. SUCESSO
--------------------------------------------------

Quando a API retornar sucesso:

- fechar modal;
- mostrar mensagem:

Apuração finalizada com sucesso.

- atualizar os dados do painel;
- situação deve passar para:

APURADA

- esconder o botão "Finalizar apuração".

Preferir reutilizar a função atual de carregamento do painel.

--------------------------------------------------
8. VISUAL DA SITUAÇÃO
--------------------------------------------------

Quando:

situacao === "APURADA"

mostrar claramente:

Situação: APURADA

Manter o padrão visual dos demais status.

--------------------------------------------------
9. RESULTADO
--------------------------------------------------

IMPORTANTE:

Nesta tarefa ainda NÃO mostrar:

- votos por chapa;
- votos brancos;
- votos nulos;
- ranking;
- resultado;
- percentual por candidato.

Apenas atualizar a situação da eleição.

--------------------------------------------------
10. ERRO
--------------------------------------------------

Se a API retornar erro:

mostrar a mensagem retornada.

Exemplo:

Somente eleições em apuração podem ser finalizadas.

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
→ mostrar "Finalizar apuração"

APURADA
→ não mostrar nenhum desses três botões

--------------------------------------------------
13. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- publicar resultado;
- resultado por chapa;
- votos brancos;
- votos nulos;
- ranking;
- gráficos de apuração;
- alterações no backend;
- novos endpoints.

--------------------------------------------------
14. TESTES
--------------------------------------------------

Cenário 1:

situacao = EM_APURACAO
→ botão "Finalizar apuração" aparece

Cenário 2:

clicar
→ modal de confirmação aparece

Cenário 3:

cancelar
→ nada é alterado

Cenário 4:

confirmar
→ POST /admin/finalizar-apuracao
→ sucesso
→ painel atualiza
→ situacao = APURADA
→ botão desaparece

Cenário 5:

situacao diferente de EM_APURACAO
→ botão não aparece

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

Não implementar publicação de resultado ainda.