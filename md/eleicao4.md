Dar continuidade ao módulo de eleição no frontend EasyCatalogo.

A API de registro do voto já está pronta e testada para:

- voto em CHAPA;
- voto BRANCO;
- voto NULO;
- bloqueio de segundo voto;
- bloqueio de tipo inválido.

## Objetivo

Completar o fluxo:

```text
/{slug}/votacao
      ↓
Selecionar CHAPA / BRANCO / NULO
      ↓
Continuar
      ↓
/{slug}/confirma-voto
      ↓
Confirmar
      ↓
POST /votacao/votar
      ↓
/{slug}/comprovante
```

---

## 1. API de registro

Endpoint:

```http
POST /api/v1/public/eleicao/{slug}/votacao/votar
Authorization: Bearer {token_votacao}
```

### Voto em chapa

```json
{
  "tipo_voto": "CHAPA",
  "id_chapa": 2
}
```

### Branco

```json
{
  "tipo_voto": "BRANCO"
}
```

### Nulo

```json
{
  "tipo_voto": "NULO"
}
```

Sucesso:

```json
{
  "erro": false,
  "mensagem": "Voto registrado com sucesso.",
  "dados": {
    "confirmado": "S",
    "comprovante": "34DBE05EA9B0AE07..."
  }
}
```

Erro de segundo voto:

```json
{
  "erro": true,
  "mensagem": "Seu voto já foi registrado nesta eleição.",
  "dados": null
}
```

---

## 2. Types

Atualizar:

```text
src/types/eleicao/index.ts
```

Criar tipos para:

```ts
type TipoVoto = "CHAPA" | "BRANCO" | "NULO";

type EleicaoRegistrarVotoRequest = {
  tipo_voto: TipoVoto;
  id_chapa?: number;
};

type EleicaoRegistrarVotoDados = {
  confirmado: string;
  comprovante: string;
};

type EleicaoRegistrarVotoResponse =
  ApiResponse<Nullable<EleicaoRegistrarVotoDados>>;
```

Seguir o padrão atual do projeto.

---

## 3. Service

Atualizar:

```text
src/services/eleicao/eleicao.service.ts
```

Criar função:

```text
registrarVoto(slug, tokenVotacao, dados)
```

Deve:

- usar `apiFetch`;
- executar POST;
- enviar `token_votacao`;
- enviar JSON;
- não realizar redirecionamento dentro do service.

---

## 4. Session service

Atualizar:

```text
src/services/eleicao/eleicao-session.service.ts
```

Adicionar suporte temporário para armazenar a seleção antes da confirmação.

Sugestão:

```text
eleicao_voto_selecao
eleicao_comprovante
```

A seleção deve conter somente o necessário:

```ts
{
  tipo_voto: "CHAPA" | "BRANCO" | "NULO";
  id_chapa?: number;
  numero_chapa?: number;
  nome_chapa?: string;
}
```

Usar `sessionStorage`.

Não colocar seleção na URL.

Criar funções para:

- salvar seleção;
- obter seleção;
- remover seleção;
- salvar comprovante;
- obter comprovante.

---

## 5. Página de votação

Atualizar:

```text
src/app/[slug]/votacao/page.tsx
```

Hoje já existem cards de chapas e seleção visual.

Adicionar duas opções adicionais:

```text
Voto em Branco
Voto Nulo
```

Essas opções devem aparecer visualmente junto às opções de voto, mas claramente diferenciadas das chapas.

Permitir selecionar somente uma opção:

```text
CHAPA
OU
BRANCO
OU
NULO
```

Ao selecionar uma nova opção, remover a seleção anterior.

---

## 6. Seleção de chapa

Ao clicar em uma chapa, armazenar:

```ts
{
  tipo_voto: "CHAPA",
  id_chapa: chapa.id,
  numero_chapa: chapa.numero,
  nome_chapa: chapa.nome
}
```

---

## 7. Seleção em branco

Ao selecionar branco:

```ts
{
  tipo_voto: "BRANCO"
}
```

Não enviar `id_chapa`.

---

## 8. Seleção nula

Ao selecionar nulo:

```ts
{
  tipo_voto: "NULO"
}
```

Não enviar `id_chapa`.

---

## 9. Botão Continuar

O botão:

```text
Continuar
```

deve ficar habilitado somente quando existir uma seleção.

Ao clicar:

1. salvar seleção no `sessionStorage`;
2. navegar para:

```text
/{slug}/confirma-voto
```

Não registrar o voto ainda.

---

## 10. Página de confirmação

Atualizar:

```text
src/app/[slug]/confirma-voto/page.tsx
```

Essa página deve obter:

- `token_votacao`;
- seleção armazenada.

Se não existir `token_votacao`:

```text
/{slug}/login
```

Se não existir seleção:

```text
/{slug}/votacao
```

---

## 11. Confirmação de CHAPA

Quando for:

```text
CHAPA
```

mostrar claramente:

```text
Confirme seu voto

Chapa 01
Chapa Renovação

Você confirma esta escolha?
```

Criar:

```text
[ Voltar ]
[ Confirmar voto ]
```

---

## 12. Confirmação de BRANCO

Mostrar:

```text
Confirme seu voto

Você selecionou:

VOTO EM BRANCO

Deseja confirmar?
```

---

## 13. Confirmação de NULO

Mostrar:

```text
Confirme seu voto

Você selecionou:

VOTO NULO

Deseja confirmar?
```

---

## 14. Botão Voltar

O botão:

```text
Voltar
```

deve retornar para:

```text
/{slug}/votacao
```

sem registrar nada.

Pode manter a seleção anterior para facilitar correção.

---

## 15. Confirmar voto

Ao clicar em:

```text
Confirmar voto
```

executar a API.

Para CHAPA:

```json
{
  "tipo_voto": "CHAPA",
  "id_chapa": 2
}
```

Para BRANCO:

```json
{
  "tipo_voto": "BRANCO"
}
```

Para NULO:

```json
{
  "tipo_voto": "NULO"
}
```

---

## 16. Evitar voto duplicado pelo frontend

Durante a requisição:

- desabilitar os botões;
- mostrar `Registrando voto...`;
- impedir duplo clique;
- não executar duas requisições simultâneas.

A proteção definitiva continua sendo feita pela API.

---

## 17. Sucesso

Considerar sucesso somente se:

```text
erro === false
dados !== null
dados.confirmado === "S"
dados.comprovante existe
```

Após sucesso:

1. salvar `comprovante`;
2. remover seleção do voto;
3. remover `token_votacao`;
4. navegar para:

```text
/{slug}/comprovante
```

---

## 18. Página de comprovante

Atualizar:

```text
src/app/[slug]/comprovante/page.tsx
```

Mostrar:

```text
Voto registrado com sucesso

Seu voto foi recebido e registrado.

Comprovante:
34DBE05EA9B0AE07...

Guarde este comprovante caso necessário.
```

Importante:

**não mostrar em quem o usuário votou.**

Não mostrar:

- nome da chapa;
- branco;
- nulo;
- candidato escolhido.

O comprovante deve preservar o sigilo do voto.

---

## 19. Acesso ao comprovante

Se não existir comprovante em sessão, não mostrar comprovante fictício.

Redirecionar para:

```text
/{slug}
```

ou mostrar mensagem de comprovante indisponível seguindo o padrão atual.

---

## 20. Erros da API

Se retornar:

```text
Seu voto já foi registrado nesta eleição.
```

mostrar essa mensagem de forma amigável.

Não permitir nova tentativa de registro.

Se apropriado, direcionar o usuário para uma tela informando que o voto já foi registrado.

Para outros erros:

- permanecer na confirmação;
- exibir a mensagem retornada;
- permitir tentar novamente quando fizer sentido.

Não usar `alert()`.

---

## 21. Token inválido

Se a API retornar acesso não autorizado:

- limpar sessão da eleição;
- redirecionar para:

```text
/{slug}/login
```

Nunca redirecionar para `/login` administrativo.

---

## 22. Visual

Manter o padrão atual da eleição.

Na votação:

```text
[ Chapa 01 ]
[ Chapa 02 ]

Outras opções

[ Voto em Branco ]
[ Voto Nulo ]

[ Continuar ]
```

A seleção deve ficar visualmente clara.

Priorizar experiência mobile.

---

## 23. Não implementar

Não implementar nesta tarefa:

- apuração;
- resultado;
- percentual;
- ranking;
- foto dos candidatos;
- alteração da API;
- novo endpoint;
- compartilhamento do comprovante;
- download de PDF.

---

## 24. Testes obrigatórios

### CHAPA

```text
seleciona chapa
→ continuar
→ confirma chapa correta
→ confirmar voto
→ sucesso
→ comprovante
```

### BRANCO

```text
seleciona branco
→ continuar
→ confirma voto em branco
→ sucesso
→ comprovante
```

### NULO

```text
seleciona nulo
→ continuar
→ confirma voto nulo
→ sucesso
→ comprovante
```

### Voltar

```text
seleciona chapa
→ continuar
→ voltar
→ retorna à votação
→ nenhum voto registrado
```

### Duplo clique

```text
confirmar voto
→ botão bloqueado durante requisição
→ apenas uma chamada
```

### Segundo voto

Se a API responder:

```text
Seu voto já foi registrado nesta eleição.
```

mostrar mensagem apropriada.

---

## Ao finalizar

Informar somente:

1. arquivos alterados;
2. tipos criados;
3. função criada no service;
4. como CHAPA/BRANCO/NULO foram implementados;
5. como funciona a tela de confirmação;
6. como o voto é enviado;
7. como o comprovante é armazenado e exibido;
8. como token e sessão são tratados;
9. pendências encontradas.

Depois disso, parar.