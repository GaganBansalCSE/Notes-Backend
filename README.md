# Notes Backend

Production-grade multi-user Notes SaaS backend using Node.js, Express, Prisma ORM, and PostgreSQL.

## Features
- JWT auth with refresh token rotation and revocation
- bcrypt password hashing
- Notes CRUD with ownership + read-only sharing
- Soft delete (`deletedAt`)
- PostgreSQL full-text search with GIN index
- Note version history and restore with audit trail
- Optimistic concurrency using `version`
- Zod validation + centralized error handling
- Helmet, CORS, rate-limiting, payload-size limits, input sanitization
- Structured logging with Pino
- OpenAPI JSON endpoint at `/openapi.json`
- Docker + docker-compose
- Jest + Supertest tests

## Setup
```bash
cp .env.example .env
npm install
npx prisma generate
npm run prisma:migrate
npm run dev
```

## Scripts
- `npm run dev` - start development server
- `npm start` - start production server
- `npm test` - run tests
- `npm run prisma:generate` - generate prisma client
- `npm run prisma:migrate` - create/apply local migration
- `npm run prisma:deploy` - apply migrations in production

## API Endpoints
- `POST /register`
- `POST /login`
- `POST /refresh-token`
- `POST /logout`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `POST /notes/:id/share`
- `GET /notes/:id/history`
- `POST /notes/:id/restore/:versionId`
- `GET /search?q=`
- `GET /openapi.json`
- `GET /about`

## Prisma migration notes
After creating your initial migration, keep the custom full-text index migration:
- `prisma/migrations/20260515190000_add_note_search_index/migration.sql`

This migration creates a GIN index:
```sql
CREATE INDEX IF NOT EXISTS note_search_idx
ON "Note"
USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
```

## Docker
```bash
docker-compose up --build
```

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md)
