# Nexora — planejamento oficial de reconstrução de Mensagens

**Status:** especificação aprovada pelo usuário em 2026-11-09.  
**Fonte principal:** imagem enviada nesta conversa. A imagem é o planejamento-alvo, não uma referência opcional.  
**Regra de execução:** reconstruir a página dedicada para corresponder a esta composição e preservar os recursos já existentes; não publicar no Render nem integrar Supabase nesta etapa.

## 1. Direção visual e composição obrigatória

- Identidade Nexora: interface escura, fundo espacial azul profundo, brilhos controlados em azul elétrico/ciano/roxo/magenta, bordas finas luminosas, cantos arredondados, tipografia clara e acabamento premium.
- Navegação global superior: Início, Reels, Criar, Mensagens (selecionado) e Perfil, com avatar da conta.
- Três áreas principais:
  1. **Coluna lateral esquerda:** título/ícone Mensagens, busca, filtros/atalhos, cartão Nexi IA, sugestões de contatos e cartão de personalização.
  2. **Coluna central:** seletor de caixa de entrada, botão de nova conversa, faixa horizontal de Stories/Notas e lista de conversas com avatar, nome, verificação quando aplicável, prévia, horário e contador de não lidas; conversas arquivadas no rodapé.
  3. **Painel direito:** conversa completa aberta, cabeçalho do contato, status, ações de áudio/vídeo e menu; aviso de privacidade; histórico integral de mensagens; compositor fixo no rodapé.
- Abaixo das três colunas, quatro cartões de acesso rápido: chamada de voz/vídeo, tradução, compartilhamento de arquivos e configurações da conversa.
- Rodapé institucional com marca Nexora e slogan “Conectando pessoas, marcas e oportunidades.”
- Adaptar a telas menores sem perder acesso às conversas e ações; no celular, reorganizar em navegação/abas ou telas empilhadas, sem comprimir três colunas ilegíveis.

## 2. Regras de conta e módulos

- **Pessoal é o padrão.**
- **Comercial e Pedidos são módulos condicionados à conta profissional.** A estrutura técnica fica preparada agora, mas abas, dados, ações e opções comerciais só aparecem quando o perfil tiver conta profissional ativada.
- Não inventar nem ativar categorias comerciais por padrão. As opções detalhadas de tipos comerciais serão adicionadas depois.
- Solicitações de contato continuam separadas de conversas aceitas.
- A separação entre mensagens pessoais e comerciais também deve valer nas integrações com Nexora Loja e perfis profissionais.

## 3. Notas e faixa de contatos

- Preservar o recurso **Notas** no topo da caixa de entrada, associado aos contatos e à própria conta.
- Permitir criar/editar a própria nota, escolher os estilos visuais existentes e exibir notas dos contatos.
- Preservar a faixa de Stories/contatos do planejamento, com rolagem horizontal e estado visual de presença.
- Não remover Notas durante a extração da página antiga nem substituí-las por uma faixa genérica de Stories.

## 4. Conversa aberta

- Cabeçalho com avatar, nome, selo de verificação quando aplicável, presença/estado e atalhos de chamada, vídeo e opções.
- Aviso de privacidade/criptografia na área da conversa.
- Histórico completo com mensagens enviadas e recebidas, horários, estados de envio/leitura quando disponíveis, respostas a mensagens, reações, menções e compartilhamentos.
- Suportar texto, emoji, imagens, áudio/voz, arquivos e compartilhamento de Stories conforme os recursos existentes.
- Imagens: limite de 15 MB no protótipo, sem compressão da imagem original, sem moldura/borda decorativa e com abertura em visualização ampliada. Até a integração de armazenamento, URLs locais podem ser temporárias.
- Compositor inferior com anexos, imagem/galeria, emoji, presente/atalhos previstos no desenho, campo de texto e botão de enviar.
- Manter a experiência de tradução próxima ao compositor e o seletor de idioma.

## 5. Configurações e prévia do perfil

- Ao abrir **Configurações da conversa** a partir do cabeçalho/menu, a tela/painel começa com uma **prévia do perfil do contato**: avatar, nome, @usuário, selo/status quando existentes e acesso às informações do perfil.
- A prévia é obrigatória e não pode ser substituída por uma página de configurações genérica.
- Abaixo da prévia, organizar configurações e atalhos para perfil, mídia, tradução, áudio/vídeo, papel de parede e demais controles existentes.
- Preservar preferências: silenciar notificações, confirmações de leitura, salvar mídia automaticamente, modo efêmero e controles de grupo (administradores/publicação apenas por administradores), quando aplicáveis.
- Preservar mídia/links/documentos, bloquear contato, apagar conversa/sair de grupo e informações do grupo conforme o tipo de conversa.

## 6. Recursos Nexora que precisam ser preservados

- Nexi IA como cartão/atalho separado; não misturar a assistente com conversas pessoais ou comerciais.
- Farma Aura/Pulse por contato, com nível/progresso, interações e decaimento após 72 horas sem interação conforme a lógica já existente.
- Tradução com 25 idiomas e Português (Brasil) como padrão; preferências de idioma e tradução automática. A interface pode estar pronta enquanto o serviço real de tradução permanece pendente.
- Papéis de parede por conversa (a implementação atual contém 20 estilos) e estilos de balões por conversa; manter pré-visualização e opção de aplicar para mim/ambos.
- Chamadas de áudio/vídeo com escolha do tipo e interface de chamada; chamadas reais/WebRTC permanecem pendentes.
- Criação/gestão de canais públicos, respeitando o requisito de 15 mil seguidores já presente.
- Busca por contatos/conversas/mensagens, filtros de todas/não lidas/grupos, contadores, conversas arquivadas e solicitações.
- Integrações: abrir conversa a partir de perfil; mensagens privadas e compartilhamento de Stories; partilha de posts/Reels; iniciar pedido/contato a partir da Loja, respeitando o bloqueio do módulo comercial para contas não profissionais.

## 7. Estado técnico conhecido antes da reconstrução

- A implementação anterior estava embutida no painel messages-app de app/page.tsx, não numa página dedicada independente.
- A página antiga possui estados, funções e persistência local para conversas, papéis de parede, estilos de balões, Farma Aura/Pulse e configurações. A reconstrução deve reaproveitar/migrar essa lógica, não descartá-la.
- Chaves locais conhecidas: nexora-chat-threads-v1, nexora-chat-wallpapers-v1, nexora-chat-bubble-styles-v1, nexora-chat-settings-v1, nexora-chat-pulse-v1, nexora-chat-auto-translate-v1 e nexora-chat-translation-language-v1.
- Mensagens e preferências locais não equivalem a sincronização real entre usuários.
- Imagens com URL.createObjectURL são temporárias e não substituem armazenamento permanente.
- Tradução efetiva, chamadas reais/WebRTC, sincronização entre usuários, armazenamento permanente de mídia e notificações em tempo real dependem de etapas futuras.
- Supabase continua reservado para a etapa final. Não alterar projeto/tabelas Supabase nesta reconstrução e não tocar em dados do CJS.

## 8. Arquitetura de implementação sugerida

Extrair a experiência para módulos/componentes dedicados, mantendo uma única fonte coerente de estado e adaptadores para a persistência atual:
- MessagesPage / MessagesLayout
- MessagesSidebar
- MessagesInbox (busca, filtros, Notas, Stories, lista e arquivadas)
- ChatConversation (cabeçalho, segurança, histórico e compositor)
- ChatProfilePreview
- ChatSettings
- ChatCustomization (papel de parede e balões)
- ChatTranslation
- ChatCalls
- ChatMedia
- ChatNotes
- NexiShortcut
- ProfessionalMessagesModule (estrutura pronta, protegida por estado de conta profissional)

Os nomes são uma proposta de organização; o requisito é a separação clara de responsabilidades e a preservação funcional.

## 9. Critérios de conclusão

1. A página dedicada reproduz a composição e hierarquia da imagem enviada.
2. A conversa selecionada aparece completa no painel direito, sem navegar para uma página genérica que esconda a lista de contatos.
3. Notas e faixa de Stories/contatos continuam presentes.
4. Configurações da conversa abrem com prévia do perfil do contato.
5. Abas/módulos comerciais e pedidos só aparecem quando a conta profissional estiver ativa; a estrutura fica pronta para expansão futura.
6. Todos os recursos existentes continuam acessíveis ou são explicitamente identificados como dependentes de backend.
7. Dados e preferências locais existentes são preservados/migrados; nenhuma chave de armazenamento é apagada sem migração planejada.
8. Testes de build, navegação, responsividade e interações são concluídos antes de considerar a reconstrução pronta.
9. Não iniciar deploy automático/manual nem publicar no Render sem pedido explícito do usuário.
10. Não conectar Supabase nesta fase.
