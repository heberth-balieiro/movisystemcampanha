Implementar paginação na Auditoria do Sistema de Eleição Digital.

Projeto frontend:

C:\Projeto\Producao\EasyWeb\easyeleicao

A auditoria já funciona com filtros por:

- tipo_evento
- origem
- sucesso
- data_inicial
- data_final

Agora adicionar paginação sem alterar o comportamento existente.

==================================================
BACKEND - API DELPHI
==================================================

Endpoint atual:

GET /api/v1/eleicao/:slug/admin/auditoria

Adicionar os parâmetros opcionais:

page
limit

Exemplo:

/api/v1/eleicao/ASMUV/admin/auditoria?page=1&limit=20

Com filtros:

/api/v1/eleicao/ASMUV/admin/auditoria?origem=ELEITOR&sucesso=S&page=2&limit=20

REGRAS:

- page padrão = 1
- limit padrão = 20
- page mínimo = 1
- limit mínimo = 1
- limit máximo = 100

Se valores inválidos forem enviados, utilizar os padrões ou retornar erro de validação seguindo o padrão atual da API.

--------------------------------------------------
DAO
--------------------------------------------------

Atualizar EleicaoAuditoriaAPI.Dao.

A consulta deve continuar utilizando todos os filtros atuais.

Adicionar:

LIMIT :limit
OFFSET :offset

Cálculo:

offset := (page - 1) * limit

A ordenação deve permanecer:

ORDER BY criado_em DESC, id DESC

Também criar consulta COUNT(*) utilizando exatamente os mesmos filtros para retornar o total de registros.

Evitar duplicar lógica de filtro se possível.

--------------------------------------------------
SERVICE
--------------------------------------------------

Atualizar EleicaoAuditoriaAPI.Service para receber:

page
limit

Retornar:

- lista
- página atual
- limite
- total de registros
- total de páginas

Cálculo:

total_paginas := Ceil(total_registros / limit)

Garantir pelo menos:

page >= 1
limit entre 1 e 100

--------------------------------------------------
CONTROLLER
--------------------------------------------------

Ler:

Req.Query['page']
Req.Query['limit']

Novo retorno esperado:

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "itens": [
      {
        "id": 6,
        "tipo_evento": "LOGIN_SUCESSO",
        "origem": "ELEITOR",
        "sucesso": "S",
        "descricao": "Eleitor identificado com sucesso.",
        "ip": "192.168.15.5",
        "user_agent": "Mozilla/5.0...",
        "criado_em": "2026-08-16T18:33:38",
        "usuario_id": 1
      }
    ],
    "paginacao": {
      "pagina": 1,
      "limite": 20,
      "total_registros": 45,
      "total_paginas": 3
    }
  }
}

IMPORTANTE:

Não remover filtros existentes.

O COUNT deve respeitar os mesmos filtros da listagem.

==================================================
FRONTEND - EASYELEICAO
==================================================

Atualizar somente o projeto:

C:\Projeto\Producao\EasyWeb\easyeleicao

Não alterar o EasyCatalogo.

Atualizar os types da auditoria para o novo retorno paginado.

Exemplo conceitual:

type EleicaoAuditoriaPaginacao = {
  pagina: number;
  limite: number;
  total_registros: number;
  total_paginas: number;
};

type EleicaoAuditoriaDados = {
  itens: EleicaoAuditoriaItem[];
  paginacao: EleicaoAuditoriaPaginacao;
};

--------------------------------------------------
SERVICE FRONTEND
--------------------------------------------------

Atualizar:

buscarAuditoriaAdminEleicao

para enviar também:

page
limit

Manter todos os filtros já existentes.

Não enviar parâmetros vazios.

--------------------------------------------------
PAINEL ADMIN
--------------------------------------------------

Na aba Auditoria:

- exibir os registros da página atual;
- adicionar paginação abaixo da tabela/cards;
- manter filtros atuais;
- trocar de página sem limpar filtros.

Desktop:

[ Anterior ] Página 1 de 3 [ Próxima ]

Também mostrar:

45 registros encontrados

Mobile:

[ Anterior ]   1 / 3   [ Próxima ]

Botões precisam ser responsivos.

--------------------------------------------------
BOTÃO ANTERIOR
--------------------------------------------------

Desabilitar quando:

pagina === 1

--------------------------------------------------
BOTÃO PRÓXIMA
--------------------------------------------------

Desabilitar quando:

pagina >= total_paginas

--------------------------------------------------
ALTERAR FILTROS
--------------------------------------------------

Ao clicar em:

Filtrar

sempre voltar para:

page = 1

--------------------------------------------------
LIMPAR FILTROS
--------------------------------------------------

Ao limpar filtros:

- limpar campos;
- page = 1;
- consultar novamente.

--------------------------------------------------
ATUALIZAR AUDITORIA
--------------------------------------------------

O botão "Atualizar auditoria" deve:

- manter filtros;
- manter página atual;
- consultar novamente.

--------------------------------------------------
RESULTADO VAZIO
--------------------------------------------------

Se total_registros = 0:

Nenhum evento encontrado para os filtros informados.

Não exibir controles de paginação desnecessários.

--------------------------------------------------
RESPONSIVIDADE
--------------------------------------------------

Desktop:

manter tabela existente.

Mobile:

manter cards existentes.

A paginação precisa funcionar corretamente nos dois layouts.

--------------------------------------------------
NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar:

- paginação infinita;
- scroll infinito;
- exportação;
- PDF;
- ordenação de colunas;
- busca textual;
- novos filtros.

--------------------------------------------------
SEGURANÇA
--------------------------------------------------

Continuar preservando anonimato do evento:

VOTO_REGISTRADO

Não relacionar esse evento a:

- usuario_id
- IP
- User-Agent
- chapa
- tipo de voto
- comprovante

--------------------------------------------------
TESTES
--------------------------------------------------

Testar:

1. page=1 limit=20
2. page=2 limit=20
3. última página
4. botão Anterior
5. botão Próxima
6. filtro + paginação
7. limpar filtro
8. alterar filtro e voltar para página 1
9. atualizar mantendo página
10. auditoria sem registros
11. limit maior que 100
12. page inválido
13. desktop
14. mobile

IMPORTANTE:

Não alterar nenhuma funcionalidade já existente da eleição.

Não alterar o EasyCatalogo.

Ao final informar:

1. arquivos alterados no backend;
2. arquivos alterados no frontend;
3. formato final do retorno da API;
4. regra de page/limit;
5. implementação do COUNT;
6. funcionamento da paginação com filtros;
7. comportamento desktop/mobile;
8. testes executados;
9. pendências encontradas.

Depois parar.