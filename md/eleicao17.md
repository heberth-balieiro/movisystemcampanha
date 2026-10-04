Ajustar e validar a página pública de resultado da eleição no Next.js.

CONTEXTO

A página:

/{slug}/resultado

está apresentando o erro:

Route "/[slug]/resultado" used `params.slug`. `params` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties.

A API está funcionando corretamente no Postman.

O problema está somente no frontend.

--------------------------------------------------
1. ARQUIVO PRINCIPAL
--------------------------------------------------

Analisar e ajustar:

src/app/[slug]/resultado/page.tsx

--------------------------------------------------
2. IDENTIFICAR TIPO DA PÁGINA
--------------------------------------------------

Antes de alterar, verificar se a página é:

- Server Component
OU
- Client Component com "use client"

Não aplicar solução errada para o tipo atual da página.

--------------------------------------------------
3. SE FOR SERVER COMPONENT
--------------------------------------------------

Se a página NÃO tiver:

"use client"

ajustar para receber:

params: Promise<{ slug: string }>

e resolver com:

const { slug } = await params;

Exemplo:

export default async function ResultadoPublicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // restante da página
}

Não acessar:

params.slug

diretamente.

--------------------------------------------------
4. SE FOR CLIENT COMPONENT
--------------------------------------------------

Se a página tiver:

"use client"

não transformar simplesmente em async Server Component.

Utilizar:

useParams

de:

next/navigation

Exemplo:

const params = useParams<{ slug: string }>();
const slug = params.slug;

Manter o restante do fluxo client-side existente.

--------------------------------------------------
5. NÃO QUEBRAR O FLUXO ATUAL
--------------------------------------------------

Manter funcionando:

GET /api/v1/public/eleicao/{slug}/resultado

Sem token.

Não alterar:

- endpoint;
- API;
- types sem necessidade;
- layout;
- cards;
- gráfico;
- tratamento de resultado indisponível;
- página principal da eleição.

--------------------------------------------------
6. VALIDAR A CHAMADA DA API
--------------------------------------------------

Após corrigir o slug, validar que a página chama exatamente:

/api/v1/public/eleicao/{slug}/resultado

Exemplo:

/api/v1/public/eleicao/asmuv/resultado

Verificar se o slug está sendo enviado corretamente.

--------------------------------------------------
7. TRATAMENTO DA RESPOSTA
--------------------------------------------------

Confirmar que o retorno:

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

seja tratado como sucesso.

Não mostrar:

"Resultado ainda não disponível"

quando:

erro === false
e
dados !== null

--------------------------------------------------
8. RESULTADO INDISPONÍVEL
--------------------------------------------------

Manter a mensagem de resultado indisponível apenas quando a API realmente retornar erro ou dados nulos.

Exemplo:

{
  "erro": true,
  "mensagem": "Resultado da eleição não disponível.",
  "dados": null
}

--------------------------------------------------
9. VALIDAR NO NAVEGADOR
--------------------------------------------------

Testar:

/asmuv/resultado

Verificar no console que não existe mais o erro:

params is a Promise

Verificar também no Network:

Request URL

deve apontar para:

/api/v1/public/eleicao/asmuv/resultado

e a resposta deve ser processada corretamente.

--------------------------------------------------
10. TESTES
--------------------------------------------------

Cenário 1:

slug = asmuv
situacao = PUBLICADA
→ API retorna dados
→ página mostra resultado

Cenário 2:

API retorna resultado indisponível
→ mostrar mensagem amigável

Cenário 3:

acesso direto:

/asmuv/resultado

→ funcionar normalmente

Cenário 4:

recarregar página com F5
→ não gerar erro de params

--------------------------------------------------
11. NÃO ALTERAR
--------------------------------------------------

Não alterar:

- backend;
- endpoint;
- regra PUBLICADA;
- resultado ADMIN;
- login;
- sessionStorage;
- votação;
- comprovante;
- layout geral.

Ajustar somente o uso correto do slug/params e validar o tratamento da resposta.

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivo alterado;
2. se a página era Server ou Client Component;
3. como o slug foi corrigido;
4. URL final chamada pela página;
5. resultado do teste em /asmuv/resultado;
6. se o erro de params foi eliminado.

Depois disso, parar.