# SETUP.md

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- `psql` CLI (optional, for manual migration)

## 1. Start Infrastructure

From the root of the repository (where `docker-compose.yml` lives):

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432` — auto-runs `init-db/01_init.sql` (creates tables + seeds assets)
- Elasticsearch on `localhost:9200`
- `es-initializer` container — creates the `security-alerts` index and seeds sample alerts

Wait ~15 seconds for all services to be healthy before starting the API.

## 2. Install Dependencies

```bash
cd siem-backend
npm install
```

## 3. Configure Environment

```bash
cp .env.example .env
```

The defaults in `.env.example` match the Docker Compose credentials; no changes needed for local development.

## 4. Start the API

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

## 5. Verify

```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{ "status": "healthy", "services": { "postgres": "up", "elasticsearch": "up" } }
```

## 6. Swagger UI

Open `http://localhost:3000/docs` in your browser for interactive API documentation.

## 7. Import elastic search

If you elastic search data has not imported, please run it outside docker container

```bash
./init-es/setup-es-out.sh

```
---

## Manual Migration (optional)

If you need to run the migration against an existing PostgreSQL instance:

```bash
export DATABASE_URL=postgres://backend_user:secretpassword@localhost:5432/siem_db
npm run migrate
```

Or directly:

```bash
psql postgres://backend_user:secretpassword@localhost:5432/siem_db \
  -f migrations/001_initial_schema.sql
```

---

## Sample API Calls

```bash
# Task 1 – Filter alerts by Finance department, page 1
curl "http://localhost:3000/api/alerts?department=Finance&page=1&limit=10"

# Task 1 – Filter by risk level
curl "http://localhost:3000/api/alerts?risk=critical"

# Task 2 – Top targeted assets dashboard
curl "http://localhost:3000/api/dashboard/top-targeted"

# Task 3 – Add a highlighted IP
curl -X POST http://localhost:3000/api/highlighted-ips \
  -H "Content-Type: application/json" \
  -d '{"ip_address":"185.220.101.5","label":"Tor exit node","reason":"Repeated scan attempts"}'

# Task 3C – Activity logs from highlighted IPs
curl "http://localhost:3000/api/highlighted-ips/activity/logs"

# Task 4 – Health check
curl "http://localhost:3000/api/health"
```
