# Nexora — dados sintéticos para testes

O arquivo `synthetic-profiles-1000.json` contém 1.000 perfis gerados artificialmente para testes internos de interface, pesquisa, paginação e desempenho.

O arquivo `synthetic-follow-simulation.json` contém 1.000 relações de seguimento **simuladas** desses perfis para `@Licinhosz.bb`, identificado no cenário como criador da Nexora.

## Proteções
- Todos os registros têm `isSynthetic: true` e `environment: "TEST_ONLY"`.
- Os nomes são rótulos de teste, não identidades de pessoas reais.
- Não são contas autenticadas e não geram seguidores, curtidas, notificações ou visualizações reais.
- Os arquivos ficam isolados como fixtures; não são importados automaticamente pelo Feed, pelo perfil público nem pelo Supabase.
- Não importar estes arquivos para as tabelas de usuários ou seguidores de produção.

## Próxima etapa
Quando a camada de dados for conectada no fim do projeto, podemos carregar estes fixtures apenas em um ambiente de teste separado e medir consultas, paginação, contagens e notificações sem misturar os registros com usuários reais ou com as tabelas do CJS.
