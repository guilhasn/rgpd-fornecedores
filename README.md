# RGPD Gestão de Fornecedores

Aplicação para gestão de processos de fornecedores e conformidade RGPD.

## Modos de Funcionamento

A aplicação suporta dois modos de persistência, configuráveis via `.env`:

### 1. Modo Demo (Local)
Guarda os dados no `localStorage` do browser. Ideal para demonstração rápida ou desenvolvimento frontend isolado.
```ini
VITE_STORAGE_MODE=local
```

### 2. Modo Produção (API)
Guarda os dados no PostgreSQL através da API Node.js.
```ini
VITE_STORAGE_MODE=api
VITE_API_BASE=/api
```

## Como Correr (Docker)

A aplicação está configurada para correr totalmente em Docker. O `docker-compose.yml` já configura o ambiente para usar a API.

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

## Desenvolvimento Local

Para correr o frontend localmente contra a API local:
1. `cd server && npm install && npm run dev`
2. `npm install && npm run dev`