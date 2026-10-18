# Nexora — dados sintéticos para testes

O arquivo `synthetic-profiles-1000.json` contém 1.000 perfis gerados artificialmente para testes internos de interface, pesquisa, paginação e desempenho.

## Proteções
- Todos os registros têm `isSynthetic: true` e `environment: "TEST_ONLY"`.
- Os nomes são rótulos de teste, não identidades de pessoas reais.
- Não são contas autenticadas, não geram seguidores, curtidas ou visualizações reais.
- O arquivo fica isolado como fixture; não é importado automaticamente pelo Feed nem pelo Supabase.
- Não importar este arquivo para as tabelas de usuários de produção.

## Próxima etapa
Quando a camada de dados for conectada no fim do projeto, podemos criar um ambiente de teste separado e medir consultas e paginação com esse conjunto, sem misturar os registros com usuários reais ou com as tabelas do CJS.
