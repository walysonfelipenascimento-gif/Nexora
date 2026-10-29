# Nexi — auditoria e reestruturação profissional

Data da auditoria inicial: 2026-10-29

## Estado confirmado
- Página Next.js em `app/nexi/page.tsx`, API de conversa em `app/api/nexi/chat/route.ts`, status em `app/api/nexi/status/route.ts`.
- Render publicou o commit `3faa3ab681a80302a8e98bd3f138f7f1fed04f31` no deploy `dep-dbhsbk2jnfac73c6n45g` (status live).
- A API usa Responses API quando `NEXI_ENGINE_PROVIDER` não é `ollama`; a checagem de status valida autenticação do provedor, não uma geração real.
- A memória atual é um texto manual, guardado no localStorage do navegador (máximo 4.000 caracteres), não uma memória automática ou sincronizada.
- A primeira etapa da reestruturação adicionou lista das últimas 30 conversas, abertura de conversa anterior, atualização da lista após resposta salva e limpeza do estado privado ao sair da conta. Ainda precisa de build e teste integrado.
- Pesquisa web opcional está conectada ao endpoint da Responses API, mas ainda precisa de teste de ponta a ponta.
- As tabelas `public.nexi_conversations` e `public.nexi_messages` existem; seus campos e políticas RLS foram inspecionados. As políticas limitam leitura/escrita a `auth.uid()` e verificam que a conversa pertence ao usuário ao inserir mensagens. Nenhuma mudança de esquema foi feita.
- O projeto Supabase contém outras funções/tabelas fora da Nexi; não alterar essas partes.

## Plano de trabalho
1. **Interface e acessibilidade:** mobile-first, hierarquia visual, estados vazios/carregamento/erro, foco por teclado, áreas clicáveis e mensagens de status precisas.
2. **Chat resiliente:** impedir envios duplicados, preservar prompt em erro, distinguir erro de provedor de erro de persistência e não anunciar sucesso falso.
3. **Histórico por conversa:** listar/abrir conversas do usuário autenticado, criar nova conversa de verdade e restaurar mensagens com ordem consistente.
4. **Memória:** manter transparência sobre memória manual; avaliar memória persistente por conta separada do histórico, com consentimento e políticas RLS, sem guardar segredos ou dados sensíveis desnecessários.
5. **Pesquisa:** validar fontes e referências reais; mostrar estado pesquisando, fontes e falha da ferramenta sem afirmar pesquisa quando ela não ocorreu.
6. **Segurança:** revisar RLS das duas tabelas Nexi, ownership por `auth.uid()`, limites de payload, rate limiting distribuído e logs sem conteúdo de mensagens nem segredos.
7. **Testes/publicação:** lint/build/typecheck, endpoints, autenticação, chat sem pesquisa/com pesquisa, histórico e falhas de provedor; publicar só depois dos checks e confirmar o deploy Live.

## Implementação iniciada nesta branch\n- Branch: `nexi/auditoria-reestruturacao-profissional`.\n- PR draft: https://github.com/walysonfelipenascimento-gif/Nexora/pull/19\n- Commits atuais incluem a documentação, navegação de histórico, ajustes responsivos e limpeza do estado após logout.\n- A branch ainda não está publicada no Render. O CI não retornou workflows associados ao commit; lint/build/typecheck continuam pendentes.\n\n## Regras de segurança operacional
- Não expor chaves ou segredos.
- Não mexer em tabelas/funções CJS ou outras áreas da Nexora.
- Não fazer deploy para produção até a alteração ter sido revisada e compilada.
- Não afirmar que um recurso foi testado sem resultado observável.
