---
name: movisystem-suite
description: Skill única para trabalhar de forma integrada nos repositórios MoviSystem Hub, MoviSystem API, MoviSystem Service e MoviSystem Campanha. Use em novas demandas que envolvam Delphi desktop, API Horse, serviços de integração, frontend Next.js, votação, assembleia, autenticação, relatórios, sincronização e contratos entre sistemas.
---

# MoviSystem Suite

## Objetivo

Atuar de forma coordenada nos quatro repositórios da suíte MoviSystem, escolhendo o projeto correto para cada demanda, preservando os contratos já existentes e evitando alterações paralelas desnecessárias.

Esta skill é a referência única de trabalho para:

```text
heberth-balieiro/movisystemhub
heberth-balieiro/movisystemapi
heberth-balieiro/movisystemservice
heberth-balieiro/movisystemcampanha
```

## Regra principal de Git

A base de trabalho é sempre:

```text
develop
```

Nunca usar `Producao`, `main`, `master` ou outra branch como base sem solicitação explícita.

Antes de qualquer alteração:

1. consultar a `develop` atual do repositório envolvido;
2. não confiar em SHA salvo nesta skill ou em conversa anterior;
3. ler os arquivos atuais diretamente do Git;
4. confirmar a arquitetura real antes de criar arquivo, rota, campo ou contrato;
5. fazer a menor alteração necessária.

Depois de qualquer alteração:

1. commit direto na `develop`, salvo instrução diferente;
2. não reescrever histórico compartilhado;
3. não usar force push;
4. consultar novamente a branch;
5. informar o HEAD exato do repositório alterado.

Se a demanda envolver mais de um repositório, gerar commits separados por projeto.

## Como escolher o repositório

### MoviSystem Hub

Repositório:

```text
heberth-balieiro/movisystemhub
```

Responsabilidade principal:

- aplicação Delphi desktop/backoffice;
- telas e formulários administrativos;
- DataModules e acesso local a dados;
- modelos e relatórios desktop;
- migrations locais e integração com estruturas do sistema legado.

Estrutura observada:

```text
DM/
Form/
Migrations/
Model/
ModelRelatorio/
```

Use este projeto quando a demanda mencionar tela Delphi, cadastro desktop, relatório local, rotina administrativa do sistema instalado ou integração originada no desktop.

Antes de criar nova pasta/unit no Hub, verificar a organização atual e reutilizar o padrão já existente.

### MoviSystem API

Repositório:

```text
heberth-balieiro/movisystemapi
```

Responsabilidade principal:

- API Delphi/Horse;
- autenticação e JWT;
- contratos HTTP;
- regras de negócio server-side;
- acesso ao banco;
- eleição, votação, assembleia, relatórios, auditoria e administração pública/privada.

Projeto principal:

```text
EasyOneAPI.dpr
```

Estrutura principal:

```text
src/Core/
src/Middlewares/
src/EleicaoDescktop/Controller/
src/EleicaoDescktop/Dao/
src/EleicaoDescktop/Service/
src/EleicaoDescktop/Model/
src/EleicaoDescktop/Routes/
src/EleicaoDescktop/Migrations/
src/EleicaoDescktop/Seeds/
```

### REGRA CRÍTICA DE UNITS

Nunca criar unit `.pas` nova na raiz do `movisystemapi`.

Toda unit nova deve ficar dentro da estrutura correta de `src`.

Antes de criar uma unit:

1. identificar módulo e responsabilidade;
2. escolher `Controller`, `Dao`, `Service`, `Model`, `Routes`, `Migrations`, `Seeds` ou outra pasta já existente;
3. se houver dúvida entre dois destinos, perguntar ao usuário antes de criar;
4. adicionar referência explícita no `EasyOneAPI.dpr` quando necessário.

Units antigas ainda existentes na raiz são dívida técnica. Não criar novas cópias como workaround de compilação. Quando houver tarefa de limpeza, mover para a pasta correta, ajustar referências e somente depois excluir a unit antiga.

### MoviSystem Service

Repositório:

```text
heberth-balieiro/movisystemservice
```

Responsabilidade principal:

- EasyBot/serviço Delphi;
- rotinas automáticas e de integração;
- sincronizações com APIs externas;
- processos executados fora da interface web e do desktop principal.

Projeto principal:

```text
Easybot.dpr
```

Estrutura observada:

```text
Form/
Units/
```

Em integrações HTTP/JSON:

- preservar UTF-8 de ponta a ponta;
- usar o mecanismo HTTP já adotado pelo projeto;
- evitar logs temporários com payload sensível;
- remover logs de diagnóstico depois da validação;
- não alterar contratos externos sem evidência da necessidade.

### MoviSystem Campanha

Repositório:

```text
heberth-balieiro/movisystemcampanha
```

Responsabilidade principal:

- frontend web de campanhas/eleição;
- Next.js + React + TypeScript;
- telas públicas e administrativas;
- sessão no navegador;
- consumo da API.

Stack atual:

```text
Next.js 16
React 19
TypeScript
Tailwind CSS
```

Estrutura principal:

```text
src/app/
src/components/
src/lib/
src/services/
src/types/
src/utils/
```

Estrutura eleitoral mais usada:

```text
src/app/[slug]/
src/components/eleicao/
src/services/eleicao/
src/types/eleicao/
```

Antes de editar, reutilizar componentes, helpers, services e tipos existentes.

## Fluxo entre os quatro projetos

Quando surgir uma demanda, identificar primeiro onde está a origem real do problema.

Exemplos:

- erro HTTP, `400`, `401`, `500`, contrato ou SQL: investigar API primeiro;
- botão, card, layout, sessão no navegador ou payload enviado: Campanha;
- tela Delphi ou rotina administrativa local: Hub;
- sincronização, job, EasyBot ou integração automática: Service.

Se o problema atravessar mais de um projeto:

1. localizar o contrato produtor;
2. localizar o consumidor;
3. verificar payload real dos dois lados;
4. corrigir no ponto responsável;
5. só alterar os dois lados quando o contrato realmente precisar mudar.

Não duplicar regra de negócio no frontend quando ela pertence à API.

## Padrões Delphi/API

- Ler a unit atual antes de modificar.
- Reutilizar `App.Response`, `App.Errors`, `App.Token`, `App.JWT`, `Database.Connection` e demais abstrações existentes quando aplicável.
- Preservar filtro por `empresa_id` e contexto multi-tenant.
- Em eleição, validar `slug` e pertencimento do token.
- Não inventar tabela, coluna ou campo JSON sem consultar o código/migration atual.
- SQL longo deve ser quebrado em concatenações seguras para evitar limitações do compilador Delphi.
- Não resolver erro `F2613` copiando unit para a raiz.
- Se uma nova unit precisar entrar no projeto, preferir caminho explícito no `.dpr`.

## Logs e informações sensíveis

Nunca registrar em console/log:

- senha;
- token JWT completo;
- Authorization header;
- OTP/código de confirmação bruto;
- voto do eleitor;
- payload contendo dado sensível sem sanitização.

Logs HTTP globais podem registrar apenas informações operacionais seguras, por exemplo:

```text
DATA [API] INICIO METHOD /path
DATA [API] FIM METHOD /path -> HTTP 200
```

## Regras eleitorais que não podem regredir

- Não criar associação pública ou auditável entre eleitor e voto.
- `VOTO_REGISTRADO` permanece anônimo.
- Não expor resultado parcial enquanto a eleição estiver `ABERTA`.
- Resultado público somente quando permitido pelo estado da eleição, especialmente `PUBLICADA`.
- Se apuração ainda não estiver disponível, preferir resposta segura/vazia a expor parcial.
- Sem regra formal de desempate, não escolher vencedor automaticamente.
- Tokens de identificação, votação e administração são contextos diferentes.
- Token deve pertencer ao `slug` da eleição.

### Confirmação do eleitor

Fluxo esperado:

1. não enviar código automaticamente ao entrar na tela;
2. eleitor escolhe WhatsApp ou e-mail;
3. e-mail pode ser escolhido como primeiro canal;
4. WhatsApp pode ser escolhido como primeiro canal;
5. `Falar com a entidade` é ajuda separada, não fallback automático;
6. nova identificação deve permitir nova confirmação mesmo que uma sessão anterior tenha sido confirmada;
7. erros públicos devem ser sanitizados.

### Fotos e mídia

- Não voltar a embutir foto Base64 na cédula JSON.
- JSON deve trazer metadados/URL de mídia.
- Foto deve ser carregada por rota separada e cacheável.
- No frontend, usar carregamento lazy quando aplicável.
- Evitar assets pesados quando CSS/SVG resolve o mesmo objetivo.

## Regras do frontend Campanha

Rotas eleitorais comuns:

```text
/{slug}
/{slug}/login
/{slug}/confirmacao
/{slug}/votacao
/{slug}/confirma-voto
/{slug}/comprovante
/{slug}/validar-comprovante
/{slug}/resultado
/{slug}/admin/login
/{slug}/admin/painel
```

Não usar `basePath: "/votacao"`.

Sessão:

- dados temporários devem ser isolados por `slug`;
- limpar somente a sessão correspondente;
- não redirecionar para `/login` genérico quando existe rota contextual;
- preservar separação entre sessão do eleitor e sessão administrativa.

API/frontend:

- `apiFetch` é o padrão quando já usado no fluxo;
- não inventar propriedade para resolver UI;
- conferir primeiro o tipo e o service atuais;
- manter media URLs separadas de Base64.

UX:

- desktop, tablet e mobile;
- sem scroll horizontal desnecessário;
- foco visível e labels acessíveis;
- estados não devem depender apenas de cor;
- não redesenhar partes não solicitadas.

## Validação

### Delphi

Não afirmar que compilou se a compilação Delphi não foi executada.

Quando não houver compilador disponível:

- revisar sintaxe e dependências por inspeção;
- informar que a validação final de build/runtime deve ser feita no ambiente Delphi do usuário.

### Frontend

Executar, quando realmente disponível:

```text
npm run build
npm run lint
```

Se não executar, não afirmar que executou.

### Runtime

Nunca afirmar que endpoint, tela, banco ou integração foi validado em execução se só houve revisão estática.

## Processo obrigatório para cada nova demanda

1. identificar qual dos quatro repositórios participa da demanda;
2. consultar a `develop` mais recente de cada repositório relevante;
3. buscar os arquivos reais envolvidos;
4. rastrear o fluxo completo antes de concluir a causa;
5. evitar hipóteses quando o Git pode confirmar;
6. propor/realizar a menor correção possível;
7. preservar contratos existentes quando possível;
8. verificar efeitos colaterais entre Hub, API, Service e Campanha;
9. commitar somente nos repositórios realmente alterados;
10. consultar novamente a branch e informar HEAD final.

## Criação de arquivos novos

Antes de criar qualquer arquivo novo, confirmar se a estrutura já possui local apropriado.

Para Delphi, especialmente na API:

- nunca criar `.pas` na raiz;
- se o destino não estiver claro, perguntar ao usuário antes da criação.

Para frontend:

- componente de eleição: `src/components/eleicao`;
- service de eleição: `src/services/eleicao`;
- tipo de eleição: `src/types/eleicao`;
- página: dentro da rota correta em `src/app/[slug]`.

Não criar estrutura paralela sem necessidade.

## Resposta final após alterações

Responder de forma objetiva com:

1. causa encontrada;
2. repositório(s) alterado(s);
3. arquivo(s) alterado(s);
4. o que foi implementado;
5. commit de cada repositório;
6. HEAD final confirmado;
7. testes realmente executados;
8. qualquer validação que ainda dependa do ambiente do usuário.

Não adicionar funcionalidades fora da demanda atual.
