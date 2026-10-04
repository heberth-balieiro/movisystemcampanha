Corrigir somente a exibição do resultado da apuração no painel ADMIN quando a eleição estiver com situação:

PUBLICADA

CONTEXTO

Hoje o resultado da apuração aparece corretamente quando:

situacao === "APURADA"

Porém, após publicar o resultado, a eleição passa para:

situacao === "PUBLICADA"

e a seção/card de resultado deixa de aparecer.

A API já foi ajustada para permitir consulta do resultado em:

APURADA
PUBLICADA

Não alterar backend nesta tarefa.

--------------------------------------------------
1. ARQUIVO PRINCIPAL
--------------------------------------------------

Analisar e ajustar:

src/app/[slug]/admin/painel/page.tsx

Também verificar, se necessário:

src/services/eleicao/eleicao.service.ts

Mas evitar alterações fora do necessário.

--------------------------------------------------
2. REGRA DE CARREGAMENTO
--------------------------------------------------

Localizar a condição atual que carrega o resultado.

Se estiver semelhante a:

if (dados.eleicao.situacao === "APURADA") {
  await carregarResultado();
}

alterar para permitir:

APURADA
OU
PUBLICADA

Exemplo:

if (
  dados.eleicao.situacao === "APURADA" ||
  dados.eleicao.situacao === "PUBLICADA"
) {
  await carregarResultado();
}

--------------------------------------------------
3. REGRA DE EXIBIÇÃO
--------------------------------------------------

Localizar também a condição que renderiza a seção:

Resultado da apuração

Hoje provavelmente ela depende somente de:

situacao === "APURADA"

Ajustar para:

situacao === "APURADA" ||
situacao === "PUBLICADA"

--------------------------------------------------
4. PREFERÊNCIA
--------------------------------------------------

Se houver mais de uma verificação desse tipo, centralizar em uma variável simples:

const podeExibirResultado =
  painel?.eleicao.situacao === "APURADA" ||
  painel?.eleicao.situacao === "PUBLICADA";

Utilizar essa variável tanto para:

- carregar resultado;
- renderizar resultado;

quando fizer sentido sem alterar a estrutura atual.

--------------------------------------------------
5. COMPORTAMENTO ESPERADO
--------------------------------------------------

ABERTA
→ não carregar resultado
→ não mostrar resultado

ENCERRADA
→ não carregar resultado
→ não mostrar resultado

EM_APURACAO
→ não carregar resultado
→ não mostrar resultado

APURADA
→ carregar resultado
→ mostrar resultado

PUBLICADA
→ carregar resultado
→ mostrar resultado

--------------------------------------------------
6. MANTER O RESULTADO EXISTENTE
--------------------------------------------------

Em PUBLICADA, continuar exibindo:

- Total de votos
- Votos válidos
- Votos em branco
- Votos nulos
- Resultado por chapa
- Percentual
- Gráfico
- Mais votada

Não alterar layout ou cálculos.

--------------------------------------------------
7. BOTÃO ATUALIZAR DADOS
--------------------------------------------------

Ao clicar em:

Atualizar dados

quando a situação for:

APURADA
ou
PUBLICADA

também atualizar o resultado da apuração.

--------------------------------------------------
8. NÃO ALTERAR
--------------------------------------------------

Não alterar:

- API;
- endpoints;
- types sem necessidade;
- login ADMIN;
- sessionStorage;
- gráficos;
- regras de apuração;
- publicação;
- cards de participação;
- fluxo de status.

Corrigir somente a condição de carregamento e exibição do resultado.

--------------------------------------------------
9. TESTES
--------------------------------------------------

Testar:

1. situação APURADA
→ resultado aparece

2. situação PUBLICADA
→ resultado também aparece

3. situação ABERTA
→ resultado não aparece

4. situação ENCERRADA
→ resultado não aparece

5. situação EM_APURACAO
→ resultado não aparece

6. clicar "Atualizar dados" em PUBLICADA
→ resultado permanece atualizado e visível

--------------------------------------------------
AO FINAL
--------------------------------------------------

Informar somente:

1. arquivo alterado;
2. condição ajustada;
3. comportamento final em APURADA e PUBLICADA.

Depois disso, parar.

Não implementar nenhuma nova funcionalidade.