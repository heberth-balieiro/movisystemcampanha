Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Adicionar no painel ADMIN a ação:

Publicar resultado

Página:

/{slug}/admin/painel

Exemplo:

/asmuv/admin/painel

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

POST /api/v1/eleicao/{slug}/admin/publicar-resultado

Header:

Authorization: Bearer {token_admin}

Retorno de sucesso:

{
  "erro": false,
  "mensagem": "Resultado publicado com sucesso.",
  "dados": {
    "situacao": "PUBLICADA"
  }
}

Retorno quando a situação não permite:

{
  "erro": true,
  "mensagem": "Somente eleições apuradas podem ter o resultado publicado.",
  "dados": null
}

--------------------------------------------------
2. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

publicarResultadoAdmin(slug, tokenAdmin)

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

type EleicaoAdminPublicarResultadoDados = {
  situacao: string;
};

type EleicaoAdminPublicarResultadoResponse =
  ApiResponse<Nullable<EleicaoAdminPublicarResultadoDados>>;

Seguir o padrão atual do projeto.

--------------------------------------------------
4. PAINEL ADMIN
--------------------------------------------------

Atualizar:

src/app/[slug]/admin/painel/page.tsx

Quando:

eleicao.situacao === "APURADA"

mostrar botão:

Publicar resultado

Não mostrar esse botão quando estiver:

ABERTA
ENCERRADA
EM_APURACAO
PUBLICADA

--------------------------------------------------
5. CONFIRMAÇÃO
--------------------------------------------------

Ao clicar em:

Publicar resultado

mostrar confirmação antes de chamar a API.

Mensagem sugerida:

Publicar resultado?

Após a publicação, o resultado poderá ser disponibilizado publicamente para consulta.

Deseja continuar?

Botões:

Cancelar
Publicar resultado

Reutilizar o modal/dialog já usado nas ações anteriores.

--------------------------------------------------
6. LIMPAR MENSAGENS ANTIGAS
--------------------------------------------------

Antes de abrir o modal:

- limpar mensagem de sucesso anterior;
- limpar mensagem de erro anterior.

Manter o ajuste de UX já aplicado nas outras ações administrativas.

--------------------------------------------------
7. AÇÃO
--------------------------------------------------

Ao confirmar:

- obter token_admin;
- chamar publicarResultadoAdmin;
- desabilitar botões durante request;
- mostrar:

Publicando resultado...

- impedir duplo clique.

--------------------------------------------------
8. SUCESSO
--------------------------------------------------

Quando a API retornar sucesso:

- fechar modal;
- mostrar:

Resultado publicado com sucesso.

- atualizar os dados do painel;
- situação deve passar para:

PUBLICADA

- esconder o botão "Publicar resultado".

Preferir reutilizar a função atual de carregamento do painel.

--------------------------------------------------
9. RESULTADO ADMINISTRATIVO
--------------------------------------------------

Após a publicação, manter visível no painel ADMIN:

- resumo da apuração;
- total de votos;
- votos válidos;
- votos brancos;
- votos nulos;
- resultado por chapa;
- gráfico de resultado.

Ou seja:

APURADA
→ exibe resultado ADMIN

PUBLICADA
→ continua exibindo resultado ADMIN

Se hoje o frontend carrega o resultado somente quando:

situacao === "APURADA"

ajustar para:

situacao === "APURADA" || situacao === "PUBLICADA"

IMPORTANTE:

A API atual de resultado administrativo também deve ser considerada. Se ela ainda bloquear PUBLICADA, apenas identificar essa pendência e informar ao final. Não alterar backend nesta tarefa.

--------------------------------------------------
10. VISUAL DA SITUAÇÃO
--------------------------------------------------

Quando:

situacao === "PUBLICADA"

mostrar claramente:

Situação: PUBLICADA

Manter o padrão visual dos demais status.

--------------------------------------------------
11. ERRO
--------------------------------------------------

Se a API retornar erro:

mostrar a mensagem retornada.

Exemplo:

Somente eleições apuradas podem ter o resultado publicado.

Não usar alert().

Não alterar a situação local manualmente em caso de erro.

--------------------------------------------------
12. TOKEN INVÁLIDO
--------------------------------------------------

Se token ADMIN estiver inválido ou expirado:

- limpar somente sessão administrativa;
- redirecionar para:

/{slug}/admin/login

Nunca:

/login

--------------------------------------------------
13. REGRAS DOS BOTÕES ADMIN
--------------------------------------------------

O comportamento final esperado deve ficar:

ABERTA
→ Encerrar votação

ENCERRADA
→ Iniciar apuração

EM_APURACAO
→ Finalizar apuração

APURADA
→ Publicar resultado

PUBLICADA
→ nenhuma ação de mudança de situação

--------------------------------------------------
14. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- resultado público;
- página pública de resultado;
- alterações no backend;
- novos endpoints;
- PDF;
- impressão;
- exportação;
- regras de empate;
- vencedor oficial.

--------------------------------------------------
15. TESTES
--------------------------------------------------

Cenário 1:

situacao = APURADA
→ botão "Publicar resultado" aparece

Cenário 2:

clicar
→ modal aparece

Cenário 3:

cancelar
→ nada é alterado

Cenário 4:

confirmar
→ POST /admin/publicar-resultado
→ sucesso
→ painel atualiza
→ situacao = PUBLICADA
→ botão desaparece

Cenário 5:

situacao = PUBLICADA
→ botão não aparece

Cenário 6:

erro da API
→ mostrar mensagem
→ manter situação correta

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
7. como resultado ADMIN foi tratado em APURADA/PUBLICADA;
8. tratamento de erros;
9. pendências encontradas.

Depois disso, parar.

Não implementar resultado público ainda.