Dê continuidade ao módulo de ELEIÇÃO / VOTAÇÃO DIGITAL já implementado no frontend EasyCatalogo.

A página pública através do slug já está funcionando e agora temos a rota REAL de identificação/login do associado.

Nesta tarefa, implementar SOMENTE:

**CPF + Matrícula → API → identificação → armazenamento do token_identificacao → redirecionamento para /{slug}/confirmacao**

Não implementar ainda:

* envio de código;
* OTP;
* validação de código;
* chapa;
* candidatos;
* votação;
* confirmação de voto;
* comprovante real.

---

# 1. ROTA REAL DE LOGIN

Endpoint:

```text
POST /api/v1/public/eleicao/{slug}/login
```

Exemplo em ambiente atual:

```text
POST /api/v1/public/eleicao/ASMUV/login
```

O host atual da API é:

```text
http://192.168.15.10:9000
```

Porém:

**NÃO hardcode esse IP no módulo.**

Utilizar a configuração/base URL e o `apiFetch` já existentes no EasyCatalogo, da mesma forma utilizada na integração pública da eleição.

---

# 2. BODY REAL

A API recebe:

```json
{
  "cpf": "86017233220",
  "matricula": "1234561"
}
```

Os dois campos são strings.

Não enviar:

* empresa_id;
* eleicao_id;
* usuario_id;
* nome;
* qualquer outro campo.

O contexto é identificado pelo `slug`.

---

# 3. RETORNO REAL DE SUCESSO

```json
{
  "erro": false,
  "mensagem": "Identificação realizada com sucesso.",
  "dados": {
    "token_identificacao": "eyJ...",
    "identificado": "S",
    "nome": "João da Silva"
  }
}
```

IMPORTANTE:

`identificado` é string e o valor esperado para sucesso é:

```text
S
```

Não alterar esse contrato no frontend.

---

# 4. RETORNO REAL DE ERRO

```json
{
  "erro": true,
  "mensagem": "Não foi possível validar os dados informados.",
  "dados": null
}
```

Esse erro deve ser apresentado de maneira amigável no formulário.

Não informar se:

* CPF estava errado;
* matrícula estava errada;
* pessoa estava inativa;
* usuário estava inativo.

Utilizar somente a mensagem genérica retornada pela API.

---

# 5. ANALISAR IMPLEMENTAÇÃO EXISTENTE

Antes de alterar o código, revisar:

```text
src/app/[slug]/login/page.tsx
src/app/[slug]/confirmacao/page.tsx
src/services/eleicao/eleicao.service.ts
src/types/eleicao/index.ts
src/components/eleicao/
```

Também verificar como o EasyCatalogo atualmente:

* armazena tokens;
* trata sessões;
* utiliza apiFetch;
* trata loading em formulários;
* apresenta erros;
* aplica máscara em CPF.

Reutilizar padrões existentes sempre que possível.

Não criar arquitetura paralela desnecessária.

---

# 6. CRIAR TIPOS DO LOGIN

Atualizar:

```text
src/types/eleicao/index.ts
```

Criar interfaces equivalentes a:

```ts
interface EleicaoLoginRequest {
  cpf: string;
  matricula: string;
}

interface EleicaoLoginDados {
  token_identificacao: string;
  identificado: string;
  nome: string;
}

interface EleicaoLoginResponse {
  erro: boolean;
  mensagem: string;
  dados: EleicaoLoginDados | null;
}
```

Seguir a nomenclatura/padrão já existente no arquivo.

Não inventar propriedades.

---

# 7. IMPLEMENTAR SERVICE DE LOGIN

Atualizar:

```text
src/services/eleicao/eleicao.service.ts
```

Criar função para:

```text
POST /api/v1/public/eleicao/{slug}/login
```

Nome sugerido:

```text
loginEleicao
```

ou equivalente consistente com os services existentes.

A função deve receber:

```text
slug
cpf
matricula
```

Reutilizar `apiFetch`.

Utilizar `encodeURIComponent(slug)`.

Não:

* redirecionar dentro do service;
* manipular DOM;
* mostrar toast dentro do service;
* armazenar token dentro do service.

O service apenas realiza a comunicação e retorna o resultado tipado.

---

# 8. ALTERAR PÁGINA DE LOGIN

Atualizar:

```text
src/app/[slug]/login/page.tsx
```

Substituir os campos temporários:

```text
A definir
```

por campos reais:

```text
CPF
Matrícula
```

Layout esperado:

```text
Identificação do associado

Para continuar, informe seus dados cadastrados junto à entidade.

CPF
[ ___.___.___-__ ]

Matrícula
[________________]

[ Continuar ]

Seus dados de identificação serão utilizados
para validar sua participação nesta votação.
```

Manter o padrão visual profissional já implementado.

---

# 9. CAMPO CPF

Aplicar máscara visual:

```text
000.000.000-00
```

Porém, antes de enviar para a API, remover caracteres não numéricos.

Exemplo:

Usuário digita:

```text
860.172.332-20
```

API recebe:

```text
86017233220
```

Não instalar biblioteca nova somente para máscara.

Reutilizar utilitário existente se houver.

Caso não exista, criar uma função pequena e isolada.

Validar no frontend:

* obrigatório;
* 11 dígitos após remover máscara.

Não fazer validação matemática do CPF nesta tarefa, a menos que o projeto já possua utilitário pronto.

A validação definitiva continua sendo da API.

---

# 10. CAMPO MATRÍCULA

Matrícula deve ser tratada como string.

Não converter para Number no frontend.

Isso é importante para não perder possíveis zeros à esquerda futuramente.

Validar apenas:

* obrigatório;
* remover espaços no início/fim.

Não inventar tamanho máximo sem contrato definido.

---

# 11. SUBMIT

Ao clicar:

```text
Continuar
```

Executar:

```text
POST /api/v1/public/eleicao/{slug}/login
```

com:

```json
{
  "cpf": "somente números",
  "matricula": "valor informado"
}
```

Durante a chamada:

* desabilitar botão;
* impedir múltiplos submits;
* mostrar estado de carregamento;
* manter campos bloqueados somente se isso estiver alinhado ao padrão existente.

Texto do botão pode mudar temporariamente para:

```text
Validando...
```

ou utilizar Loading existente.

---

# 12. SUCESSO

Considerar sucesso somente quando:

```text
erro === false
```

e:

```text
dados !== null
```

e:

```text
dados.identificado === "S"
```

e existir:

```text
dados.token_identificacao
```

No sucesso:

1. guardar o `token_identificacao`;
2. guardar somente os dados mínimos necessários para a próxima tela;
3. redirecionar para:

```text
/{slug}/confirmacao
```

Exemplo:

```text
/ASMUV/confirmacao
```

Não adicionar:

* id_usuario;
* id_empresa;
* id_eleicao;
* token na URL;
* CPF na URL;
* matrícula na URL.

---

# 13. ARMAZENAMENTO DO TOKEN_IDENTIFICACAO

Antes de implementar, verificar como o EasyCatalogo já armazena tokens de autenticação/sessão.

Se existir um padrão apropriado, reutilizá-lo.

O `token_identificacao`:

* é temporário;
* será utilizado nas próximas rotas protegidas da eleição;
* NÃO deve ser colocado em querystring;
* NÃO deve ser colocado no pathname;
* NÃO deve ser exibido no console.

Se o projeto NÃO tiver uma estratégia existente adequada para esse fluxo, utilizar `sessionStorage` nesta etapa, e não `localStorage`, pois o token pertence à sessão temporária daquela aba.

Sugestão de chave isolada:

```text
eleicao_token_identificacao
```

Pode também ser necessário guardar:

```text
eleicao_nome_associado
```

para mostrar o nome na próxima página, mas apenas se realmente necessário.

Não armazenar:

* CPF;
* matrícula.

IMPORTANTE:
deixar essa implementação centralizada em um helper/service de sessão do módulo, se necessário, evitando chamadas de `sessionStorage` espalhadas pelas páginas.

---

# 14. NOME DO ASSOCIADO

A API retorna:

```json
{
  "nome": "João da Silva"
}
```

Esse nome poderá ser usado na página seguinte.

Não precisa mostrar mensagem exagerada no login.

Após sucesso, redirecionar diretamente.

Na próxima página poderemos mostrar futuramente:

```text
Olá, João da Silva
```

Mas não implementar fluxo de código ainda.

---

# 15. ERRO DE IDENTIFICAÇÃO

Quando a API retornar:

```text
erro = true
```

mostrar no próprio formulário:

```text
Não foi possível validar os dados informados.
```

Não redirecionar.

Não limpar os campos automaticamente.

Permitir que o usuário corrija os dados.

Dar foco visual adequado ao erro.

Não utilizar `alert()` do navegador.

Reutilizar componente de mensagem/alerta existente.

---

# 16. ERRO DE COMUNICAÇÃO

Diferenciar erro da API de falha inesperada de comunicação.

Se houver falha de rede/servidor:

mostrar algo como:

```text
Não foi possível realizar a identificação no momento. Tente novamente.
```

Não mostrar:

* stack;
* status técnico;
* URL;
* JSON;
* exception;
* IP da API.

---

# 17. PREVENÇÃO DE DUPLO SUBMIT

Durante o request:

```text
isLoading = true
```

O botão deve ficar desabilitado.

O usuário não deve conseguir disparar múltiplos logins rapidamente clicando várias vezes.

Ao finalizar:

```text
isLoading = false
```

salvo se já ocorreu redirecionamento.

---

# 18. PÁGINA DE CONFIRMAÇÃO

Atualizar somente o necessário em:

```text
src/app/[slug]/confirmacao/page.tsx
```

para receber um usuário que veio corretamente do login.

Ainda NÃO implementar:

* envio de código;
* input de código;
* reenviar código;
* timer;
* WhatsApp;
* e-mail;
* SMS.

Por enquanto pode exibir uma estrutura semelhante a:

```text
Confirmação de identidade

Olá, João da Silva.

Sua identificação foi realizada com sucesso.

Na próxima etapa será realizada uma confirmação adicional de segurança.
```

Manter o layout profissional existente.

Não mostrar:

* token;
* CPF;
* matrícula.

---

# 19. PROTEGER ACESSO DIRETO À CONFIRMAÇÃO

A página:

```text
/{slug}/confirmacao
```

não deve ser acessível normalmente sem um `token_identificacao` disponível na sessão.

Se o usuário digitar diretamente:

```text
/ASMUV/confirmacao
```

sem ter realizado identificação:

redirecionar para:

```text
/ASMUV/login
```

Nesta etapa essa é apenas uma proteção de fluxo/UX.

A segurança definitiva continuará sendo validada pelas próximas rotas da API através do token.

---

# 20. NÃO PROTEGER AINDA AS OUTRAS PÁGINAS

Nesta tarefa não implementar proteção de:

```text
/{slug}/votacao
/{slug}/confirma-voto
/{slug}/comprovante
```

Isso será feito conforme as respectivas rotas forem desenvolvidas.

---

# 21. PRESERVAR O SLUG

O slug deve acompanhar todo o fluxo.

Exemplo:

```text
/ASMUV
    ↓
/ASMUV/login
    ↓
/ASMUV/confirmacao
```

Não normalizar obrigatoriamente para outro valor visual.

Para chamada à API utilizar o slug recebido na rota.

---

# 22. ESCOPO PROIBIDO

Não implementar nesta tarefa:

* código OTP;
* geração de código;
* envio WhatsApp;
* envio SMS;
* envio de e-mail;
* token de votação;
* chapa;
* candidatos;
* voto;
* branco;
* nulo;
* registro de voto;
* confirmação de voto;
* comprovante.

---

# 23. TESTES MANUAIS ESPERADOS

Validar:

### Cenário 1 — dados corretos

Acessar:

```text
/ASMUV/login
```

Informar CPF válido e matrícula válida.

Esperado:

```text
POST /api/v1/public/eleicao/ASMUV/login
```

Sucesso:

```text
token_identificacao armazenado
↓
redireciona para
/ASMUV/confirmacao
```

### Cenário 2 — CPF incorreto

API retorna erro.

Esperado:

* permanece no login;
* mostra mensagem amigável;
* permite corrigir.

### Cenário 3 — matrícula incorreta

Mesmo comportamento do CPF incorreto.

Não revelar qual campo estava incorreto.

### Cenário 4 — usuário inativo

Mesmo erro genérico.

### Cenário 5 — acessar confirmação diretamente

Sem token:

```text
/ASMUV/confirmacao
```

Esperado:

```text
redireciona para /ASMUV/login
```

### Cenário 6 — clicar várias vezes em Continuar

Deve ocorrer somente uma solicitação durante o loading.

---

# 24. VALIDAÇÃO TÉCNICA

Após implementar:

1. executar eslint somente nos arquivos alterados;
2. verificar erros TypeScript causados por esta implementação;
3. não corrigir erros globais antigos do EasyCatalogo;
4. não alterar service de segmento;
5. não alterar login administrativo;
6. não modificar a rota pública da eleição que já está funcionando.

---

# AO FINAL

Informar:

1. arquivos alterados;
2. tipos criados;
3. função de login criada no service;
4. como CPF foi mascarado e normalizado;
5. como matrícula foi tratada;
6. como `token_identificacao` foi armazenado;
7. como o nome foi preservado para a próxima tela;
8. como erros da API foram tratados;
9. como erro de comunicação foi tratado;
10. como o acesso direto a `/confirmacao` foi tratado;
11. como ficou o redirecionamento após sucesso;
12. pendências encontradas.

Depois disso, PARE.

Não avançar para geração/envio do código de confirmação.
