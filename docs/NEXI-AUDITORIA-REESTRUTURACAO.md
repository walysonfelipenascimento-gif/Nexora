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
## Verificação complementar de segurança — 2026-10-29
- As políticas RLS atuais das tabelas Nexi foram consultadas diretamente em `pg_policies` (não houve alteração): conversas permitem SELECT/INSERT/UPDATE/DELETE somente para `authenticated` e com `auth.uid() = user_id`; mensagens permitem SELECT/DELETE por proprietário e INSERT somente quando `user_id) pertence à sessão e a conversa referenciada também pertence ao mesmo usuário.
- O catálogo atual não registra, por si só, o autor ou a data de criação dessas políticas. Portanto, não é possível afirmar quem as criou nem que o usuário as aceitou. Não remover nem reescrever políticas sem rastrear migrations/auditoria e confirmar impacto.
- O Security Advisor também apontou avisos em funções SECURITY DEFINER e proteção de senha vazada desativada no projeto, além de avisos em funções Pulse e outras áreas. Essas partes não foram modificadas por estarem fora do escopo autorizado da Nexi; precisam de revisão separada pelo responsável do projeto.
- O Performance Advisor identificou que as políticas Nexi chamam `auth.uid()` sem encapsular em `(select auth.uid())`, recomendação de otimização. Adiar qualquer alteração até revisar migrations e testar RLS em contas distintas.
- A rota de chat ainda usa rate limit em memória do processo; isso não é distribuído entre instâncias/reinicializações. É uma limitação conhecida que deve ser corrigida antes de considerar o serviço robusto em produção.
- A persistência atual grava as duas mensagens em uma operação de insert, mas a criação da conversa, o insert das mensagens e o update de `updated_at` são operações separadas; uma falha parcial pode deixar uma conversa incompleta. Testar e, se necessário, mover a gravação para uma operação transacional segura e restrita à Nexi.
- Nenhuma política, tabela, função, chave ou configuração do Supabase foi alterada nesta verificação.


## Progresso operacional — 2026-10-29 (continuação)

### Etapa 1 — base funcional e isolamento de sessão
- O CI do commit `fc24731d842afa88ceac7b44861bd7fd106ab6ae` passou no PR #19: instalação, lint direcionado aos três arquivos Nexi e build de produção Next.js concluídos com sucesso. O lint global do repositório continua sendo reportado separadamente como baseline legado; não foi usado para mascarar falhas do lint Nexi.
- Foi identificado um risco real na troca de contas: a tela poderia manter mensagens da conta anterior enquanto carregava o histórico da nova conta. Corrigido na branch com o commit `723060c24abc2303cc35cf141cab972dcf8f1c49`: limpa imediatamente conversas, mensagens, fontes e seleção de conversa ao mudar a identidade; restaura o histórico mais recente da nova conta e trata erro de leitura sem reutilizar mensagens antigas.
- A correção aguarda execução do CI após o novo commit. Não foi publicada no Render.
- Ainda não se considera a Etapa 1 concluída: falta validar fluxos integrados de sessão/histórico e revisar o ciclo de envio/persistência. A compilação verde comprova apenas a validação automatizada executada, não o funcionamento ponta a ponta.
- Limitações já identificadas e mantidas explícitas: memória é manual/local ao navegador; rate limit em memória do processo; persistência em múltiplas operações; geração e pesquisa ainda exigem teste real com as credenciais e sessão do ambiente.
- Nenhuma alteração foi feita no Supabase, nas políticas RLS, em dados CJS ou em produção.
