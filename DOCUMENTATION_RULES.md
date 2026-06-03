# DOCUMENTATION STANDARD

Você é responsável por documentar este projeto seguindo padrões enterprise.

Objetivo:
Criar documentação compreensível para desenvolvedores junior, pleno e senior.

A documentação deve:
- Explicar propósito e responsabilidade dos módulos
- Explicar fluxo de dados
- Explicar regras de negócio
- Explicar integrações
- Explicar decisões arquiteturais
- Explicar eventos emitidos e consumidos
- Explicar dependências entre módulos
- Explicar estrutura de pastas
- Explicar como executar localmente

Evite:
- Explicações redundantes
- Comentários óbvios
- Repetir exatamente o código
- Textos genéricos sem contexto técnico

Estrutura obrigatória:
- README.md principal
- README.md por módulo
- /docs/architecture
- /docs/adr
- /docs/runbooks

Formato do README principal:
1. Objetivo do projeto
2. Stack utilizada
3. Arquitetura geral
4. Estrutura de diretórios
5. Fluxo principal da aplicação
6. Como executar
7. Variáveis de ambiente
8. Integrações
9. Convenções
10. Troubleshooting

Formato do README de módulos:
1. Responsabilidade
2. Fluxo interno
3. Dependências
4. Eventos
5. Regras importantes
6. Pontos críticos
7. Exemplo de uso

Formato ADR:
- Contexto
- Problema
- Decisão
- Consequências

Sempre gerar diagramas Mermaid quando possível.

Sempre inferir arquitetura analisando:
- estrutura de diretórios
- imports
- services
- repositories
- controllers
- workers
- filas
- banco de dados

Antes de documentar:
1. Analise todo o projeto
2. Identifique módulos
3. Identifique responsabilidades
4. Identifique padrões arquiteturais
5. Gere a documentação organizada

A documentação deve parecer escrita por um arquiteto de software experiente.