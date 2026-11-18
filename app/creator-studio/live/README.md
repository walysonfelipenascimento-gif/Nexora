# Nexora LIVE — referência visual aprovada

As duas imagens fornecidas pelo usuário são a especificação visual desta etapa. Não reinterpretar como inspiração genérica.

## 1. Tela de transmissão

Reproduzir a composição da primeira referência:
- Vídeo/câmera como plano de fundo em tela cheia, com enquadramento vertical no celular.
- No topo: selo vermelho "Live", contador de espectadores com ícone de olho e controle de fechar.
- Sobre o vídeo, no lado direito: avatar/convite de participação, reações com coração e contador, comentários e compartilhamento com seus respectivos contadores.
- Na parte inferior esquerda: comentários em fluxo, com avatar, nome, identificação de assinante/moderador quando aplicável e texto.
- Na base: campo para escrever comentário e ação de presente.
- Os elementos devem permanecer legíveis sobre o vídeo com fundos translúcidos e contraste adequado.

## 2. Analytics / Stream Summary

Reproduzir a composição da segunda referência:
- Cabeçalho "Analytics", avatar de perfil, calendário e navegação de retorno.
- Título "Stream Summary" e intervalo de data/horário.
- Grade de cartões em duas colunas, nesta ordem:
  1. Stream Duration
  2. Average Viewers
  3. Max Viewers
  4. Unique Viewers
  5. Unique Chatters
  6. Live Views
  7. Followers
  8. Clips
- Abaixo, cartões de gráficos para Average Viewers e Live Views.
- Na sequência, análises Views by Platform e Views by Location.
- Métricas de demonstração nunca devem ser apresentadas como dados reais.

## Regras de implementação

- Manter o Story existente intacto; LIVE é uma experiência separada.
- Construir primeiro a interface e os estados locais de prévia/encerramento.
- Não afirmar que existe transmissão pública real, audiência em tempo real ou analytics persistente enquanto não houver infraestrutura de mídia e backend.
- Não conectar nem alterar Supabase nesta etapa.
- Preservar a identidade Nexora sem alterar a estrutura visual especificada nas referências.
- Testar responsividade, especialmente a disposição vertical em celulares.
