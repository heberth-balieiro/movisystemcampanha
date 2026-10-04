Dar continuidade ao frontend administrativo do módulo de eleição.

OBJETIVO

Adicionar uma seção/aba de Auditoria no painel ADMIN da eleição.

Página atual:

```text
/{slug}/admin/painel
```

Exemplo:

```text
/asmuv/admin/painel
```

A auditoria deve ser visível somente para usuário ADMIN autenticado.

---

## 1. API

Endpoint:

```http
GET /api/v1/eleicao/{slug}/admin/auditoria
Authorization: Bearer {token_admin}
```

Retorno atual:

```json
{
  "erro": false,
  "mensagem": "",
  "dados": [
    {
      "id": 6,
      "tipo_evento": "LOGIN_SUCESSO",
      "origem": "ELEITOR",
      "sucesso": "S",
      "descricao": "Eleitor identificado com sucesso.",
      "ip": "",
      "user_agent": "",
      "criado_em": "2026-08-16T18:33:38",
      "usuario_id": 1
    },
    {
      "id": 5,
      "tipo_evento": "LOGIN_FALHA",
      "origem": "ELEITOR",
      "sucesso": "N",
      "descricao": "Falha na identificação do eleitor.",
      "ip": "",
      "user_agent": "",
      "criado_em": "2026-08-16T18:31:45",
      "usuario_id": null
    }
  ]
}
```

Não hardcode host/IP.

Utilizar `apiFetch`.

---

## 2. TYPES

Atualizar:

```text
src/types/eleicao/index.ts
```

Criar tipos equivalentes a:

```ts
type EleicaoAuditoriaItem = {
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

type EleicaoAuditoriaResponse =
  ApiResponse<EleicaoAuditoriaItem[]>;
```

Seguir o padrão já existente no projeto.

---

## 3. SERVICE

Atualizar:

```text
src/services/eleicao/eleicao.service.ts
```

Criar função:

```text
buscarAuditoriaAdminEleicao(slug, tokenAdmin)
```

Ela deve:

* executar GET;
* enviar `token_admin`;
* retornar resposta tipada;
* não redirecionar;
* não alterar sessão.

---

## 4. PAINEL ADMIN

Atualizar:

```text
src/app/[slug]/admin/painel/page.tsx
```

Adicionar uma nova seção ou aba:

```text
Auditoria
```

Preferir manter a mesma página e organização visual atual.

Não criar uma página separada nesta etapa.

---

## 5. CARREGAMENTO

Ao abrir a seção de auditoria:

* obter `token_admin`;
* chamar `buscarAuditoriaAdminEleicao`;
* mostrar loading;
* exibir a lista retornada.

Evitar carregar a auditoria repetidamente sem necessidade.

Se a estrutura atual do painel permitir, carregar quando o usuário abrir a aba/seção.

---

## 6. CAMPOS EXIBIDOS

Mostrar na auditoria:

```text
Data/Hora
Evento
Origem
Status
Descrição
Usuário
```

Exemplo:

```text
16/08/2026 18:33

LOGIN_SUCESSO

ELEITOR

Sucesso

Eleitor identificado com sucesso.

Usuário: 1
```

Quando:

```text
usuario_id === null
```

mostrar:

```text
Usuário: Não identificado
```

---

## 7. EVENTOS

Exibir `tipo_evento` de forma legível.

Exemplos:

```text
LOGIN_SUCESSO
→ Login realizado

LOGIN_FALHA
→ Falha no login

CODIGO_ENVIADO
→ Código enviado

CODIGO_VALIDADO
→ Código validado

CODIGO_INVALIDO
→ Código inválido

VOTO_REGISTRADO
→ Voto registrado

ELEICAO_ENCERRADA
→ Eleição encerrada

APURACAO_INICIADA
→ Apuração iniciada

APURACAO_FINALIZADA
→ Apuração finalizada

RESULTADO_PUBLICADO
→ Resultado publicado
```

Criar um pequeno mapeamento no frontend.

Se aparecer um evento desconhecido, exibir o valor original.

---

## 8. ORIGEM

Exibir:

```text
ELEITOR
ADMIN
SISTEMA
```

Pode usar badge visual.

Não alterar o valor vindo da API.

---

## 9. STATUS

Quando:

```text
sucesso === "S"
```

mostrar badge:

```text
Sucesso
```

Quando:

```text
sucesso === "N"
```

mostrar:

```text
Falha
```

Não depender somente de cor.

---

## 10. DATA/HORA

Formatar:

```text
2026-08-16T18:33:38
```

para:

```text
16/08/2026 18:33
```

Seguir o padrão já utilizado no painel.

---

## 11. IP E USER-AGENT

A API já retorna:

```text
ip
user_agent
```

mas atualmente podem vir vazios.

Nesta primeira versão:

* não destacar esses campos;
* pode deixá-los disponíveis em uma área de detalhes se já houver estrutura;
* não exibir linhas vazias desnecessariamente.

Não implementar captura de IP ou User-Agent no frontend.

---

## 12. LAYOUT

Preferência para desktop:

```text
Data/Hora | Evento | Origem | Status | Descrição | Usuário
```

Pode usar tabela responsiva.

No mobile:

* transformar em cards/linhas empilhadas;
* evitar scroll horizontal excessivo.

Reutilizar componentes existentes quando possível.

---

## 13. ESTADO SEM REGISTROS

Se:

```text
dados.length === 0
```

mostrar:

```text
Nenhum evento de auditoria registrado para esta eleição.
```

Não mostrar tabela vazia quebrada.

---

## 14. LOADING

Durante a consulta:

```text
Carregando auditoria...
```

Não bloquear o restante do painel.

---

## 15. ERRO

Se a API retornar erro:

* mostrar mensagem amigável dentro da seção;
* não usar `alert()`;
* manter restante do painel funcionando.

---

## 16. TOKEN INVÁLIDO

Se o token ADMIN estiver inválido ou expirado:

* limpar somente a sessão administrativa;
* redirecionar para:

```text
/{slug}/admin/login
```

Nunca redirecionar para:

```text
/login
```

---

## 17. ATUALIZAÇÃO

Adicionar botão na seção:

```text
Atualizar auditoria
```

Ao clicar:

* chamar novamente a API;
* atualizar lista;
* mostrar estado:

```text
Atualizando...
```

---

## 18. NÃO IMPLEMENTAR NESTA ETAPA

Não implementar ainda:

```text
filtro por evento
filtro por origem
filtro por sucesso
filtro por período
paginação
exportação
PDF
captura de IP
captura de User-Agent
alterações na API
novos endpoints
```

Esses itens serão evolução posterior.

---

## 19. SEGURANÇA

Importante:

A auditoria nunca deve exibir:

```text
chapa votada
tipo do voto
BRANCO/NULO relacionado ao eleitor
comprovante relacionado ao eleitor
```

O evento:

```text
VOTO_REGISTRADO
```

deve ser exibido apenas como um evento de registro do voto, sem revelar escolha e sem tentar identificar o eleitor.

---

## 20. TESTES

### Cenário 1

ADMIN autenticado:

```text
→ abrir Auditoria
→ carregar eventos
```

### Cenário 2

Evento de sucesso:

```text
LOGIN_SUCESSO
→ status Sucesso
```

### Cenário 3

Evento de falha:

```text
LOGIN_FALHA
→ status Falha
```

### Cenário 4

`usuario_id = null`

```text
→ mostrar "Não identificado"
```

### Cenário 5

lista vazia:

```text
→ mostrar mensagem de nenhum evento
```

### Cenário 6

Atualizar auditoria:

```text
→ buscar novamente
→ atualizar lista
```

### Cenário 7

token inválido:

```text
→ limpar sessão ADMIN
→ /{slug}/admin/login
```

---

## AO FINAL

Informar somente:

1. arquivos alterados;
2. tipos adicionados;
3. função criada no service;
4. como a auditoria foi adicionada ao painel;
5. como os eventos foram traduzidos;
6. como status/origem foram exibidos;
7. tratamento de usuário nulo;
8. tratamento de loading/erro;
9. pendências encontradas.

Depois disso, parar.

Não implementar filtros ou paginação ainda.
