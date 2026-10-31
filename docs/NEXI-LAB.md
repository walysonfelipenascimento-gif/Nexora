# Nexi Lab — laboratório de inteligência e qualidade

## Objetivo
Validar API, motores, ferramentas e regressões da Nexi de forma repetível, sem consumir créditos externos por padrão e sem alterar o Supabase.

## 1. Camadas de validação
- **Contrato HTTP:** estrutura, validação, limites e códigos de erro.
- **Integração simulada:** provedores mockados para respostas, citações, falhas e timeout.
- **Status/health:** distingue configuração, autenticação, disponibilidade do servidor e presença do modelo.
- **Compatibilidade de motores:** adaptadores OpenAI Responses e Ollama compatível.
- **CI:** GitHub Actions executa a suíte antes do lint Nexi e build.
- **Tool Core:** registro tipado, schemas allow-list, limite de entrada/saída, timeout e regra de confirmação.

## 2. Comandos
- `npm run test:nexi` — rota de chat, status, fixtures de avaliação e Tool Core.
- `npm run test:nexi:watch` — modo watch da suíte Nexi completa.

## 3. Matriz inicial de motores
| Capacidade | OpenAI Responses | Ollama compatível |
|---|---|---|
| Chat | Implementado | Implementado |
| Pesquisa web nativa | Disponível quando habilitada | Ainda não integrada |
| Citações da pesquisa | Parser Responses | Não disponível no adaptador atual |
| Status | Verifica autenticação | Verifica endpoint e modelo |
| Testes automatizados | Mock | Mock |

“Disponível” descreve integração no código; não comprova configuração operacional ou teste ao vivo no serviço.

## 4. Tool Core
Arquivo `lib/nexi/tools.ts` mantém metadados declarativos das ferramentas e validação estrita. A primeira lista cobre pesquisa pública, rascunho de conteúdo e análise de dados de perfil fornecidos pela pessoa.
- rejeita campos extras, tipo errado e valores acima do limite;
- cada definição possui timeout e teto de saída;
- ferramentas externas e de escrita são marcadas para exigir confirmação antes da execução;
- ainda não executa ações arbitrárias nem acessa URLs fornecidas pelo modelo.
- testes em `tests/nexi-tools.test.ts`.

## 5. Qualidade de respostas
Fixtures determinísticas em `tests/nexi-evals.test.ts` cobrem:
- idioma pt-BR e resposta orientada a etapas;
- transparência sobre pesquisa;
- privacidade e segredos;
- honestidade sobre ações externas.

Esses testes validam os critérios e fixtures, não pontuam respostas ao vivo do modelo. Próxima camada: runner de avaliação opt-in, com critérios e revisão humana.

## 6. Testes reais opt-in
Executar chamadas reais somente por acionamento explícito em ambiente de staging, com limites de custo e segredos armazenados no GitHub/Render. Não usar a produção como alvo padrão. Nunca incluir chaves nos logs ou no código.

## 7. Segurança e limites
- Sem credenciais em testes ou logs.
- Testes usam respostas simuladas e endereços/IPs fictícios.
- Sem chamadas reais a OpenAI/Ollama na suíte padrão.
- Sem migrações, DDL, alterações de dados ou políticas RLS no Supabase.
- Desenvolvimento na branch `nexi/auditoria-reestruturacao-profissional`.
- Deploy em Render só após CI verde e revisão da integração.

## 8. Roadmap
1. Validar CI da suíte e corrigir falhas.
2. Expandir Tool Core e adapters com testes.
3. Construir harness de avaliação de respostas (dataset versionado).
4. Instrumentar métricas de latência/erros sem conteúdo.
5. Construir painel Nexi Lab em ambiente de desenvolvimento.
6. Preparar staging isolado para teste real com limites de custo.
7. Projetar memória persistente em Supabase sem alterar RLS, com leitura/escrita escopadas ao usuário e migração revisável.
