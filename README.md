# UNICEF Kindergarten Platform

A localized Next.js frontend and NestJS/PostgreSQL API for kindergarten directories, evaluation forms, development plans, supply allocations, and report exports.

## Architecture

The repository is an npm workspace:

- `src/` contains the Next.js frontend, shared domain types, RBAC policy, scoring, and Drizzle schema.
- `api/` contains the NestJS API, session authentication, validation, and report services.
- `drizzle/` contains committed SQL migrations.
- `messages/` contains English, Arabic, and Central Kurdish translations.

The API is the security boundary. Do not expose or rely on browser `localStorage` for production data or authorization. The current frontend prototype still contains a local-state experience; production integration should use the API client and server-backed records for all protected workflows.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- PostgreSQL 14 or newer

## Environment

Copy the example file and replace every placeholder:

```bash
cp .env.example .env
openssl rand -base64 48
```

Required variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | At least 32 random characters used to sign session cookies |
| `API_PORT` | API listening port, normally `4000` |
| `API_ORIGIN` | API origin used by the Next.js rewrite |
| `WEB_ORIGIN` | Exact browser origin permitted by API CORS |
| `SEED_ADMIN_EMAIL` | Initial administrator email for local setup |
| `SEED_ADMIN_PASSWORD` | Initial administrator password, at least 12 characters |

Never commit `.env`, use the example password, or reuse `AUTH_SECRET` across environments.

## Install and database setup

```bash
npm install
npm run db:generate       # only needed after schema changes
npm run db:migrate
npm run db:seed
```

The seed command requires `SEED_ADMIN_PASSWORD` and creates or resets the configured administrator account. It stores an scrypt password hash, never the plaintext password.

## Run in development

Start the API:

```bash
npm run dev:api
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open <http://localhost:3000>. The API health endpoint is available at <http://localhost:4000/health>.

## Production checks and builds

```bash
npm run lint
npm run build
npm run build:api
npm run start:api
```

The API refuses to start unless `DATABASE_URL` and a sufficiently long `AUTH_SECRET` are present. Authentication uses an HTTP-only, SameSite session cookie. Caller-supplied role or site headers are not trusted.

## Security notes

- Passwords are hashed with scrypt.
- API authorization is derived from a signed session created after a database-backed login.
- CORS is restricted to `WEB_ORIGIN` and credentials are enabled only for that origin.
- Validation uses a global whitelist and rejects unknown fields.
- The API must be served over HTTPS in production so session cookies can use the `Secure` attribute.
- Complete the frontend migration to API-backed records before deploying as a multi-user production application; browser-local state is not a secure persistence layer.
