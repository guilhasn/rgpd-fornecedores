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

## Instalação e Execução (Docker)

Esta é a forma recomendada de executar a aplicação completa (Frontend + Backend + BD).

1. Construir e iniciar os contentores:
   ```bash
   docker compose up -d --build
   ```
   *Nota: O build do Docker utiliza `npm` para garantir a resolução correta das dependências.*

2. A API irá correr automaticamente as migrações da base de dados no arranque.

3. Aceder à aplicação:
   - URL configurado no `VIRTUAL_HOST` (default: `http://rgpd.local`)
   - Se estiver local, adicione `127.0.0.1 rgpd.local` ao seu ficheiro hosts.

## Desenvolvimento Local

Se preferir correr localmente sem Docker:

### Backend
```bash
cd server
npm install
# Configure o .env com a sua BD local
npm run dev
```

### Frontend
```bash
# Na raiz do projeto
npm install
npm run dev
```

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