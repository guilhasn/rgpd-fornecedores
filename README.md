# RGPD Gestão de Fornecedores

Aplicação para gestão de processos de fornecedores e conformidade RGPD.

## Estrutura
- **Frontend**: React + Vite + Tailwind (Porta 8080)
- **Backend**: Node.js + Express + Prisma (Porta 3001 - Interna)
- **Database**: PostgreSQL (Porta 5432 - Interna)

## Como Correr (Docker)

A aplicação está configurada para correr totalmente em Docker.

1. **Construir e Iniciar:**
   ```bash
   docker compose up -d --build
   ```

2. **Aceder à Aplicação:**
   - Frontend: http://localhost:8080
   - A API é acessível internamente ou via proxy em http://localhost:8080/api

3. **Verificar Estado da Base de Dados:**
   ```bash
   # Listar tabelas criadas
   docker compose exec db psql -U user -d mydatabase -c "\dt"
   ```

## Resolução de Problemas Comuns

- **Erro "Prisma failed to detect libssl":** O Dockerfile usa `node:20-bookworm-slim` para garantir compatibilidade com OpenSSL 3.
- **Erro "Cannot find module dist/index.js":** Certifique-se que o passo `RUN npm run build` completou com sucesso no Dockerfile.
- **Reiniciar Migrações:** Se necessário limpar tudo:
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```