# EasyEleicao Web — Instruções permanentes do workspace

Este workspace é exclusivamente do frontend **EasyEleicao Web**.

Projeto:

```text
C:\Projeto\Producao\EasyWeb\easyeleicao
```

Projeto separado que NÃO deve ser alterado:

```text
C:\Projeto\Producao\EasyWeb\easycatalogo
```

## Regras obrigatórias

- Trabalhar somente no frontend Next.js/TypeScript do EasyEleicao.
- Nunca alterar o EasyCatalogo.
- Não alterar backend Delphi/Horse, banco, SQL, rotas da API ou contratos existentes sem solicitação explícita.
- Preservar o domínio `https://votacao.conesulsistemas.com.br/{slug}`.
- Preservar o `slug` como primeiro segmento da URL.
- Não usar `basePath: "/votacao"`.
- Preservar as rotas em `src/app/[slug]/`.
- Não criar redirecionamento genérico para `/login`; respeitar `/{slug}/login` e `/{slug}/admin/login`.
- Antes de alterar código, ler os arquivos atuais envolvidos.
- Não inventar campos, propriedades ou respostas de API.
- Não implementar funcionalidades além do escopo solicitado.
- Não reescrever arquivos inteiros quando uma alteração pontual resolver.
- Manter compatibilidade desktop, tablet e mobile.
- Validar build/lint quando o ambiente permitir.

## Segurança eleitoral no frontend

- Nunca exibir ou inferir relação entre eleitor e escolha do voto.
- Não exibir chapa, tipo de voto ou comprovante associado ao eleitor em auditoria.
- `VOTO_REGISTRADO` deve permanecer visualmente anônimo.
- Não mostrar resultado parcial enquanto a eleição estiver `ABERTA`.
- Resultado público somente em `PUBLICADA`.
- Enquanto não existir regra oficial de desempate, usar “Mais votada” e registrar “Empate” quando aplicável; não declarar “Vencedora”.

## Estrutura principal

```text
src/app/[slug]/
src/components/eleicao/
src/services/eleicao/
src/types/eleicao/
```

## Sessão e autenticação

- Sessões devem permanecer isoladas por `slug`.
- Token expirado deve limpar a sessão correspondente e retornar ao login correto.
- Não compartilhar token administrativo com fluxo do eleitor.
- Não armazenar dados sensíveis além do necessário no navegador.

## Skill detalhada

Seguir também:

```text
.github/skills/easyeleicao/SKILL.md
```
