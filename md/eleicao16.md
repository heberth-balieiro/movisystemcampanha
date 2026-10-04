Dar continuidade ao frontend público do módulo de eleição.

OBJETIVO

Criar a página pública de resultado da eleição:

/{slug}/resultado

Exemplo:

/asmuv/resultado

Essa página deve ser pública, sem login e sem token.

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

GET /api/v1/public/eleicao/{slug}/resultado

Retorno atual:

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "eleicao": {
      "id": 3,
      "nome": "Eleição Diretoria 2026",
      "situacao": "PUBLICADA"
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

Não hardcode host ou IP.

Utilizar apiFetch.

--------------------------------------------------
2. REGRA
--------------------------------------------------

A API pública já garante que o resultado somente estará disponível quando:

situacao === "PUBLICADA"

O frontend não deve tentar reproduzir essa regra.

Se a API retornar:

{
  "erro": true,
  "mensagem": "Resultado da eleição não disponível.",
  "dados": null
}

mostrar mensagem amigável na página.

--------------------------------------------------
3. TYPES
--------------------------------------------------

Atualizar:

src/types/eleicao/index.ts

Criar tipos para:

EleicaoResultadoPublicoEleicao
EleicaoResultadoPublicoResumo
EleicaoResultadoPublicoChapa
EleicaoResultadoPublicoDados
EleicaoResultadoPublicoResponse

Seguir o padrão atual do projeto.

--------------------------------------------------
4. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

buscarResultadoPublicoEleicao(slug)

Ela deve:

- executar GET;
- não enviar token;
- retornar resposta tipada;
- não redirecionar;
- não alterar sessão.

--------------------------------------------------
5. PÁGINA
--------------------------------------------------

Criar:

src/app/[slug]/resultado/page.tsx

A página deve:

1. obter slug;
2. chamar buscarResultadoPublicoEleicao;
3. exibir loading;
4. exibir erro amigável se necessário;
5. exibir resultado quando disponível.

--------------------------------------------------
6. CABEÇALHO
--------------------------------------------------

Mostrar:

Resultado da eleição

Eleição Diretoria 2026

Situação:
PUBLICADA

Pode exibir uma mensagem como:

Resultado oficial publicado.

--------------------------------------------------
7. RESUMO
--------------------------------------------------

Criar 4 cards:

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
8. RESULTADO POR CHAPA
--------------------------------------------------

Criar seção:

Resultado por chapa

Para cada chapa, mostrar:

- número;
- nome;
- quantidade de votos;
- percentual.

Exemplo:

Chapa 01
Chapa Renovação

60 votos
66,67%

Ordenar conforme retorno da API.

Não recalcular percentual no frontend.

--------------------------------------------------
9. CHAPA MAIS VOTADA
--------------------------------------------------

Pode destacar visualmente a primeira colocada como:

Mais votada

IMPORTANTE:

Não usar ainda:

Vencedora

Não temos regra oficial de empate/desempate implementada.

--------------------------------------------------
10. GRÁFICO
--------------------------------------------------

Criar gráfico de barras usando a mesma biblioteca já utilizada no painel ADMIN.

Dados:

chapas[]

Categoria:
nome ou número da chapa

Valor:
quantidade_votos

Mostrar percentual no tooltip quando possível.

Não incluir branco e nulo no gráfico de chapas.

--------------------------------------------------
11. ESTADO SEM VOTOS
--------------------------------------------------

Se não houver chapas com votos:

mostrar:

Não há votos válidos por chapa para exibir.

Não renderizar gráfico vazio quebrado.

--------------------------------------------------
12. VISUAL
--------------------------------------------------

Manter o padrão visual público do módulo de eleição.

Reutilizar:

EleicaoLayout
EleicaoHeader
EleicaoFooter
EleicaoLoading
EleicaoMensagem

e componentes de UI existentes.

A página deve funcionar bem em:

desktop
tablet
mobile

--------------------------------------------------
13. PÁGINA PRINCIPAL
--------------------------------------------------

Atualizar:

src/app/[slug]/page.tsx

Quando a eleição estiver:

PUBLICADA

mostrar botão:

Ver resultado

Direcionando para:

/{slug}/resultado

--------------------------------------------------
14. COMPORTAMENTO DA PÁGINA PRINCIPAL
--------------------------------------------------

Quando PUBLICADA:

- não mostrar botão para entrar na votação;
- mostrar situação PUBLICADA;
- mostrar botão "Ver resultado".

Manter também o acesso já existente para:

Validar comprovante

se já estiver implementado.

--------------------------------------------------
15. ACESSO DIRETO
--------------------------------------------------

A página:

/{slug}/resultado

deve funcionar sem login.

Não utilizar:

token_identificacao
token_votacao
token_admin

--------------------------------------------------
16. ERRO DE RESULTADO INDISPONÍVEL
--------------------------------------------------

Se a API retornar:

Resultado da eleição não disponível.

mostrar:

Resultado ainda não disponível

O resultado desta eleição ainda não foi publicado.

Adicionar botão:

Voltar para eleição

→ /{slug}

--------------------------------------------------
17. BOTÃO VOLTAR
--------------------------------------------------

Na página de resultado, adicionar:

Voltar para eleição

Direcionando para:

/{slug}

--------------------------------------------------
18. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar nesta tarefa:

- regra de vencedor oficial;
- empate;
- desempate;
- PDF;
- impressão;
- compartilhamento;
- auditoria;
- alteração da API;
- novos endpoints;
- login;
- resultado antes de PUBLICADA.

--------------------------------------------------
19. TESTES
--------------------------------------------------

Cenário 1:

situacao = PUBLICADA
→ /{slug}
→ botão "Ver resultado" aparece

Cenário 2:

clicar "Ver resultado"
→ /{slug}/resultado

Cenário 3:

resultado disponível
→ mostrar resumo
→ chapas
→ percentuais
→ gráfico

Cenário 4:

resultado indisponível
→ mostrar mensagem amigável
→ botão voltar

Cenário 5:

acesso direto
/{slug}/resultado
→ funcionar sem login

Cenário 6:

mobile
→ cards e gráfico responsivos

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivos criados;
2. arquivos alterados;
3. tipos adicionados;
4. função criada no service;
5. como funciona a página pública;
6. como o resultado por chapa foi exibido;
7. gráfico implementado;
8. comportamento da página principal em PUBLICADA;
9. tratamento do resultado indisponível;
10. pendências encontradas.

Depois disso, parar.

Não implementar novas regras eleitorais.