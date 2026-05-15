# Deployment Guide (Render / Railway)

## Render
1. Create a PostgreSQL database (or NeonDB) and copy the connection string.
2. Create a Web Service from this repository.
3. Set environment variables from `.env.example`.
4. Build command: `npm ci && npx prisma generate`.
5. Start command: `npx prisma migrate deploy && npm start`.

## Railway
1. Provision PostgreSQL and copy `DATABASE_URL`.
2. Add the same env vars as `.env.example`.
3. Set start command to `npx prisma migrate deploy && npm start`.
4. Deploy and verify `/about` and `/openapi.json`.
