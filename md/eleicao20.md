Ajustar SOMENTE o layout das páginas da eleição dentro de:

src/app/[slug]/

IMPORTANTE:
- NÃO alterar nenhuma página, componente ou layout do catálogo.
- NÃO alterar regras, API, services, types ou funcionamento.
- NÃO alterar conteúdo/textos.
- NÃO alterar fluxo da votação.
- Alterar somente apresentação, espaçamento, largura e responsividade das páginas da eleição.

OBJETIVO

Atualmente o conteúdo da eleição está muito estreito e concentrado no centro da tela, deixando grande área vazia nas laterais.

Quero aproveitar melhor a largura disponível e deixar o Sistema de Votação Digital com aparência mais profissional, moderna e consistente em desktop, tablet e mobile.

---

## 1. ESCOPO

Aplicar somente ao módulo da eleição:

/[slug]
/[slug]/login
/[slug]/confirmacao
/[slug]/votacao
/[slug]/confirma-voto
/[slug]/comprovante
/[slug]/validar-comprovante
/[slug]/resultado
/[slug]/admin/login
/[slug]/admin/painel

Priorizar alteração nos componentes compartilhados da eleição, principalmente:

src/components/eleicao/

Se existir EleicaoLayout, EleicaoHeader ou EleicaoFooter, centralizar os ajustes neles para evitar código duplicado.

NÃO tocar em componentes compartilhados com o catálogo caso isso possa alterar o catálogo.

---

## 2. LARGURA PRINCIPAL

Hoje o conteúdo está excessivamente estreito.

No desktop, aumentar a área útil para aproximadamente:

max-w-6xl ou max-w-7xl

Exemplo conceitual:

w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

Para páginas administrativas ou páginas com tabelas/gráficos, permitir uma largura maior, próxima de:

max-w-7xl

Não deixar o conteúdo ocupando 100% da tela em monitores grandes.

Manter margens laterais confortáveis.

---

## 3. RESPONSIVIDADE

Desktop:
- aproveitar melhor a largura;
- cards maiores;
- informações distribuídas horizontalmente quando fizer sentido.

Tablet:
- reduzir colunas gradualmente;
- preservar espaçamento.

Mobile:
- uma coluna;
- largura 100%;
- padding lateral adequado;
- nenhum scroll horizontal desnecessário.

---

## 4. CABEÇALHO

Manter identidade atual:

logo
"SISTEMA DE VOTAÇÃO DIGITAL"
nome da entidade quando existir

Ajustar somente espaçamento e proporção.

Evitar excesso de espaço vertical entre:

logo
título
conteúdo principal

O cabeçalho deve parecer parte de uma aplicação profissional e não uma página excessivamente vazia.

---

## 5. CONTEÚDO PRINCIPAL

Aumentar a largura dos cards principais.

Exemplo:

Antes:
conteúdo estreito centralizado.

Depois:
conteúdo ocupando uma área maior e equilibrada dentro da tela.

Não aumentar exageradamente altura dos componentes.

Priorizar organização horizontal quando houver espaço.

---

## 6. PÁGINA INICIAL DA ELEIÇÃO

Na página /[slug]:

- aumentar a largura do card da eleição;
- melhorar aproveitamento horizontal;
- manter título, descrição, situação, data e ação;
- preservar visual limpo.

Em desktop, informações podem ocupar melhor a largura do card.

---

## 7. LOGIN / CONFIRMAÇÃO

Não deixar formulário excessivamente largo.

Mesmo com layout principal maior, formulários podem continuar com largura controlada.

Exemplo:

max-w-2xl ou max-w-3xl

centralizado dentro da área maior.

Assim evitamos inputs gigantes em telas grandes.

---

## 8. VOTAÇÃO

A página da cédula deve aproveitar mais a largura.

Se houver várias chapas/candidatos:

desktop:
usar grid de 2 ou 3 colunas quando adequado.

tablet:
2 colunas.

mobile:
1 coluna.

Não alterar regra de seleção ou votação.

---

## 9. RESULTADO

A página de resultado deve aproveitar melhor desktop.

Cards de resumo:

usar grid responsivo.

Resultado por chapa e gráficos:

permitir largura maior para melhor leitura.

---

## 10. PAINEL ADMIN

Esta página deve possuir uma área maior que as demais.

Usar aproximadamente:

max-w-7xl

porque possui:

cards
gráficos
auditoria
filtros
tabelas

Evitar tabela apertada como ocorre atualmente.

Manter o conteúdo centralizado, mas utilizando melhor o monitor.

---

## 11. RODAPÉ

O rodapé também deve acompanhar a largura do conteúdo principal.

No desktop:

- distribuir melhor as colunas;
- manter bom espaçamento;
- evitar ficar excessivamente estreito no centro.

No mobile:

- empilhar seções;
- manter boa leitura.

Não alterar textos ou links.

---

## 12. ESPAÇAMENTO

Padronizar:

- distância entre header e conteúdo;
- distância entre seções;
- padding dos cards;
- margem antes do footer.

Evitar grandes espaços vazios verticais.

Usar espaçamento consistente, por exemplo:

gap-4
gap-6
space-y-6
py-6
py-8

conforme necessidade.

---

## 13. VISUAL

Manter as cores e identidade atuais.

Não redesenhar completamente a aplicação.

Objetivo é evoluir o layout atual para:

- mais profissional;
- mais amplo;
- mais equilibrado;
- melhor aproveitamento de desktop;
- excelente responsividade.

---

## 14. NÃO ALTERAR

Não alterar:

- catálogo;
- rotas;
- backend;
- API;
- autenticação;
- sessão;
- tokens;
- regras de votação;
- componentes de negócio;
- chamadas HTTP;
- textos;
- cores institucionais;
- eventos;
- filtros;
- resultados;
- auditoria.

Somente layout, largura, espaçamento, grid e responsividade.

---

## 15. CUIDADO COM O CATÁLOGO

Antes de alterar algum componente compartilhado, verificar se ele também é utilizado pelo catálogo.

Se for compartilhado:

NÃO modificar.

Criar ou ajustar somente componente específico da eleição em:

src/components/eleicao/

Nenhuma alteração visual deve aparecer nas páginas do catálogo.

---

## RESULTADO ESPERADO

Desktop:
- conteúdo mais largo;
- uso equilibrado da tela;
- painel ADMIN amplo;
- cards e tabelas com melhor leitura;
- menos espaço vazio nas laterais.

Tablet:
- reorganização automática das colunas.

Mobile:
- uma coluna;
- largura total;
- bom padding;
- sem quebra de layout.

Ao final informar somente:

1. arquivos alterados;
2. componente usado para controlar largura geral;
3. largura máxima definida;
4. ajustes específicos no ADMIN;
5. ajustes específicos nas páginas públicas;
6. comportamento desktop/tablet/mobile;
7. confirmação de que nenhuma área do catálogo foi alterada.

Depois parar.