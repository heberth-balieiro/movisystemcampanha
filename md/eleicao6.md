Ajustar somente o UX da página de login da eleição.

Contexto:

Quando a API retornar:

{
  "erro": true,
  "mensagem": "Seu voto já foi registrado nesta eleição.",
  "dados": null
}

a tela atualmente exibe corretamente a mensagem e o botão:

"Voltar para eleição"

Porém o botão:

"Continuar"

continua disponível.

OBJETIVO

Melhorar apenas o comportamento visual/UX desse cenário.

REGRA

Quando a mensagem retornada for exatamente:

"Seu voto já foi registrado nesta eleição."

fazer:

1. ocultar ou desabilitar o botão "Continuar";
2. manter visível a mensagem de erro/informação;
3. manter visível o botão "Voltar para eleição";
4. o botão "Voltar para eleição" deve navegar para:

/{slug}

Exemplo:

/asmuv

IMPORTANTE

- Não alterar API.
- Não alterar regra de login.
- Não alterar fluxo de confirmação.
- Não alterar sessionStorage.
- Não alterar outros erros.
- Para qualquer outro erro de login, o botão "Continuar" deve continuar funcionando normalmente.
- Não redirecionar automaticamente.
- Não alterar layout geral da página.

ARQUIVO PRINCIPAL

src/app/[slug]/login/page.tsx

Se necessário, analisar componentes já usados na página, mas evitar alterações fora do necessário.

RESULTADO ESPERADO

Associado ainda não votou:
→ botão "Continuar" normal

Erro comum:
→ exibe erro
→ botão "Continuar" continua disponível

Associado já votou:
→ exibe "Seu voto já foi registrado nesta eleição."
→ botão "Continuar" fica oculto ou desabilitado
→ botão "Voltar para eleição" permanece disponível

Ao finalizar, informar somente:
1. arquivo alterado;
2. ajuste realizado;
3. comportamento final.