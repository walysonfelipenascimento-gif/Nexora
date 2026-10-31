# Nexi Lab — laboratório de inteligência e qualidade

## Objetivo
Validar a API da Nexi e futuras ferramentas/motores com testes repetíveis, sem consumir créditos de modelos externos por padrão e sem tocar no banco Supabase.

## Camadas
1. **Testes de contrato da API** — formatos de entrada/saída, validação e códigos HTTP.
2. **Testes de integração simulada** — mock do provedor para respostas, pesquisa/citações, configuração ausente e timeout.
3. **Testes de motores** — suíte separada para OpenAI Responses e endpoints compatíveis com Ollama.
4. **Testes de ferramentas** — cada capacidade (pesquisa, citações e futuras ferramentas) recebe testes de contrato e falha.
5. **CI** — GitHub Actions executa a suíte Nexi antes do lint direcionado e build.
6. **Testes reais opt-in** — só futuramente, mediante acionamento explícito e ambiente de teste; nunca executados automaticamente contra produção nem com segredos expostos.

## Comandos
- `npm run test:nexi` — executa testes determinísticos.
- `npm run test:nexi:watch` — modo observação local.

## Segurança
- Segredos não entram nos testes nem nos logs.
- Testes usam IPs fictícios e respostas simuladas.
- Nenhuma chamada real a OpenAI/Ollama é feita pela suíte padrão.
- Sem migrações, DDL ou alterações em políticas RLS do Supabase.
- O laboratório é desenvolvido na branch `nexi/auditoria-reestruturacao-profissional`; não publicar em produção sem autorização.

## Próximas expansões
- Testes de status/health e configuração de motores.
- Matriz de compatibilidade de modelos e capacidades.
- Testes de qualidade de resposta com critérios e conjuntos versionados.
- Métricas de latência, erro e consumo em ambiente de staging.
- Adaptadores de ferramentas com permissões e validação explícita.
