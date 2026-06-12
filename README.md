# SIEM Backend

Mini SIEM Dashboard backend built with **Express.js**, integrating **PostgreSQL** (asset inventory) and **Elasticsearch** (security alerts).

## Architecture

```
src/
├── config/          # DB & ES clients
├── routes/          # Express routers
├── controllers/     # Request/response layer
├── services/        # Business logic & data access
├── middleware/       # Error handler, validation
└── server.js        # Entry point
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/alerts` | Task 1 – Filter alerts by department/risk |
| GET | `/api/dashboard/top-targeted` | Task 2 – Top 5 targeted assets |
| GET | `/api/highlighted-ips` | Task 3 – List highlighted IPs |
| POST | `/api/highlighted-ips` | Task 3 – Add highlighted IP |
| GET | `/api/highlighted-ips/:id` | Task 3 – Get by ID |
| PUT/PATCH | `/api/highlighted-ips/:id` | Task 3 – Update |
| DELETE | `/api/highlighted-ips/:id` | Task 3 – Delete |
| GET | `/api/highlighted-ips/activity/logs` | Task 3C – Activity from highlighted IPs |
| GET | `/api/health` | Task 4 – Health check |
| GET | `/docs` | Swagger UI |

## Query Parameters – `GET /api/alerts`

| Param | Type | Description |
|-------|------|-------------|
| `department` | string | Filter by department (e.g. `Finance`) |
| `risk` | string | Filter by risk level (`low`, `medium`, `high`, `critical`) |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 20, max: 100) |
| `sort` | string | Sort by timestamp: `asc` or `desc` (default: `desc`) |

## Design Decisions

- **Two-step enrichment (Tasks 1 & 2):** PostgreSQL is queried first to resolve asset IPs by department/risk, then Elasticsearch uses those IPs in a `terms` filter. This avoids ES having to know about asset ownership.
- **Aggregation for Task 2:** ES `terms` aggregation on `network_target_ip` with `size: 5` efficiently handles millions of records.
- **`highlighted_ips` schema:** Separate table with `UNIQUE` constraint on `ip_address`, plus `label` and `reason` fields for analyst context.
- **Connection pooling:** `pg.Pool` with 10 connections for PostgreSQL efficiency.
- **Request validation:** `express-validator` on all inputs; IP format validated on create/update.

## Assumptions & Trade-offs

- ES index `security-alerts` must exist before the API starts (created by `init-es/setup-es.sh`).
- No authentication layer — out of scope for this assessment.
- `sort` only applies to `timestamp`; multi-field sort is a future improvement.
