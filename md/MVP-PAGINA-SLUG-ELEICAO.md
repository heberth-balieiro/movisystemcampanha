# MVP — Página Pública da Eleição por Slug

## Objetivo

Evoluir a página pública da eleição acessada por `/{slug}` para uma experiência mais profissional, elegante, confiável e comercialmente apresentável, mantendo o fluxo atual de consulta da eleição e respeitando os estados do processo eleitoral.

A página deve cumprir três funções principais:

1. Apresentar a instituição e sua identidade visual.
2. Exibir com clareza os dados da eleição e o status atual.
3. Direcionar o usuário para a ação correta: participar da votação, validar comprovante, consultar resultado ou acessar o painel administrativo.

---

## Escopo do MVP

### 1. Hero institucional

Criar uma área principal no topo contendo:

- logo da instituição;
- nome da instituição;
- subtítulo institucional;
- nome da eleição;
- descrição curta;
- badge com situação atual;
- período da votação;
- ação principal contextual.

Exemplo de subtítulo:

> Plataforma segura para participação em votações digitais.

A identidade visual deve usar prioritariamente:

- `entidade.cor_primaria`
- `entidade.cor_secundaria`

com fallback para a identidade padrão da plataforma.

---

### 2. Card resumo da eleição

Exibir um card com as principais informações da votação:

- situação;
- data/hora de início;
- data/hora de encerramento;
- tipo da eleição, quando disponível;
- descrição;
- total de chapas, se essa informação estiver disponível no retorno atual sem necessidade de nova rota.

O card deve ter:

- ícones;
- borda sutil;
- espaçamento consistente;
- badge de status;
- boa adaptação para mobile.

---

### 3. Banner institucional

Reaproveitar o banner retornado pela API, mas com apresentação mais refinada.

Regras:

- largura responsiva;
- proporção visual consistente;
- cantos arredondados;
- evitar ocupar altura excessiva;
- manter suporte a imagem em Base64;
- não quebrar a página caso o banner não exista.

---

### 4. Estado da votação

Criar uma área visual específica para comunicar o estado atual.

#### AGENDADA

Título:

`Votação agendada`

Mensagem:

`A votação ainda não foi iniciada. Aguarde a data e o horário programados para acessar.`

A ação principal deve ficar desabilitada.

#### ABERTA

Título:

`Votação em andamento`

Mensagem:

`A participação já está liberada para os eleitores aptos.`

Ação principal:

`Participar da votação`

Destino:

`/{slug}/login`

#### ENCERRADA

Título:

`Votação encerrada`

Mensagem:

`O período de votação foi finalizado.`

Ocultar ou desabilitar o acesso para votar.

#### EM_APURACAO

Título:

`Apuração em andamento`

Mensagem:

`A votação foi encerrada e os resultados estão em processo de apuração.`

#### APURADA

Título:

`Apuração concluída`

Mensagem:

`A apuração foi concluída. Aguarde a publicação oficial do resultado.`

#### PUBLICADA

Título:

`Resultado publicado`

Mensagem:

`A votação foi concluída e o resultado oficial está disponível para consulta.`

Ação principal:

`Ver resultado`

Destino:

`/{slug}/resultado`

---

### 5. Ações rápidas

Criar uma seção de ações rápidas com até três opções:

- Participar da votação
- Validar comprovante
- Acessar painel administrativo

Rotas:

- votação: `/{slug}/login`
- comprovante: `/{slug}/validar-comprovante`
- painel: `/{slug}/admin`

A ação de votar deve respeitar a situação da eleição.

A ação administrativa deve ser visualmente secundária em relação ao fluxo do eleitor.

---

### 6. Como funciona

Adicionar uma seção curta com quatro passos:

1. Identifique-se com seus dados.
2. Valide seu acesso.
3. Registre seu voto com segurança.
4. Guarde seu comprovante.

Objetivo:

- reduzir dúvidas;
- aumentar confiança;
- explicar o fluxo antes do acesso.

---

### 7. Segurança e credibilidade

Adicionar uma seção compacta com itens como:

- Ambiente seguro
- Processo auditável
- Proteção de dados
- Registro de participação

A comunicação deve ser institucional, sem prometer características técnicas que ainda não existam no produto.

---

### 8. Rodapé institucional

Melhorar o rodapé atual com quatro grupos:

#### Plataforma
- Sistema de Votação Digital
- breve descrição institucional

#### Contato
- e-mail
- telefone

#### Institucional
- Sobre a plataforma
- Termos de Uso
- Privacidade e Proteção de Dados

#### Redes sociais
- Instagram
- Facebook
- YouTube

Os links de redes sociais só devem aparecer quando houver URL configurada.

---

## Hierarquia visual sugerida

Ordem da página:

1. Hero institucional
2. Mensagem de boas-vindas
3. Banner
4. Resumo da eleição
5. Estado da votação
6. Ações rápidas
7. Como funciona
8. Segurança e credibilidade
9. Rodapé institucional

---

## Diretrizes visuais

### Tipografia

- título institucional forte;
- nome da eleição em destaque;
- textos secundários com peso menor;
- boa legibilidade em desktop e mobile.

### Cards

- bordas discretas;
- radius consistente;
- sombras leves;
- fundo claro;
- espaçamento interno maior que o atual.

### Cores

Usar:

- cor primária para ações e destaques;
- cor secundária para apoio visual;
- cores semânticas para status.

Sugestão de semântica:

- AGENDADA: âmbar
- ABERTA: verde
- ENCERRADA: cinza
- EM_APURACAO: azul
- APURADA: violeta
- PUBLICADA: esmeralda

---

## Responsividade

A página deve funcionar em:

- desktop;
- notebook;
- tablet;
- mobile.

No mobile:

- cards devem ocupar largura total;
- ações rápidas podem empilhar verticalmente;
- banner deve respeitar proporção;
- títulos não devem estourar largura;
- informações de período podem virar blocos verticais.

---

## Regras funcionais

A implementação deve continuar consumindo a rota pública existente:

`GET /api/v1/public/eleicao/{slug}`

Não criar nova rota para este MVP.

O retorno atual deve continuar sendo a fonte para:

- entidade;
- eleição;
- situação;
- identidade visual;
- contatos;
- banner;
- logo.

Não alterar o contrato da API neste MVP.

---

## Compatibilidade com estados

A página deve tratar explicitamente:

- AGENDADA
- ABERTA
- ENCERRADA
- EM_APURACAO
- APURADA
- PUBLICADA

Evitar fallback genérico para estados conhecidos.

---

## Critérios de aceite

O MVP será considerado concluído quando:

- a página `/{slug}` tiver aparência mais profissional;
- identidade visual da instituição for aplicada corretamente;
- logo e banner continuarem funcionando;
- status da eleição for apresentado de forma clara;
- ação principal mudar conforme o status;
- votação permanecer bloqueada quando não estiver ABERTA;
- resultado for destacado quando PUBLICADA;
- validar comprovante continuar disponível;
- painel administrativo tiver acesso visível, porém secundário;
- layout estiver adequado em desktop e mobile;
- nenhuma nova dependência obrigatória de API for criada.

---

## Fora do escopo deste MVP

Não implementar nesta etapa:

- alterações nas rotas da API;
- novas regras de autenticação;
- questões e opções de votação;
- fluxo interno de login do eleitor;
- alteração da tela de votação;
- alteração da tela de comprovante;
- redesign do painel administrativo;
- novas configurações no EasyOne.

Esses itens podem ser tratados em etapas posteriores.

---

## Arquivos prováveis de alteração

Principal:

- `src/app/[slug]/page.tsx`

Componentes existentes que podem ser reaproveitados ou evoluídos:

- `src/components/eleicao/EleicaoLayout.tsx`
- `src/components/eleicao/VotacaoCard.tsx`
- `src/components/eleicao/EleicaoMensagem.tsx`
- `src/components/ui/button-link.tsx`

Pode ser interessante separar novos blocos em componentes próprios:

- `EleicaoHero.tsx`
- `EleicaoResumo.tsx`
- `EleicaoStatus.tsx`
- `EleicaoAcoes.tsx`
- `EleicaoComoFunciona.tsx`
- `EleicaoSeguranca.tsx`

A separação em componentes não é obrigatória, mas é recomendada para manter o arquivo da página enxuto.

---

## Próxima etapa sugerida

Após aprovação deste MVP:

1. implementar o novo layout;
2. validar com a slug `SINDSUL`;
3. revisar desktop e mobile;
4. depois evoluir login do eleitor, votação e comprovante.
