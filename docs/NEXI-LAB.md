# Nexi Lab — laboratório de inteligência e qualidade

## Objetivo
Validar API, motores, ferramentas e regressões da Nexi de forma repetível, sem consumir créditos externos por padrão e sem alterar o Supabase.

## 1. Camadas de validação
- **Contrato HTTP:** estrutura, validação, limites e códigos de erro.
- **Integração simulada:** provedores mockados para respostas, citações, falhas e timeout.
- **Status/health:** distingue configuração, autenticação, disponibilidade do servidor e presença do modelo.
- **Compatibilidade de motores:** adaptadores OpenAI Responses e Ollama compatível.
- **CI:** GitHub Actions executa a suíte antes do lint Nexi e build.

## 2. Comandos
- `npm run test:nexi` — testes determinísticos da rota de chat e status.
- `npm run test:nexi:watch` — modo watch local (somente testes da rota de chat).

## 3. Matriz inicial de motores
| Capacidade | OpenAI Responses | Ollama compatível |
|---|---|---|
| Chat | Implementado | Implementado |
| Pesquisa web nativa | Disponível quando habilitada | Ainda não integrada |
| Citações da pesquisa | Parser Responses | Não disponível no adaptador atual |
| Status | Verifica autenticação | Verifica endpoint e modelo |
| Testes automatizados | Mock | Mock |

“Disponível” descreve integração no código; não comprova configuração operacional ou teste ao vivo no serviço.

## 4. Ferramentas e critérios
Cada nova ferramenta deve declarar:
- esquema de entrada e saída validado;
- permissões e confirmação necessárias;
- timeout, limites e tratamento de erros;
- testes unitários e de integração simulada;
- origem e atribuição de resultados (citações quando aplicável);
- telemetria sem conteúdo privado ou segredos.

## 5. Qualidade de respostas
Próxima camada planejada: conjunto versionado de casos de avaliação, avaliando:
- aderência ao pedido;
- clareza e consistência;
- factualidade e uso correto das fontes;
- segurança e transparência;
- regressões entre versões/modelos.

Avaliações de qualidade não devem fingir ser uma pontuação objetiva universal; resultados precisam de critérios explícitos e revisão.

## 6. Testes reais opt-in
Executar chamadas reais somente por acionamento explícito em ambiente de staging, com limites de custo e segredos armazenados no GitHub/Render. Não usar a produção como alvo padrão. Nunca incluir chaves nos logs ou no código.

## 7. Segurança e limites
- Sem credenciais em testes ou logs.
- Testes usam respostas simuladas e endereços/IPs fictícios.
- Sem chamadas reais a OpenAI/Ollama na suíte padrão.
- Sem migrações, DDL, alterações de dados ou políticas RLS no Supabase.
- Desenvolvimento na branch `nexi/auditoria-reestruturacao-profissional`.
- Não publicar no Render nem mesclar PR sem autorização explícita.

## 8. Roadmap
1. Validar CI da suíte e corrigir falhas.
2. Adicionar testes para ferramentas e memória.
3. Criar harness de avaliação de respostas (dataset versionado).
4. Instrumentar métricas de latência/erros sem conteúdo.
5. Construir painel Nexi Lab em ambiente de desenvolvimento.
6. Preparar staging isolado para teste real opt-in.
