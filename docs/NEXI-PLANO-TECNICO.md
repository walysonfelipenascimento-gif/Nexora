# Nexi — proposta e plano técnico

**Produto:** Nexi, assistente de inteligência artificial da Nexora  
**Estado:** proposta de arquitetura; ainda não implementada nem publicada  
**Princípios:** preservar a plataforma atual, mudanças pequenas e verificáveis, segredo de provedor somente no servidor e Supabase na etapa final.

## Visão do produto

A Nexi deve estar disponível em dois lugares:
1. **Central Nexi:** página própria para conversas, tarefas, histórico (quando houver persistência segura), sugestões e ferramentas.
2. **Pontos integrados:** entrada contextual na pesquisa e nas conversas da Nexora; futuramente, atalhos em Criar, Reels e Stories.

Identidade visual: tema escuro da Nexora com azul elétrico, ciano, roxo e magenta; brilho discreto; boa acessibilidade, estados de carregamento, cancelamento e erros claros. Nome de produto: **Nexi**. Slogan de trabalho: **“Conectando ideias. Criando possibilidades.”** Confirmar disponibilidade jurídica e de marca antes de lançamento comercial.

## Escopo funcional

- Assistente geral: perguntas e respostas, explicações e ajuda em tarefas.
- Criatividade: legendas, ideias de Reels, roteiros, textos de Stories, memes e publicações.
- Pesquisa: busca interna na Nexora e, se configurada uma fonte externa segura, pesquisa na web com fontes e links.
- Imagens/arquivos: analisar entradas apenas se o modelo selecionado suportar; validar tamanho e tipo de arquivo.
- Contexto: distinguir a conversa geral do contexto de uma página; não acessar mensagens privadas, perfil ou arquivos de alguém sem autorização explícita.
- Ações: primeiro apenas sugerir e redigir; publicar, enviar mensagens ou alterar dados exige confirmação explícita e autorização do usuário.
- Transparência: identificar-se como IA, indicar limitações e não inventar resultados, pesquisas ou ações concluídas.

## Arquitetura proposta

- **Frontend Next.js/React:** componentes reutilizáveis para a central, painel contextual e estados de conversa. Manter a navegação existente e o design responsivo.
- **API de servidor:** endpoint próprio (por exemplo, `/api/nexi/chat`) para validar entrada, aplicar limites, chamar o provedor e devolver respostas em streaming quando suportado.
- **Camada adaptadora de modelo:** interface independente do fornecedor para trocar de modelo sem refazer a interface. Escolher provedor e SDK somente após comparar custo, disponibilidade, privacidade, suporte a streaming, visão e pesquisa.
- **Segredos:** chaves de API exclusivamente em variáveis de ambiente no servidor do Render; nunca em código cliente, GitHub ou logs. Não reutilizar chaves expostas.
- **Segurança:** validação de tamanho/tipo, rate limit, limites de tokens e tempo, tratamento de erros, proteção contra prompt injection em conteúdo recuperado, filtragem de conteúdo e testes de autorização. Não executar texto do modelo como código.
- **Observabilidade:** logs técnicos sem guardar prompts privados por padrão; métricas agregadas de latência, erros e consumo; redigir tokens, chaves e dados pessoais.
- **Dados:** antes da etapa final, não conectar nem modificar o Supabase. O protótipo pode usar dados de demonstração ou estado temporário e deve deixar explícito que o histórico não é persistente.

## Etapas de implementação

### Etapa 0 — segurança e inventário
1. Confirmar o commit estável e revisar a estrutura atual sem reescrever a página inteira.
2. Repetir as verificações do erro de toque de `app/page.tsx`: tipo compatível com o elemento, guarda para `changedTouches[0]`, build e TypeScript.
3. Mapear rotas, componentes e padrões visuais existentes; não tocar em tabelas do CJS nem em dados existentes.
**Aceite:** build limpo e deploy atual permanece funcionando.

### Etapa 1 — experiência visual sem IA real
1. Criar componentes isolados para a Central Nexi e o acesso contextual.
2. Criar estados vazio, sugestões iniciais, conversa, carregamento, erro, cancelamento e acessibilidade.
3. Usar conteúdo claramente demonstrativo; não simular que uma IA real respondeu.
**Aceite:** navegação e layout funcionam em celular e desktop; nenhuma regressão em mensagens, Reels, perfil ou criação.

### Etapa 2 — integração de IA no servidor
1. Selecionar provedor e modelo, revisar custos e condições de privacidade.
2. Implementar o adaptador no servidor e validar requisições e respostas.
3. Adicionar streaming (se suportado), rate limit, limites de uso, erros e proteção de segredos.
4. Testar com prompts comuns, entradas malformadas, limites e falhas do provedor.
**Aceite:** uma conversa real funciona sem expor credenciais no navegador ou nos logs.

### Etapa 3 — ferramentas por prioridade
1. Geração de textos e ideias.
2. Pesquisa com fontes verificáveis, quando houver provedor de pesquisa configurado.
3. Entrada de imagem/arquivo somente após confirmar suporte e adicionar validação.
4. Contexto de pesquisa e criação com permissões explícitas.
**Aceite:** cada ferramenta tem testes e indica claramente o que fez e o que não fez.

### Etapa 4 — validação e publicação controlada
1. Executar lint/testes disponíveis e `npm run build`; confirmar checagem de TypeScript.
2. Trabalhar em branch própria e revisar o diff antes de integrar.
3. Confirmar branch, repositório e commit conectados ao Render.
4. Acompanhar build logs, eventos, estado `live` e logs de inicialização.
5. Testar manualmente a Central e os acessos integrados no site publicado.
**Aceite:** build bem-sucedido, commit correto no Render e testes reais documentados. Build verde, sozinho, não significa que a experiência esteja validada.

### Etapa 5 — Supabase por último
Só depois da interface, integração de modelo e testes estarem estáveis:
1. Inspecionar o esquema existente antes de propor mudanças.
2. Definir autenticação, propriedade dos dados, retenção e exclusão de conversas.
3. Propor tabelas novas e políticas RLS específicas, sem apagar, renomear ou alterar dados existentes.
4. Separar mudanças em migrações revisáveis e testar em ambiente seguro antes de aplicar.
5. Nunca acessar nem modificar tabelas do CJS.
**Aceite:** o usuário revisa o plano de banco; integração só é aplicada depois da validação e confirmação.

## Checklist obrigatório antes de cada deploy

- [ ] Alteração isolada, diff revisado e branch correta.
- [ ] Tipos de eventos coerentes com os elementos; dados opcionais protegidos.
- [ ] Lint/testes disponíveis e `npm run build` aprovados.
- [ ] Segredos fora do cliente, dos commits e dos logs.
- [ ] Nenhuma integração prematura com Supabase; nenhuma alteração em dados do CJS.
- [ ] Render usando o commit esperado; build, deploy e inicialização confirmados.
- [ ] Teste manual da funcionalidade no site real e regressão básica de mensagens, perfil, Reels e navegação.

## Critérios de lançamento

- Experiência responsiva e acessível, em português como idioma inicial.
- Identidade visual consistente com a Nexora e indicação clara de que Nexi é IA.
- Respostas e erros honestos; nenhuma pesquisa ou ação inventada.
- Proteções de privacidade, limites de uso e controles de dados definidos.
- Custo por uso monitorável e limite de consumo configurado.
- Histórico persistente só após a etapa de Supabase e definição de políticas.

## Situação atual

Este documento é apenas planejamento técnico. A criação desta proposta não modifica o código de produção, não configura um provedor de IA, não conecta Supabase e não publica funcionalidades novas. A implementação deve seguir as etapas acima, sem deploy de mudanças de produto até passar pelos testes.
