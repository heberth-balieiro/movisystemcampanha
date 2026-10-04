Dar continuidade ao frontend ADMIN da eleição.

ARQUIVO PRINCIPAL:

src/app/[slug]/admin/painel/page.tsx

OBJETIVO

Adicionar filtros na aba Auditoria já existente.

A API já aceita:

GET /api/v1/eleicao/{slug}/admin/auditoria

Query params opcionais:

tipo_evento
origem
sucesso
data_inicial
data_final

Exemplo:

/api/v1/eleicao/ASMUV/admin/auditoria?origem=ELEITOR&sucesso=S&data_inicial=2026-08-16&data_final=2026-08-16

---

## 1. ALTERAR SERVICE

Atualizar a função existente:

buscarAuditoriaAdminEleicao

para receber um objeto opcional de filtros.

Exemplo conceitual:

type EleicaoAuditoriaFiltros = {
  tipo_evento?: string;
  origem?: string;
  sucesso?: string;
  data_inicial?: string;
  data_final?: string;
};

Montar query string somente com campos preenchidos.

Não enviar parâmetros vazios.

Continuar usando apiFetch e token ADMIN.

---

## 2. FILTROS NA ABA AUDITORIA

Adicionar acima da tabela/cards:

- Evento
- Origem
- Status
- Data inicial
- Data final

Layout desktop:

Evento | Origem | Status | Data inicial | Data final | Filtrar | Limpar

No mobile, empilhar os campos.

---

## 3. EVENTO

Usar select.

Opções:

Todos
Login realizado
Falha no login
Código enviado
Código validado
Código inválido
Voto registrado
Eleição encerrada
Apuração iniciada
Apuração finalizada
Resultado publicado

Valores enviados:

LOGIN_SUCESSO
LOGIN_FALHA
CODIGO_ENVIADO
CODIGO_VALIDADO
CODIGO_INVALIDO
VOTO_REGISTRADO
ELEICAO_ENCERRADA
APURACAO_INICIADA
APURACAO_FINALIZADA
RESULTADO_PUBLICADO

---

## 4. ORIGEM

Select:

Todas
Eleitor
Admin
Sistema

Valores:

ELEITOR
ADMIN
SISTEMA

---

## 5. STATUS

Select:

Todos
Sucesso
Falha

Valores:

S
N

---

## 6. DATAS

Utilizar:

<input type="date" />

Estados:

dataInicial
dataFinal

Enviar exatamente no formato:

YYYY-MM-DD

---

## 7. BOTÃO FILTRAR

Ao clicar em:

Filtrar

executar novamente:

buscarAuditoriaAdminEleicao

passando os filtros atuais.

Durante consulta mostrar:

Filtrando...

Não bloquear o restante do painel.

---

## 8. BOTÃO LIMPAR

Adicionar botão:

Limpar filtros

Ao clicar:

- limpar todos os campos;
- consultar novamente a auditoria sem filtros.

---

## 9. VALIDAÇÃO

Antes de consultar:

se dataInicial e dataFinal estiverem preenchidas e:

dataFinal < dataInicial

mostrar mensagem dentro da aba:

"A data final não pode ser menor que a data inicial."

Não chamar a API nesse caso.

---

## 10. ESTADO

Criar estados equivalentes a:

filtroTipoEvento
filtroOrigem
filtroSucesso
filtroDataInicial
filtroDataFinal

Não aplicar filtro local em auditoria.filter().

IMPORTANTE:

Os filtros devem ser enviados para o backend.

A API é responsável pela filtragem.

---

## 11. CONSULTA INICIAL

Ao abrir a aba Auditoria pela primeira vez:

buscar sem filtros.

Ao voltar para a aba, manter os filtros preenchidos.

Não disparar consulta repetidamente sem necessidade.

---

## 12. ATUALIZAR AUDITORIA

O botão já existente:

Atualizar auditoria

deve atualizar usando os filtros atualmente selecionados.

Não limpar os filtros ao atualizar.

---

## 13. RESULTADO VAZIO

Quando houver filtros aplicados e nenhum resultado:

mostrar:

"Nenhum evento encontrado para os filtros informados."

Quando não houver filtro:

"Nenhum evento de auditoria registrado para esta eleição."

---

## 14. VISUAL

Manter o padrão atual do painel.

Não redesenhar tabela/cards existentes.

Os filtros devem ficar dentro de um bloco discreto acima da listagem, por exemplo:

rounded-lg border p-4

Título opcional:

Filtros

---

## 15. NÃO IMPLEMENTAR

Não implementar ainda:

paginação
exportação
PDF
ordenadores de coluna
busca por descrição
busca por usuário
filtro por IP
filtro por User-Agent
novas rotas
alterações backend

---

## 16. SEGURANÇA

Continuar sem exibir ou inferir:

chapa escolhida
tipo de voto relacionado ao eleitor
comprovante relacionado ao eleitor

VOTO_REGISTRADO continua anônimo.

---

## 17. TESTAR

Validar:

1. sem filtro;
2. somente origem ELEITOR;
3. somente origem ADMIN;
4. somente sucesso S;
5. somente sucesso N;
6. LOGIN_SUCESSO;
7. intervalo de datas;
8. filtros combinados;
9. limpar filtros;
10. data final menor que inicial;
11. resultado vazio;
12. atualizar auditoria mantendo filtros.

---

AO FINAL

Informar:

1. arquivos alterados;
2. tipos adicionados;
3. como a query string foi montada;
4. estados criados;
5. filtros adicionados;
6. validação de datas;
7. comportamento do botão Filtrar;
8. comportamento do botão Limpar;
9. comportamento do botão Atualizar auditoria;
10. pendências encontradas.

Depois parar.