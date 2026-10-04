Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Exibir no painel ADMIN o resultado da apuração quando a eleição estiver:

APURADA

Página:

/{slug}/admin/painel

Exemplo:

/asmuv/admin/painel

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

GET /api/v1/eleicao/{slug}/admin/resultado

Header:

Authorization: Bearer {token_admin}

Retorno atual:

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "eleicao": {
      "id": 3,
      "nome": "Eleição Diretoria 2026",
      "situacao": "APURADA"
    },
    "resumo": {
      "total_votos": 1,
      "votos_validos": 1,
      "votos_brancos": 0,
      "votos_nulos": 0
    },
    "chapas": [
      {
        "id": 2,
        "numero": 1,
        "nome": "Chapa Renovação",
        "quantidade_votos": 1,
        "percentual": 100
      }
    ]
  }
}

--------------------------------------------------
2. TYPES
--------------------------------------------------

Atualizar:

src/types/eleicao/index.ts

Criar tipos para:

EleicaoAdminResultadoEleicao
EleicaoAdminResultadoResumo
EleicaoAdminResultadoChapa
EleicaoAdminResultadoDados
EleicaoAdminResultadoResponse

Seguir o padrão atual do projeto.

--------------------------------------------------
3. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

buscarResultadoAdminEleicao(slug, tokenAdmin)

Ela deve:

- executar GET;
- enviar token_admin;
- retornar resposta tipada;
- não redirecionar;
- não alterar sessão.

--------------------------------------------------
4. REGRA DE EXIBIÇÃO
--------------------------------------------------

No painel:

src/app/[slug]/admin/painel/page.tsx

Carregar o resultado somente quando:

eleicao.situacao === "APURADA"

Não consultar essa rota quando estiver:

ABERTA
ENCERRADA
EM_APURACAO

--------------------------------------------------
5. RESUMO DA APURAÇÃO
--------------------------------------------------

Criar uma seção:

Resultado da apuração

Mostrar 4 cards:

Total de votos
→ total_votos

Votos válidos
→ votos_validos

Votos em branco
→ votos_brancos

Votos nulos
→ votos_nulos

Exemplo:

[ 100 ]
Total de votos

[ 90 ]
Votos válidos

[ 5 ]
Votos em branco

[ 5 ]
Votos nulos

--------------------------------------------------
6. RESULTADO POR CHAPA
--------------------------------------------------

Criar uma seção:

Resultado por chapa

Para cada item de chapas[], mostrar:

- número da chapa;
- nome;
- quantidade de votos;
- percentual.

Exemplo:

Chapa 01
Chapa Renovação

60 votos
66,67%

Ordenar conforme recebido pela API.

Não recalcular ou reorganizar desnecessariamente no frontend.

--------------------------------------------------
7. GRÁFICO
--------------------------------------------------

Criar gráfico para resultado por chapa.

Usar a biblioteca já utilizada no painel.

Preferência:

gráfico de barras.

Eixo/categoria:

nome ou número da chapa

Valor:

quantidade_votos

Também exibir percentual no tooltip ou label quando possível.

Não incluir branco e nulo no gráfico de chapas.

Branco e nulo já devem aparecer nos cards de resumo.

--------------------------------------------------
8. DESTAQUE DA CHAPA MAIS VOTADA
--------------------------------------------------

Pode destacar visualmente a primeira colocada caso exista resultado.

Exemplo:

Mais votada

Chapa 01 - Chapa Renovação

Não criar regra de "vencedora" definitiva nesta etapa.

Apenas indicar:

Mais votada

pois regras de empate ou critérios eleitorais ainda podem ser implementados depois.

--------------------------------------------------
9. ZERO VOTOS
--------------------------------------------------

Se:

chapas.length === 0

ou todos tiverem zero votos,

mostrar mensagem:

Não há votos válidos por chapa para exibir.

Não renderizar gráfico quebrado.

--------------------------------------------------
10. LOADING
--------------------------------------------------

Enquanto carrega o resultado:

mostrar:

Carregando resultado da apuração...

Não bloquear o restante do painel desnecessariamente.

--------------------------------------------------
11. ERRO
--------------------------------------------------

Se a API retornar erro:

mostrar mensagem amigável dentro da seção de resultado.

Não usar alert().

Não esconder os dados de participação já carregados no painel.

--------------------------------------------------
12. TOKEN INVÁLIDO
--------------------------------------------------

Se token ADMIN estiver inválido ou expirado:

- limpar somente sessão administrativa;
- redirecionar para:

/{slug}/admin/login

Nunca redirecionar para:

/login

--------------------------------------------------
13. PAINEL EXISTENTE
--------------------------------------------------

Manter tudo que já existe:

- dados da eleição;
- cards de participação;
- gráfico de participação;
- gráfico de evolução;
- botão Atualizar dados;
- botão Sair.

A seção de resultado deve ser adicionada abaixo ou em posição coerente no painel.

--------------------------------------------------
14. ATUALIZAR DADOS
--------------------------------------------------

Quando clicar em:

Atualizar dados

se a eleição estiver APURADA:

- atualizar painel;
- atualizar também resultado da apuração.

Reutilizar as funções existentes.

--------------------------------------------------
15. NÃO PUBLICAR RESULTADO
--------------------------------------------------

IMPORTANTE:

Este resultado é somente ADMIN.

Não alterar:

/{slug}

Não mostrar resultado na página pública.

Não criar ainda:

Publicar resultado

--------------------------------------------------
16. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- publicação pública;
- resultado público;
- regras de empate;
- vencedor oficial;
- PDF;
- impressão;
- exportação;
- auditoria;
- alterações na API;
- novos endpoints.

--------------------------------------------------
17. TESTES
--------------------------------------------------

Cenário 1:

situacao = APURADA
→ carregar /admin/resultado
→ mostrar cards
→ mostrar chapas
→ mostrar gráfico

Cenário 2:

situacao = ABERTA
→ não carregar resultado

Cenário 3:

situacao = ENCERRADA
→ não carregar resultado

Cenário 4:

situacao = EM_APURACAO
→ não carregar resultado

Cenário 5:

Atualizar dados
→ painel e resultado atualizam

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
4. como o resultado é carregado;
5. cards criados;
6. gráfico implementado;
7. tratamento de estado sem votos;
8. tratamento de erros;
9. pendências encontradas.

Depois disso, parar.

Não implementar publicação do resultado ainda.