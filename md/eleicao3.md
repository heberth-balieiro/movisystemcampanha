Dar continuidade ao módulo de eleição no frontend EasyCatalogo.

A API da cédula já está pronta e validada.

## Objetivo

Implementar a página:

```text
/{slug}/votacao
```

para carregar e exibir os dados reais da eleição, chapas e membros.

Nesta etapa, **não registrar voto ainda**.

---

## 1. Rota da API

Usar:

```http
GET /api/v1/public/eleicao/{slug}/votacao
Authorization: Bearer {token_votacao}
```

Utilizar o `apiFetch` já existente.

Não hardcode IP ou URL.

---

## 2. Token

O token já está salvo no `sessionStorage` como:

```text
eleicao_token_votacao
```

Utilizar o `eleicao-session.service.ts`.

Se não existir token, redirecionar para:

```text
/{slug}/login
```

---

## 3. Retorno atual

A API retorna:

```json
{
  "erro": false,
  "mensagem": "",
  "dados": {
    "eleicao": {
      "id": 3,
      "codigo": 2,
      "nome": "Eleição Diretoria 2026",
      "descricao": "Eleição para escolha da nova diretoria",
      "ano": 2026,
      "tipo": "DIRETORIA",
      "situacao": "ABERTA"
    },
    "chapas": [
      {
        "id": 2,
        "codigo": 1001,
        "numero": 1,
        "nome": "Chapa Renovação",
        "slogan": "Juntos por uma nova gestão",
        "observacao": "Chapa cadastrada para a eleição 2026",
        "situacao": "ATIVA",
        "membros": [
          {
            "id": 2,
            "codigo": 1001,
            "nome": "João da Silva",
            "cargo": "Presidente",
            "tipo": "TITULAR",
            "observacao": "Membro titular da chapa",
            "tem_foto": "S"
          }
        ]
      }
    ]
  }
}
```

---

## 4. Types

Atualizar:

```text
src/types/eleicao/index.ts
```

Criar tipos para:

```text
EleicaoVotacao
EleicaoChapa
EleicaoChapaMembro
EleicaoVotacaoDados
EleicaoVotacaoResponse
```

Seguir o padrão de tipos já existente no projeto.

---

## 5. Service

Atualizar:

```text
src/services/eleicao/eleicao.service.ts
```

Criar função:

```text
buscarCedulaVotacao(slug, tokenVotacao)
```

Ela deve:

- executar GET;
- enviar `token_votacao`;
- retornar os dados tipados;
- não fazer redirecionamento dentro do service.

---

## 6. Página

Atualizar:

```text
src/app/[slug]/votacao/page.tsx
```

A página deve:

1. obter o `slug`;
2. obter `token_votacao`;
3. buscar os dados da votação;
4. mostrar loading enquanto carrega;
5. mostrar erro amigável em caso de falha;
6. exibir eleição e chapas.

---

## 7. Cabeçalho da votação

Exibir:

```text
nome da eleição
descrição
ano
```

Exemplo:

```text
Eleição Diretoria 2026

Eleição para escolha da nova diretoria
Ano: 2026
```

---

## 8. Chapas

Exibir cada chapa em um card.

Mostrar:

```text
Número da chapa
Nome
Slogan
Membros
```

Exemplo:

```text
Chapa 01

Chapa Renovação

Juntos por uma nova gestão

Presidente
João da Silva
```

---

## 9. Membros

Para cada membro mostrar:

```text
nome
cargo
tipo
```

A informação `tem_foto` pode ser considerada no layout, mas nesta etapa não criar rota de imagem.

Se `tem_foto === "S"`, pode manter um espaço visual preparado para futura foto.

Não usar Base64.

---

## 10. Seleção visual

Permitir selecionar uma chapa visualmente no frontend.

Criar estado:

```text
chapaSelecionada
```

Ao clicar no card:

- marcar como selecionado;
- destacar visualmente;
- permitir somente uma chapa selecionada por vez.

Importante:

**não enviar voto para API nesta etapa.**

---

## 11. Botão

Após selecionar uma chapa, exibir botão:

```text
Continuar
```

Por enquanto o botão pode apenas manter a seleção preparada.

Não chamar API de voto.

Não avançar ainda para confirmação definitiva.

---

## 12. Não implementar

Não implementar nesta tarefa:

```text
registro do voto
voto branco
voto nulo
comprovante
confirmação definitiva
rota POST de votação
foto dos membros
resultado da eleição
```

---

## 13. Segurança

Se:

```text
token_votacao
```

não existir:

```text
/{slug}/login
```

Se a API retornar acesso não autorizado:

- limpar a sessão da eleição;
- redirecionar para `/{slug}/login`.

Não redirecionar para o login administrativo.

---

## 14. Visual

Manter o padrão visual já utilizado no módulo de eleição.

Priorizar:

- responsividade;
- uso confortável em celular;
- cards claros;
- seleção visual evidente;
- boa leitura dos membros.

Não criar layout excessivamente complexo.

---

## 15. Componentes

Antes de criar novos componentes, verificar os existentes em:

```text
src/components/eleicao/
```

Reutilizar quando possível.

Se necessário, criar apenas componentes específicos simples para:

```text
ChapaCard
MembroChapa
```

---

## 16. Testes

Validar:

### Com token válido

```text
/votacao
→ carrega eleição
→ carrega chapas
→ carrega membros
```

### Seleção

```text
clicar em uma chapa
→ chapa fica selecionada
→ outra chapa remove seleção anterior
```

### Sem token

```text
/votacao
→ redireciona para /login
```

### Token inválido

```text
API nega acesso
→ limpa sessão
→ redireciona para login da eleição
```

---

## Ao finalizar

Informar apenas:

1. arquivos alterados;
2. tipos criados;
3. função criada no service;
4. como a página carrega a cédula;
5. como a seleção da chapa funciona;
6. pendências encontradas.

Depois disso, parar.

Não implementar registro do voto ainda.