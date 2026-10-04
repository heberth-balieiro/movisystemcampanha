---
name: easyeleicao
description: Regras e padrões do frontend Next.js do EasyEleicao Web. Use em tarefas de layout, rotas por slug, autenticação no navegador, votação, painel administrativo, auditoria, relatórios e resultado público.
---

# EasyEleicao Web

## Objetivo

Atuar exclusivamente no frontend do Sistema de Votação Digital EasyEleicao, preservando fluxo, segurança, responsividade e contratos atuais da API.

## Projeto

```text
C:\Projeto\Producao\EasyWeb\easyeleicao
```

Não alterar:

```text
C:\Projeto\Producao\EasyWeb\easycatalogo
```

Também não alterar Delphi/Horse, banco ou SQL nesta skill.

## Domínio e rotas

```text
https://votacao.conesulsistemas.com.br/{slug}
```

Rotas principais:

```text
/{slug}
/{slug}/login
/{slug}/confirmacao
/{slug}/votacao
/{slug}/confirma-voto
/{slug}/comprovante
/{slug}/validar-comprovante
/{slug}/resultado
/{slug}/admin/login
/{slug}/admin/painel
```

Não usar `basePath: "/votacao"`.

## Estrutura

```text
src/app/[slug]/
src/components/eleicao/
src/services/eleicao/
src/types/eleicao/
```

Antes de editar, ler os arquivos atuais e reutilizar os componentes existentes.

## Regras eleitorais de interface

- Não exibir associação entre eleitor e voto.
- `VOTO_REGISTRADO` permanece anônimo.
- Não mostrar resultado parcial em `ABERTA`.
- Resultado público somente em `PUBLICADA`.
- Sem regra formal de desempate, mostrar empate e não escolher vencedor automaticamente.
- Usar “Mais votada” em vez de “Vencedora” até definição formal.

## Sessão

- Tokens e dados temporários devem ser isolados por `slug`.
- Token de identificação, token de votação e token ADMIN têm contextos distintos.
- Expiração deve limpar somente a sessão correspondente e redirecionar ao login correto.
- Não redirecionar para `/login` genérico.

## UX e layout

- Priorizar aparência profissional e institucional.
- Desktop, tablet e mobile são obrigatórios.
- Evitar scroll horizontal desnecessário.
- Manter foco visível, labels e estados que não dependam somente de cor.
- Não redesenhar áreas não solicitadas.

## API

- Consumir os contratos existentes; não inventar propriedades.
- `apiFetch` é o padrão do projeto.
- Não alterar backend nesta skill.
- Erros de autenticação devem ser tratados no contexto do `slug`.

## Antes de executar

1. Ler os arquivos envolvidos.
2. Confirmar o escopo frontend.
3. Preservar contratos e rotas.
4. Avaliar impacto em sessão, votação, auditoria e resultado.
5. Fazer a menor alteração necessária.

## Depois de executar

Quando disponível:

```text
npm run build
npm run lint
```

Também revisar desktop/mobile e fluxo de navegação alterado.

## Resposta final

Informar objetivamente:

1. arquivos alterados;
2. implementação;
3. testes realizados;
4. problemas encontrados;
5. pendências reais.

Não adicionar funcionalidades fora da tarefa.
