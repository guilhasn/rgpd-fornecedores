# RGPD Gestão de Fornecedores

Aplicação para gestão de conformidade RGPD de fornecedores e subcontratantes.

## Stack Tecnológica

- **Frontend:** React + Vite (Port 80 via Nginx)
- **Backend:** Node.js + Express (Port 3001 internal)
- **Database:** PostgreSQL 15 (Port 5432 internal)
- **ORM:** Prisma
- **Infra:** Docker Compose

## Pré-requisitos

1. Docker e Docker Compose instalados.
2. Network externa `proxy` criada (para o reverse proxy):
   ```bash
   docker network create proxy
   ```

## Instalação e Execução

1. Construir e iniciar os contentores:
   ```bash
   docker compose up -d --build
   ```

2. A API irá correr automaticamente as migrações da base de dados no arranque.

3. Aceder à aplicação:
   - URL configurado no `VIRTUAL_HOST` (default: `http://rgpd.local`)
   - Se estiver local, adicione `127.0.0.1 rgpd.local` ao seu ficheiro hosts.

## Gestão da Base de Dados

### Verificar tabelas
```bash
docker compose exec db psql -U user -d mydatabase -c "\dt"
```

### Popular com dados de teste (Seed)
```bash
docker compose exec api npm run db:seed
```

### Reset à base de dados
```bash
docker compose exec api npx prisma migrate reset
```

## API Endpoints

- `GET /api/processes` - Listar processos (filtros: q, status, risk, page)
- `POST /api/processes` - Criar novo processo
- `GET /api/processes/:id` - Detalhes do processo
- `PUT /api/processes/:id` - Atualizar processo
- `DELETE /api/processes/:id` - Remover processo
- `GET /api/uos` - Listar unidades orgânicas