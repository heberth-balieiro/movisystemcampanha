Dar continuidade ao módulo de eleição no frontend EasyCatalogo.

OBJETIVO

Implementar o acesso administrativo da eleição e o painel de acompanhamento.

Criar:

/{slug}/admin/login
/{slug}/admin/painel

Exemplo:

/asmuv/admin/login
/asmuv/admin/painel

O painel deve ser acessível somente por usuário com role:

ADMIN

--------------------------------------------------
1. API DE LOGIN ADMIN
--------------------------------------------------

Endpoint:

POST /api/v1/eleicao/{slug}/admin/login

Body:

{
  "email": "admin@empresa.com.br",
  "senha": "123456"
}

Retorno de sucesso:

{
  "erro": false,
  "mensagem": "Login realizado com sucesso.",
  "dados": {
    "token": "eyJ...",
    "nome": "Administrador"
  }
}

Retorno de erro:

{
  "erro": true,
  "mensagem": "Usuário ou senha inválidos.",
  "dados": null
}

Não hardcode host/IP.

Utilizar apiFetch.

--------------------------------------------------
2. API DO PAINEL
--------------------------------------------------

Endpoint:

GET /api/v1/eleicao/{slug}/admin/painel

Header:

Authorization: Bearer {token_admin}

Retorno atual:

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "eleicao": {
      "id": 3,
      "nome": "Eleição Diretoria 2026",
      "situacao": "ABERTA",
      "data_hora_inicio": "2026-08-15T08:00:00",
      "data_hora_fim": "2026-08-15T17:00:00"
    },
    "resumo": {
      "total_eleitores": 1,
      "total_votantes": 1,
      "total_nao_votantes": 0,
      "percentual_participacao": 100
    },
    "evolucao": [
      {
        "hora": "00:00",
        "quantidade": 1,
        "acumulado": 1
      }
    ]
  }
}

--------------------------------------------------
3. REGRA IMPORTANTE
--------------------------------------------------

Enquanto a eleição estiver:

ABERTA

NÃO mostrar:

- votos por chapa;
- votos brancos;
- votos nulos;
- ranking;
- resultado parcial;
- percentual por candidato.

O painel deve mostrar somente dados de PARTICIPAÇÃO.

--------------------------------------------------
4. TYPES
--------------------------------------------------

Atualizar:

src/types/eleicao/index.ts

Criar tipos para:

EleicaoAdminLoginRequest
EleicaoAdminLoginDados
EleicaoAdminLoginResponse

EleicaoAdminPainelEleicao
EleicaoAdminPainelResumo
EleicaoAdminPainelEvolucao
EleicaoAdminPainelDados
EleicaoAdminPainelResponse

Seguir o padrão já existente.

--------------------------------------------------
5. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar:

loginAdminEleicao(slug, email, senha)

buscarPainelAdminEleicao(slug, tokenAdmin)

O service deve:

- apenas chamar API;
- não redirecionar;
- não armazenar token;
- retornar dados tipados.

--------------------------------------------------
6. SESSION SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao-session.service.ts

Adicionar chave:

eleicao_token_admin

Adicionar também:

eleicao_nome_admin

Criar funções equivalentes a:

salvarSessaoAdmin(token, nome)
obterTokenAdmin()
obterNomeAdmin()
limparSessaoAdmin()

Usar:

sessionStorage

Não usar localStorage.

Não misturar com:

eleicao_token_identificacao
eleicao_token_votacao

--------------------------------------------------
7. PÁGINA ADMIN LOGIN
--------------------------------------------------

Criar:

src/app/[slug]/admin/login/page.tsx

Campos:

E-mail
Senha

Botão:

Entrar no painel

Fluxo:

email + senha
→ POST admin/login
→ sucesso
→ salvar token_admin
→ salvar nome
→ /{slug}/admin/painel

--------------------------------------------------
8. VALIDAÇÕES LOGIN
--------------------------------------------------

Validar:

- e-mail obrigatório;
- senha obrigatória.

Durante request:

- desabilitar botão;
- mostrar "Entrando...";
- impedir múltiplos submits.

Erros da API devem aparecer na própria página.

Não usar alert().

--------------------------------------------------
9. ACESSO DIRETO AO PAINEL
--------------------------------------------------

Se acessar:

/{slug}/admin/painel

sem:

eleicao_token_admin

redirecionar para:

/{slug}/admin/login

--------------------------------------------------
10. PÁGINA DO PAINEL
--------------------------------------------------

Criar:

src/app/[slug]/admin/painel/page.tsx

Ao carregar:

1. obter slug;
2. obter token_admin;
3. chamar buscarPainelAdminEleicao;
4. exibir loading;
5. montar painel.

--------------------------------------------------
11. CABEÇALHO
--------------------------------------------------

Mostrar:

Eleição Diretoria 2026

Situação:
ABERTA

Início:
15/08/2026 08:00

Fim:
15/08/2026 17:00

Mostrar também nome do administrador logado.

Exemplo:

Olá, Heberth Diego Balieiro

--------------------------------------------------
12. CARDS
--------------------------------------------------

Criar 4 cards:

Eleitores aptos
→ total_eleitores

Votos registrados
→ total_votantes

Ainda não votaram
→ total_nao_votantes

Participação
→ percentual_participacao %

Exemplo:

[ 500 ]
Eleitores aptos

[ 327 ]
Votos registrados

[ 173 ]
Ainda não votaram

[ 65,4% ]
Participação

--------------------------------------------------
13. GRÁFICO DE PARTICIPAÇÃO
--------------------------------------------------

Criar gráfico de rosca/donut:

Votaram
Não votaram

Usar:

total_votantes
total_nao_votantes

Não inventar novos dados.

--------------------------------------------------
14. GRÁFICO DE EVOLUÇÃO
--------------------------------------------------

Criar gráfico de linha ou barras usando:

evolucao[]

Exemplo:

08:00 → quantidade 20
09:00 → quantidade 45
10:00 → quantidade 55

Também pode usar:

acumulado

Preferência:

- barras para quantidade por hora;
- linha para acumulado, se a biblioteca atual permitir com simplicidade.

Não complicar o layout.

--------------------------------------------------
15. BIBLIOTECA DE GRÁFICOS
--------------------------------------------------

Antes de instalar qualquer biblioteca:

verificar package.json e dependências atuais.

Se já existir biblioteca de gráfico, reutilizar.

Se não existir, utilizar uma biblioteca leve e compatível com Next.js/React, preferencialmente:

Recharts

Mas somente instalar se realmente necessário.

Não adicionar dependência sem necessidade.

--------------------------------------------------
16. ESTADO SEM DADOS
--------------------------------------------------

Se:

evolucao.length === 0

mostrar:

Ainda não há votos registrados para exibir evolução.

Não renderizar gráfico vazio quebrado.

--------------------------------------------------
17. ATUALIZAÇÃO DO PAINEL
--------------------------------------------------

Nesta primeira versão:

NÃO criar atualização automática.

Adicionar botão:

Atualizar dados

Ao clicar:

→ chamar novamente a API
→ atualizar cards e gráficos

Mostrar:

Atualizando...

--------------------------------------------------
18. LOGOUT
--------------------------------------------------

Adicionar botão:

Sair

Ao clicar:

- limpar sessão administrativa;
- redirecionar para:

/{slug}/admin/login

Não limpar a sessão pública da eleição.

--------------------------------------------------
19. TOKEN INVÁLIDO
--------------------------------------------------

Se a API retornar não autorizado:

- limpar somente sessão ADMIN;
- redirecionar para:

/{slug}/admin/login

Nunca redirecionar para:

/login

Esse é o login administrativo do catálogo e não pertence a este fluxo.

--------------------------------------------------
20. UX / RESPONSIVIDADE
--------------------------------------------------

O painel deve funcionar bem em:

desktop
tablet
mobile

Desktop:

4 cards na mesma linha quando houver espaço.

Mobile:

cards empilhados ou 2 por linha.

Gráficos devem ocupar largura disponível.

--------------------------------------------------
21. VISUAL
--------------------------------------------------

Manter identidade visual já usada no módulo de eleição.

O painel pode ter visual mais administrativo, porém mantendo:

- tipografia;
- cores;
- bordas;
- espaçamento;
- padrão do projeto.

Não criar design completamente diferente do restante da eleição.

--------------------------------------------------
22. SEGURANÇA VISUAL
--------------------------------------------------

Não exibir em nenhum lugar:

- chapa escolhida;
- voto branco;
- voto nulo;
- usuário relacionado a voto;
- resultado parcial.

O painel é somente de participação.

--------------------------------------------------
23. NÃO IMPLEMENTAR
--------------------------------------------------

Não implementar:

- apuração;
- resultado;
- votos por chapa;
- ranking;
- publicação de resultado;
- relatório PDF;
- atualização automática;
- validação de horário;
- tela de usuários;
- configuração da eleição.

A validação de horário da evolução será feita depois na API.

--------------------------------------------------
24. TESTES
--------------------------------------------------

Login correto:
→ salva token
→ abre painel

Senha errada:
→ mostra mensagem
→ permanece login

Sem token:
→ /admin/painel
→ /admin/login

Painel:
→ mostra dados da eleição
→ mostra 4 cards
→ mostra gráficos

Atualizar:
→ recarrega dados

Sair:
→ limpa token admin
→ volta login admin

Token inválido:
→ limpa sessão admin
→ /{slug}/admin/login

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivos criados;
2. arquivos alterados;
3. tipos adicionados;
4. funções adicionadas no service;
5. funções adicionadas no session service;
6. como funciona o login admin;
7. como funciona o painel;
8. quais gráficos foram implementados;
9. como foi tratado logout/token inválido;
10. se foi necessário instalar biblioteca;
11. pendências encontradas.

Depois disso, parar.

Não implementar outras funcionalidades da eleição.