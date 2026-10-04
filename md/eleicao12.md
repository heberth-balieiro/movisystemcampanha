Ajustar somente o UX do painel administrativo da eleição.

CONTEXTO

Na página:

/{slug}/admin/painel

quando a apuração é iniciada com sucesso, aparece a mensagem:

"Apuração iniciada com sucesso."

Depois, ao abrir o modal:

"Finalizar apuração?"

essa mensagem anterior ainda continua visível dentro/ao fundo do modal.

OBJETIVO

Limpar mensagens antigas de sucesso ou erro antes de iniciar uma nova ação administrativa.

--------------------------------------------------
1. ARQUIVO PRINCIPAL
--------------------------------------------------

Atualizar:

src/app/[slug]/admin/painel/page.tsx

--------------------------------------------------
2. REGRA
--------------------------------------------------

Antes de abrir qualquer modal de ação administrativa, limpar:

- mensagem de sucesso anterior;
- mensagem de erro anterior.

Exemplos de ações:

Encerrar votação
Iniciar apuração
Finalizar apuração

--------------------------------------------------
3. COMPORTAMENTO ESPERADO
--------------------------------------------------

Exemplo atual:

Apuração iniciada com sucesso.
↓
clicar "Finalizar apuração"
↓
modal abre
↓
mensagem anterior continua aparecendo

CORRIGIR PARA:

Apuração iniciada com sucesso.
↓
clicar "Finalizar apuração"
↓
limpar mensagem anterior
↓
abrir modal limpo

--------------------------------------------------
4. MODAL
--------------------------------------------------

O modal deve mostrar somente:

Título da ação

Mensagem de confirmação

Botões:
Cancelar
Confirmar ação

Não mostrar mensagens de sucesso de ações anteriores.

--------------------------------------------------
5. NOVA MENSAGEM
--------------------------------------------------

Depois que a nova ação for executada com sucesso:

- fechar modal;
- mostrar somente a mensagem correspondente à ação atual.

Exemplo:

"Apuração finalizada com sucesso."

--------------------------------------------------
6. ERRO
--------------------------------------------------

Se a nova ação falhar:

- não mostrar mensagem antiga;
- mostrar somente o erro atual retornado pela API.

--------------------------------------------------
7. NÃO ALTERAR
--------------------------------------------------

Não alterar:

- API;
- services;
- types;
- regras de status;
- fluxo de encerramento;
- fluxo de início da apuração;
- fluxo de finalização;
- layout geral;
- gráficos;
- cards.

Ajustar apenas o estado/mensagens de UX.

--------------------------------------------------
8. TESTES
--------------------------------------------------

Testar:

1. executar uma ação com sucesso;
2. abrir outra ação;
3. verificar que a mensagem anterior foi limpa;
4. cancelar;
5. executar novamente;
6. verificar que aparece somente a mensagem da ação atual.

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivo alterado;
2. estado que foi ajustado;
3. comportamento final das mensagens.

Depois disso, parar.