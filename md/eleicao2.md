Dê continuidade ao módulo de ELEIÇÃO / VOTAÇÃO DIGITAL já implementado no frontend EasyCatalogo.

A etapa anterior já está concluída:

- página pública por slug funcionando;
- login com CPF + matrícula funcionando;
- `token_identificacao` sendo salvo em `sessionStorage`;
- após login o usuário é direcionado para:

```text
/{slug}/confirmacao
```

Agora implementar a etapa REAL de confirmação por código enviado via WhatsApp.

IMPORTANTE:
As duas rotas da API já estão prontas e foram testadas com sucesso no Postman.

Não criar mocks.
Não inventar endpoints.
Não alterar o backend.
Não implementar ainda chapas, candidatos ou registro do voto.

---

# FLUXO DESTA ETAPA

```text
/{slug}/confirmacao
        ↓
token_identificacao
        ↓
solicitar código
        ↓
API gera código
        ↓
API envia WhatsApp
        ↓
usuário recebe código
        ↓
digita 6 dígitos
        ↓
validar código
        ↓
API retorna token_votacao
        ↓
salvar token_votacao
        ↓
/{slug}/votacao
```

---

# 1. ANALISAR IMPLEMENTAÇÃO EXISTENTE

Antes de alterar qualquer código, revisar:

```text
src/app/[slug]/confirmacao/page.tsx
src/services/eleicao/eleicao.service.ts
src/services/eleicao/eleicao-session.service.ts
src/types/eleicao/index.ts
src/components/eleicao/
```

Também verificar os componentes já existentes:

```text
Button
Input
Icon
EleicaoLayout
EleicaoMensagem
EleicaoLoading
```

Reutilizar a estrutura existente.

Não recriar componentes desnecessariamente.

---

# 2. TOKEN DE IDENTIFICAÇÃO

O login já armazena:

```text
eleicao_token_identificacao
```

através do:

```text
src/services/eleicao/eleicao-session.service.ts
```

A página `/confirmacao` deve utilizar esse token.

Se não existir token:

```text
/{slug}/confirmacao
```

deve redirecionar para:

```text
/{slug}/login
```

Não colocar token em:

- URL;
- querystring;
- cookie criado manualmente;
- console.

---

# 3. ROTA REAL — SOLICITAR CÓDIGO

Endpoint:

```text
POST /api/v1/public/eleicao/{slug}/confirmacao/solicitar-codigo
```

Header:

```text
Authorization: Bearer {token_identificacao}
```

Não possui body.

Exemplo:

```text
POST /api/v1/public/eleicao/ASMUV/confirmacao/solicitar-codigo
```

IMPORTANTE:

Não hardcode host/IP.

Utilizar `apiFetch` já existente.

---

# 4. RETORNO DA SOLICITAÇÃO

Retorno de sucesso:

```json
{
  "erro": false,
  "mensagem": "Código de confirmação enviado.",
  "dados": {
    "enviado": "S",
    "destino": "(**) *****-3320",
    "expira_em_segundos": 300,
    "reenviar_em_segundos": 60
  }
}
```

A API pode também retornar sucesso informando que já existe código enviado recentemente, mantendo os tempos restantes.

Portanto o frontend deve respeitar sempre os valores recebidos em:

```text
expira_em_segundos
reenviar_em_segundos
```

Não assumir sempre 300 e 60.

---

# 5. ROTA REAL — VALIDAR CÓDIGO

Endpoint:

```text
POST /api/v1/public/eleicao/{slug}/confirmacao/validar-codigo
```

Header:

```text
Authorization: Bearer {token_identificacao}
```

Body:

```json
{
  "codigo": "483921"
}
```

O campo:

```text
codigo
```

deve ser enviado como string.

---

# 6. RETORNO DA VALIDAÇÃO

Sucesso:

```json
{
  "erro": false,
  "mensagem": "Código confirmado com sucesso.",
  "dados": {
    "confirmado": "S",
    "token_votacao": "eyJ..."
  }
}
```

Erro:

A API pode retornar algo como:

```json
{
  "erro": true,
  "mensagem": "Código inválido ou expirado.",
  "dados": null
}
```

O frontend deve apresentar a mensagem retornada de forma amigável.

---

# 7. TIPOS TYPESCRIPT

Atualizar:

```text
src/types/eleicao/index.ts
```

Criar os tipos necessários.

Sugestão:

```ts
export type EleicaoSolicitarCodigoDados = {
  enviado: string;
  destino: string;
  expira_em_segundos: number;
  reenviar_em_segundos: number;
};

export type EleicaoSolicitarCodigoResponse =
  ApiResponse<Nullable<EleicaoSolicitarCodigoDados>>;

export type EleicaoValidarCodigoRequest = {
  codigo: string;
};

export type EleicaoValidarCodigoDados = {
  confirmado: string;
  token_votacao: string;
};

export type EleicaoValidarCodigoResponse =
  ApiResponse<Nullable<EleicaoValidarCodigoDados>>;
```

Seguir o padrão já utilizado no arquivo.

Não inventar campos.

---

# 8. SERVICE — SOLICITAR CÓDIGO

Atualizar:

```text
src/services/eleicao/eleicao.service.ts
```

Criar função equivalente a:

```text
solicitarCodigoConfirmacao(slug, tokenIdentificacao)
```

A função deve:

1. receber `slug`;
2. receber `token_identificacao`;
3. executar POST;
4. enviar Authorization Bearer através do parâmetro `token` do `apiFetch`;
5. não possuir body;
6. retornar resposta tipada.

Exemplo conceitual:

```ts
apiFetch<EleicaoSolicitarCodigoDados | null>(
  `/api/v1/public/eleicao/${encodeURIComponent(slug)}/confirmacao/solicitar-codigo`,
  {
    method: "POST",
    token: tokenIdentificacao,
  }
);
```

Não armazenar token dentro do service.

Não redirecionar dentro do service.

---

# 9. SERVICE — VALIDAR CÓDIGO

Criar função equivalente a:

```text
validarCodigoConfirmacao(slug, tokenIdentificacao, codigo)
```

Executar:

```text
POST /api/v1/public/eleicao/{slug}/confirmacao/validar-codigo
```

Body:

```json
{
  "codigo": "123456"
}
```

Utilizar:

```text
token: tokenIdentificacao
```

Não utilizar token administrativo do EasyCatalogo.

---

# 10. SESSION SERVICE

Atualizar:

```text
src/services/eleicao/eleicao-session.service.ts
```

Hoje já existem:

```text
eleicao_token_identificacao
eleicao_nome_associado
```

Adicionar:

```text
eleicao_token_votacao
```

Criar funções equivalentes a:

```ts
salvarTokenVotacao(...)
obterTokenVotacao(...)
removerTokenIdentificacao(...)
limparSessaoEleicao(...)
```

`limparSessaoEleicao` deve remover:

```text
eleicao_token_identificacao
eleicao_token_votacao
eleicao_nome_associado
```

Não utilizar `localStorage`.

Continuar utilizando `sessionStorage`.

---

# 11. PÁGINA DE CONFIRMAÇÃO

Atualizar:

```text
src/app/[slug]/confirmacao/page.tsx
```

A página deve ser Client Component.

Fluxo ao carregar:

```text
carregou página
     ↓
obtém token_identificacao
     ↓
não existe?
     ↓
/{slug}/login
```

Se existir:

```text
solicitar código automaticamente
```

---

# 12. SOLICITAR CÓDIGO AUTOMATICAMENTE

Ao entrar na página pela primeira vez:

```text
/{slug}/confirmacao
```

chamar automaticamente:

```text
solicitarCodigoConfirmacao(...)
```

Utilizar `useEffect` de forma correta.

IMPORTANTE:

React Strict Mode em desenvolvimento pode executar efeitos mais de uma vez.

Evitar disparar requisições duplicadas desnecessariamente pelo frontend.

Porém a proteção definitiva contra múltiplos envios já existe na API.

Não criar loops de request.

---

# 13. ESTADO DE CARREGAMENTO INICIAL

Enquanto solicita o código:

mostrar algo como:

```text
Preparando confirmação...
```

ou utilizar `EleicaoLoading`.

Não mostrar ainda os inputs de código antes de a API responder.

---

# 14. TELA APÓS ENVIO

Quando:

```text
dados.enviado === "S"
```

mostrar:

```text
Confirmação de identidade

Olá, João da Silva.

Enviamos um código de confirmação para seu WhatsApp:

(**) *****-3320

Digite o código recebido para continuar.
```

Utilizar o nome já armazenado na sessão:

```text
eleicao_nome_associado
```

Não mostrar:

- telefone completo;
- token;
- CPF;
- matrícula.

---

# 15. INPUT DO CÓDIGO

O código possui:

```text
6 dígitos
```

Criar uma experiência simples e profissional.

Pode utilizar:

- um único input visualmente preparado para 6 números;

OU

- seis campos individuais.

Escolha a solução mais estável e simples dentro do padrão atual do projeto.

Requisitos:

```text
inputMode="numeric"
```

Aceitar somente números.

Limitar a:

```text
6 dígitos
```

Permitir colar o código completo.

Não converter para Number.

Manter como string.

---

# 16. BOTÃO CONFIRMAR

Criar botão:

```text
Confirmar código
```

Somente permitir envio quando houver exatamente 6 dígitos.

Durante a validação:

```text
Validando...
```

Desabilitar botão.

Impedir múltiplos submits.

---

# 17. VALIDAR CÓDIGO

Ao confirmar:

```text
POST validar-codigo
```

com:

```json
{
  "codigo": "123456"
}
```

Considerar sucesso somente quando:

```text
erro === false
dados !== null
dados.confirmado === "S"
dados.token_votacao existe
```

---

# 18. APÓS CONFIRMAÇÃO CORRETA

No sucesso:

1. salvar:

```text
token_votacao
```

2. remover:

```text
token_identificacao
```

3. preservar nome do associado por enquanto;

4. redirecionar para:

```text
/{slug}/votacao
```

Exemplo:

```text
/ASMUV/votacao
```

Não colocar token na URL.

---

# 19. ERRO DE CÓDIGO

Se a API retornar:

```text
Código inválido ou expirado.
```

mostrar a mensagem no próprio formulário.

Não limpar automaticamente o código se isso prejudicar a experiência.

Pode selecionar/focar o campo para permitir nova tentativa.

Não utilizar `alert()`.

---

# 20. EXPIRAÇÃO DO CÓDIGO

A API retorna:

```text
expira_em_segundos
```

Criar contador visual.

Exemplo:

```text
Código válido por 04:32
```

O contador serve apenas para UX.

A validação oficial continua sendo feita pela API.

Quando chegar a zero:

mostrar algo como:

```text
Código expirado.
Solicite um novo código.
```

Não tentar validar automaticamente.

---

# 21. CONTADOR DE REENVIO

Utilizar:

```text
reenviar_em_segundos
```

Enquanto maior que zero:

```text
Reenviar código em 42s
```

Quando chegar a zero:

habilitar:

```text
Reenviar código
```

---

# 22. REENVIAR CÓDIGO

Ao clicar em:

```text
Reenviar código
```

chamar novamente:

```text
solicitarCodigoConfirmacao(...)
```

A API decidirá se um novo envio é permitido.

Após resposta:

atualizar:

```text
destino
expira_em_segundos
reenviar_em_segundos
```

Limpar erro anterior.

Pode limpar o campo do código no reenvio.

---

# 23. NÃO CONFIAR SOMENTE NO CONTADOR FRONTEND

Mesmo que o botão esteja disponível:

a API continua sendo a autoridade sobre reenvio.

Se a API responder que ainda existe código recente:

usar os novos tempos recebidos.

Não criar lógica paralela de segurança no navegador.

---

# 24. ERRO AO SOLICITAR CÓDIGO

Se a solicitação inicial falhar:

mostrar estado amigável:

```text
Não foi possível enviar o código de confirmação.
```

e botão:

```text
Tentar novamente
```

Não redirecionar imediatamente para login, salvo se o problema for ausência de token.

---

# 25. TOKEN EXPIRADO / 401

ATENÇÃO:

O `apiFetch` atual possui comportamento global para HTTP 401 e pode redirecionar para:

```text
/login
```

que é o login administrativo do EasyCatalogo.

NÃO permitir que o fluxo de eleição seja enviado incorretamente para `/login`.

Antes de alterar o `apiFetch`, analisar cuidadosamente o impacto global.

Preferir uma solução isolada para o módulo de eleição, sem quebrar o comportamento atual do catálogo.

Se for necessário alterar o `apiFetch` para suportar opção como:

```text
redirectOnUnauthorized: false
```

fazer de maneira retrocompatível:

- comportamento atual permanece como padrão;
- somente o módulo de eleição desabilita o redirect global;
- então a página de eleição pode redirecionar corretamente para:

```text
/{slug}/login
```

Não quebrar nenhuma chamada existente.

Se não for necessário alterar o `apiFetch`, não alterar.

---

# 26. TOKEN_IDENTIFICACAO EXPIRADO

Se o token não existir ou estiver inválido/expirado:

limpar sessão da eleição e redirecionar para:

```text
/{slug}/login
```

Não redirecionar para login administrativo.

---

# 27. ACESSO DIRETO À VOTAÇÃO

Nesta tarefa, fazer uma proteção simples de fluxo em:

```text
src/app/[slug]/votacao/page.tsx
```

Se não existir:

```text
eleicao_token_votacao
```

não permitir exibir a futura tela de votação.

Redirecionar para:

```text
/{slug}/login
```

ou, se ainda existir token de identificação válido, para:

```text
/{slug}/confirmacao
```

Escolher a opção mais coerente com a sessão existente.

Não implementar a votação ainda.

---

# 28. BOTÃO VOLTAR / SAIR

Na página de confirmação pode existir opção discreta:

```text
Voltar
```

Se o usuário optar por sair do fluxo:

- limpar sessão da eleição;
- retornar para:

```text
/{slug}
```

Não deixar token de votação/identificação antigo ativo no frontend.

---

# 29. DESIGN

Manter o padrão visual profissional já aprovado.

Estrutura sugerida:

```text
Confirmação de identidade

Olá, João da Silva.

Enviamos um código para seu WhatsApp:

(**) *****-3320

[ código de 6 dígitos ]

Código válido por 04:35

[ Confirmar código ]

Não recebeu?
Reenviar código em 42s
```

No celular:

- inputs confortáveis;
- botão largura total;
- boa área de toque;
- contador legível.

Não criar visual excessivamente complexo.

---

# 30. ACESSIBILIDADE

Garantir:

- label do código;
- `inputMode="numeric"`;
- mensagens com `role="alert"` quando necessário;
- botão desabilitado durante requests;
- estados não dependentes somente de cor;
- foco adequado após erro.

---

# 31. NÃO IMPLEMENTAR NESTA ETAPA

Não implementar:

- busca de chapas;
- candidatos;
- membros;
- voto;
- voto em branco;
- voto nulo;
- registro de voto;
- confirmação definitiva do voto;
- comprovante;
- resultado da eleição.

A página:

```text
/{slug}/votacao
```

continua apenas estrutural/protegida.

---

# 32. CENÁRIOS PARA TESTE

### Cenário 1 — fluxo normal

```text
/ASMUV/login
↓
login correto
↓
/ASMUV/confirmacao
↓
código enviado automaticamente
↓
usuário recebe WhatsApp
↓
digita código correto
↓
token_votacao salvo
↓
/ASMUV/votacao
```

### Cenário 2 — código errado

Esperado:

- permanecer em `/confirmacao`;
- mostrar erro;
- permitir nova tentativa.

### Cenário 3 — código expirado

Esperado:

- mostrar erro;
- permitir reenviar.

### Cenário 4 — reenviar antes do tempo

A API pode devolver os tempos restantes.

Frontend deve atualizar os contadores.

### Cenário 5 — reenviar após o tempo

API envia novo código.

Frontend reinicia contadores.

### Cenário 6 — acessar confirmação sem token

```text
/ASMUV/confirmacao
```

Esperado:

```text
/ASMUV/login
```

### Cenário 7 — acessar votação sem token_votacao

```text
/ASMUV/votacao
```

Não deve liberar o conteúdo futuro da votação.

---

# 33. VALIDAÇÃO TÉCNICA

Após implementar:

1. executar ESLint somente nos arquivos alterados;
2. verificar erros TypeScript causados por esta tarefa;
3. não corrigir erros globais antigos fora do módulo;
4. não alterar backend;
5. não alterar contrato das rotas;
6. não alterar login administrativo;
7. não alterar página pública que já funciona.

---

# AO FINAL

Informar:

1. arquivos alterados;
2. tipos criados;
3. funções adicionadas no service;
4. funções adicionadas no session service;
5. como o código é solicitado automaticamente;
6. como o destino mascarado é exibido;
7. como o código de 6 dígitos foi implementado;
8. como os contadores funcionam;
9. como o reenvio funciona;
10. como erros foram tratados;
11. como `token_votacao` foi armazenado;
12. como `token_identificacao` foi removido;
13. como o redirecionamento para `/votacao` funciona;
14. como acesso direto sem token foi tratado;
15. se foi necessário alterar `apiFetch` para tratar 401;
16. eventuais pendências encontradas.

Depois disso, PARE.

Não avançar para implementação da votação.