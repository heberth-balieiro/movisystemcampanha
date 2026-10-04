# EasyEleicao

Frontend dedicado do Sistema de Votacao Digital da Cone Sul Sistemas.

## Estrutura de URL

O dominio do frontend deve apontar diretamente para este projeto:

- `https://votacao.conesulsistemas.com.br/{slug}`
- `https://votacao.conesulsistemas.com.br/{slug}/login`
- `https://votacao.conesulsistemas.com.br/{slug}/confirmacao`
- `https://votacao.conesulsistemas.com.br/{slug}/votacao`
- `https://votacao.conesulsistemas.com.br/{slug}/comprovante`
- `https://votacao.conesulsistemas.com.br/{slug}/resultado`
- `https://votacao.conesulsistemas.com.br/{slug}/admin/login`
- `https://votacao.conesulsistemas.com.br/{slug}/admin/painel`

Nao configurar `basePath` no Next.js. O subdominio `votacao` ja identifica a aplicacao; o primeiro segmento da URL continua sendo o `slug` da eleicao.

## Configuracao

Defina em `.env` e `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://seu-endereco-da-api
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Producao

```bash
npm install
npm run build
npm start
```

O proxy reverso/Nginx deve encaminhar `votacao.conesulsistemas.com.br` para a porta do processo Next.js sem adicionar prefixo ao caminho.

## Dominio e proxy reverso

Configuracao recomendada:

- Frontend: `votacao.conesulsistemas.com.br`
- Rota publica: `/{slug}`
- Nao usar `basePath` como `/votacao`.
- O Nginx deve preservar o caminho original ao encaminhar para o Next.js.
- Se a API estiver em outro dominio, liberar `https://votacao.conesulsistemas.com.br` no CORS da API.

A mudanca de frontend nao altera os endpoints atuais da API e nao exige mudar o formato do slug.

## Hardening do frontend

O projeto aplica cabeçalhos de segurança pelo `next.config.ts`, incluindo CSP, bloqueio de iframe, `nosniff`, política de permissões e remoção do `X-Powered-By`.

Em produção, utilize HTTPS tanto no frontend quanto na API. Uma página HTTPS não deve consumir a API por HTTP, pois o navegador pode bloquear a chamada como conteúdo misto.

O cliente HTTP possui timeout e mensagens específicas para indisponibilidade de rede/serviço. Não há repetição automática de requisições de voto.

## Fotos de candidatos e membros

O frontend está preparado para receber, na cédula, a propriedade opcional `foto_url` em cada membro:

```json
{
  "id": 10,
  "nome": "Nome do candidato",
  "cargo": "Presidente",
  "tem_foto": "S",
  "foto_url": "/api/v1/public/eleicao/ASMUV/membro/10/foto"
}
```

`foto_url` pode ser uma URL absoluta HTTP/HTTPS ou uma rota relativa à `NEXT_PUBLIC_API_BASE_URL`.

A imagem em Base64 não precisa ser enviada ao frontend. A API pode receber/armazenar o Base64 internamente e disponibilizar a foto por uma rota HTTP que responda com o `Content-Type` correto da imagem. Se a foto estiver indisponível ou a rota falhar, o frontend exibe automaticamente as iniciais do membro.

## Páginas institucionais

O rodapé do EasyEleicao possui páginas próprias por eleição, preservando o `slug` e a identidade visual da entidade:

```text
/{slug}/sobre
/{slug}/termos
/{slug}/privacidade
```

Os textos são um padrão operacional da plataforma e podem ser complementados pela entidade responsável conforme estatuto, edital, regulamento, contrato e orientações jurídicas aplicáveis.
