Ajustar o fluxo do módulo de eleição quando o eleitor já tiver registrado o voto.

Contexto:

A rota:

GET /api/v1/public/eleicao/{slug}/votacao

pode retornar:

{
  "erro": true,
  "mensagem": "Seu voto já foi registrado nesta eleição.",
  "dados": null
}

A API já está correta. Não alterar backend.

OBJETIVO

Corrigir o frontend para que essa situação NÃO direcione para:

/login

Esse é o login administrativo/catálogo.

REGRA CORRETA

1. Se a mensagem for:

"Seu voto já foi registrado nesta eleição."

Então:

- limpar a sessão específica da eleição;
- redirecionar para:

/{slug}

Exemplo:

/asmuv

2. Se o token_votacao estiver ausente, inválido ou expirado:

redirecionar para:

/{slug}/login

3. Para outros erros de negócio:

- permanecer na página;
- exibir a mensagem retornada pela API;
- não redirecionar para /login administrativo.

ARQUIVOS A ANALISAR

src/app/[slug]/votacao/page.tsx
src/services/eleicao/eleicao.service.ts
src/services/eleicao/eleicao-session.service.ts
src/services/api.ts

IMPORTANTE

Antes de alterar api.ts, verificar se realmente é necessário.

Não modificar o comportamento global do apiFetch se o problema puder ser resolvido somente no módulo de eleição.

Se houver tratamento automático de 401 redirecionando para /login, garantir que as chamadas da eleição possam tratar o erro localmente e redirecionar para /{slug}/login.

Não quebrar o catálogo ou login administrativo.

RESULTADO ESPERADO

Já votou:
→ /asmuv

Token inválido/expirado:
→ /asmuv/login

Erro comum:
→ permanece na página e mostra a mensagem

Nunca:
→ /login

Ao finalizar, informar somente:
1. arquivos alterados;
2. causa encontrada;
3. ajuste realizado;
4. comportamento final dos três cenários.

Não implementar nenhuma outra funcionalidade.