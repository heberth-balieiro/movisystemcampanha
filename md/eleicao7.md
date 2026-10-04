Dar continuidade ao módulo de eleição no frontend EasyCatalogo.

OBJETIVO

Implementar a consulta pública de comprovante de votação.

Criar a página:

/{slug}/validar-comprovante

Exemplo:

/asmuv/validar-comprovante

A consulta é pública e NÃO exige login ou token.

--------------------------------------------------
1. API
--------------------------------------------------

Endpoint:

POST /api/v1/public/eleicao/{slug}/comprovante/validar

Body:

{
  "comprovante": "5A4F93CCA09328C96FF36555BC69F3666..."
}

Não hardcode URL/IP.

Utilizar o apiFetch já existente.

--------------------------------------------------
2. RETORNO VÁLIDO
--------------------------------------------------

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "valido": "S",
    "eleicao": "Eleição Diretoria 2026",
    "registrado_em": "2026-08-15T00:33:42"
  }
}

Mostrar:

Comprovante válido

Este comprovante corresponde a um voto registrado.

Eleição:
Eleição Diretoria 2026

Registrado em:
15/08/2026 00:33

IMPORTANTE:

NÃO mostrar:

- chapa;
- candidato;
- voto branco;
- voto nulo;
- usuário;
- CPF;
- matrícula.

A validação deve preservar totalmente o sigilo do voto.

--------------------------------------------------
3. RETORNO INVÁLIDO
--------------------------------------------------

{
  "erro": false,
  "mensagem": "",
  "dados": {
    "valido": "N"
  }
}

Mostrar claramente:

Comprovante não encontrado

Não foi localizado um voto registrado com o comprovante informado para esta eleição.

Permitir nova consulta.

--------------------------------------------------
4. COMPROVANTE NÃO INFORMADO
--------------------------------------------------

A API pode retornar:

{
  "erro": true,
  "mensagem": "Comprovante não informado.",
  "dados": null
}

Mostrar a mensagem no formulário.

Não usar alert().

--------------------------------------------------
5. TYPES
--------------------------------------------------

Atualizar:

src/types/eleicao/index.ts

Criar tipos equivalentes a:

type EleicaoValidarComprovanteRequest = {
  comprovante: string;
};

type EleicaoValidarComprovanteDados = {
  valido: string;
  eleicao?: string;
  registrado_em?: string;
};

type EleicaoValidarComprovanteResponse =
  ApiResponse<Nullable<EleicaoValidarComprovanteDados>>;

Seguir o padrão já existente no projeto.

--------------------------------------------------
6. SERVICE
--------------------------------------------------

Atualizar:

src/services/eleicao/eleicao.service.ts

Criar função:

validarComprovante(slug, comprovante)

Ela deve:

- executar POST;
- enviar o comprovante;
- não enviar token;
- retornar resposta tipada;
- não realizar redirecionamento.

--------------------------------------------------
7. NOVA PÁGINA
--------------------------------------------------

Criar:

src/app/[slug]/validar-comprovante/page.tsx

A página deve utilizar o padrão visual existente do módulo de eleição.

Reutilizar:

EleicaoLayout
Button
Input
EleicaoMensagem

e demais componentes existentes quando aplicável.

--------------------------------------------------
8. FORMULÁRIO
--------------------------------------------------

Exibir:

Validar comprovante

Consulte se o comprovante recebido após a votação está registrado nesta eleição.

Campo:

Comprovante

Botão:

Validar comprovante

O campo deve aceitar o hash completo retornado pela API após o voto.

Aplicar:

trim()

Não alterar o conteúdo do comprovante além de normalização necessária para envio.

--------------------------------------------------
9. LOADING
--------------------------------------------------

Durante a consulta:

- desabilitar botão;
- impedir múltiplas requisições;
- exibir:

Validando comprovante...

--------------------------------------------------
10. RESULTADO VÁLIDO
--------------------------------------------------

Criar um estado visual positivo contendo:

✓ Comprovante válido

Eleição Diretoria 2026

Voto registrado em:
15/08/2026 às 00:33

Adicionar texto:

A validação confirma somente que este comprovante pertence a um voto registrado. Por segurança e sigilo, a opção escolhida não é exibida.

--------------------------------------------------
11. RESULTADO INVÁLIDO
--------------------------------------------------

Criar estado visual diferente:

Comprovante não encontrado

Verifique o código informado e tente novamente.

Não tratar comprovante inválido como erro técnico.

--------------------------------------------------
12. NOVA CONSULTA
--------------------------------------------------

Depois de consultar, permitir:

Consultar outro comprovante

Ao clicar:

- limpar resultado;
- limpar campo;
- focar novamente no input.

--------------------------------------------------
13. RESPONSIVIDADE
--------------------------------------------------

Priorizar uso em celular.

O hash pode ser longo.

Garantir que:

- não ultrapasse a largura da tela;
- possa quebrar linha quando necessário;
- input seja confortável para colar o comprovante.

--------------------------------------------------
14. LINK NA PÁGINA PRINCIPAL
--------------------------------------------------

Atualizar a página pública:

src/app/[slug]/page.tsx

Adicionar uma opção discreta:

Validar comprovante

Direcionando para:

/{slug}/validar-comprovante

Não alterar o fluxo principal de acesso à votação.

--------------------------------------------------
15. LINK NA PÁGINA DE COMPROVANTE
--------------------------------------------------

Na página:

src/app/[slug]/comprovante/page.tsx

Adicionar uma opção discreta:

Validar este comprovante

ou:

Consultar comprovante

direcionando para:

/{slug}/validar-comprovante

Não modificar o comprovante já exibido.

--------------------------------------------------
16. BOTÃO VOLTAR
--------------------------------------------------

Na página de validação disponibilizar:

Voltar para eleição

Direcionando para:

/{slug}

--------------------------------------------------
17. NÃO IMPLEMENTAR
--------------------------------------------------

Não alterar:

- backend;
- login;
- confirmação WhatsApp;
- votação;
- registro do voto;
- token_votacao;
- apuração;
- resultados;
- comprovante PDF.

Não criar autenticação para esta consulta.

--------------------------------------------------
18. TESTES
--------------------------------------------------

Validar:

1. Comprovante correto
→ valido = S
→ exibe eleição e data

2. Comprovante inexistente
→ valido = N
→ exibe "Comprovante não encontrado"

3. Campo vazio
→ não enviar requisição desnecessária
→ informar que o comprovante deve ser preenchido

4. Erro da API
→ mostrar mensagem amigável
→ permanecer na página

5. Acesso direto
/asmuv/validar-comprovante
→ deve funcionar sem login

6. Voltar
→ retorna para /asmuv

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivos criados;
2. arquivos alterados;
3. tipos adicionados;
4. função criada no service;
5. funcionamento da página;
6. como válido/inválido são apresentados;
7. onde foram adicionados links para consulta;
8. pendências encontradas.

Depois disso, parar.

Não implementar outras funcionalidades da eleição.