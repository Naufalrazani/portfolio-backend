# Backend Deployment Guide (Render Free + NeonDB)

## Prerequisites

- A [Neon](https://neon.tech) account with a PostgreSQL project
- A [Cloudinary](https://cloudinary.com) account (for image/file uploads)
- A [Render](https://render.com) account
- Node.js installed locally (for running migrations and seeding)
- The GitHub repo `Naufalrazani/portfolio-backend`

---

## 1. Neon Database Setup

1. Create a new project in Neon.
2. Copy the **pooled connection string** from the Neon Dashboard:
   ```
   postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this — you will need it as `DATABASE_URL` in both your local `.env` and Render environment.

**About the connection string:**

- Use the **pooled** connection string from Neon (the default one shown in the dashboard).
- Neon's pooled endpoint uses PgBouncer, which is compatible with the `@prisma/adapter-pg` driver adapter used by this project.
- Include `?sslmode=require` — Neon requires SSL connections.

---

## 2. Render Web Service Setup

1. Connect the GitHub repo `Naufalrazani/portfolio-backend` to Render.
2. Select **Web Service**.
3. Choose the **Free** instance type.
4. Configure:
   - **Name**: `portfolio-backend` (or your choice)
   - **Region**: closest to your users (e.g., Oregon or Singapore)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Why `npm install` is sufficient

The `package.json` defines `"postinstall": "prisma generate"`. This runs automatically after `npm install` completes. It generates the Prisma Client from `prisma/schema.prisma` into `prisma/generated/prisma/`. No additional build step is needed.

### Why `npm start` is correct

`npm start` runs `node src/server.js`. The server reads `process.env.PORT` (set automatically by Render) and binds to `0.0.0.0:<PORT>`. On the Free plan, Render sets `PORT` to `10000` by default.

### Render Free limitations that apply

| Feature | Available on Free? |
|---|---|
| Build command | Yes |
| Start command | Yes |
| Environment variables | Yes |
| Auto-deploys | Yes |
| Health checks | Yes |
| Shell / SSH | **No** |
| Pre-deploy commands | **No** |
| One-off jobs | **No** |
| Persistent disks | **No** |

**Implication**: Database migrations and admin seeding cannot be run from Render. They must be run locally against the production Neon database. See Steps 3 and 4 below.

---

## 3. Apply Database Migrations (Local, One-Time)

Since Render Free does not support Shell or pre-deploy commands, migrations must be run from your local machine against the production Neon database.

### Steps

1. In the backend repo root, create or update your `.env` file with the production `DATABASE_URL`:

   ```
   DATABASE_URL="postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

2. Run the migration:

   ```bash
   npx prisma migrate deploy
   ```

3. Verify it succeeded. You should see output like:

   ```
   migrate deploy
   No pending migrations to apply.
   ```

   or

   ```
   migrate deploy
   Applying migration(s) ...
   ```

4. **Remove or clear the `DATABASE_URL` from your local `.env`** after running, to avoid accidentally connecting to production during development.

### What this does

`prisma migrate deploy` applies all pending migrations from `prisma/migrations/` to the database. It does not create new migrations, reset the database, or modify existing data. It is safe to run multiple times — it only applies migrations that haven't been applied yet.

### When to re-run

Run `npx prisma migrate deploy` locally whenever:

- You pull new migrations from the repository
- You push a schema change that includes a new migration
- After any `prisma migrate dev` that generated a new migration folder

---

## 4. Seed the Admin User (Local, One-Time)

The admin user is required for the login system. It is created by the seed script, which is idempotent — if the admin already exists, it skips creation.

### Steps

1. Set these environment variables in your local `.env`:

   ```
   DATABASE_URL="postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   SEED_ADMIN_USERNAME="admin"
   SEED_ADMIN_PASSWORD="your-strong-password-here"
   ```

   **Use the same credentials you will later set in Render.**

2. Run the seed:

   ```bash
   npm run seed:admin
   ```

3. Expected output:

   ```
   Admin user created successfully.
   ```

   Or if it already exists:

   ```
   Admin user already exists. Skipping creation.
   ```

4. **Remove or clear `DATABASE_URL`, `SEED_ADMIN_USERNAME`, and `SEED_ADMIN_PASSWORD` from your local `.env`** after running.

### Safety

- The seed script reads `SEED_ADMIN_USERNAME` and `SEED_ADMIN_PASSWORD` from environment variables, not hardcoded values.
- The script checks if the admin already exists before creating.
- It is safe to run multiple times — it will not create duplicates.
- Always verify your `DATABASE_URL` points to the correct database before running.

---

## 5. Demo Seed (Development Only)

The demo seed script is blocked in production:

```js
if (process.env.NODE_ENV === "production") {
  console.error("Demo seed cannot run in production.");
  process.exit(1);
}
```

It can only run when `NODE_ENV` is not `production`. It is intended for local development and testing. Do not run it against production.

---

## 6. Render Environment Variables

Set these in Render → your service → **Environment** tab:

### Runtime Required

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:xxxx@ep-xxxx.neon.tech/neondb?sslmode=require` | Neon pooled connection string |
| `JWT_SECRET` | `<random-32-char-hex-string>` | At least 32 characters |
| `NODE_ENV` | `production` | Must be `production` |

### Runtime Conditional

| Variable | Example | Notes |
|---|---|---|
| `CORS_ORIGIN` | `https://<VERCEL_PRODUCTION_URL>` | **Required in production.** Comma-separated list of allowed origins. |
| `PORT` | (omit) | Render sets this automatically. Do not override unless needed. |

### Runtime Optional (Cloudinary)

| Variable | Example | Notes |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Required only if image/file uploads are used |
| `CLOUDINARY_API_KEY` | `your-api-key` | Required only if image/file uploads are used |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | **Backend only.** Never exposed to the frontend. |

### Bootstrap Only

| Variable | Example | Notes |
|---|---|---|
| `SEED_ADMIN_USERNAME` | `admin` | Used by `seed:admin` script only |
| `SEED_ADMIN_PASSWORD` | `your-strong-password` | Used by `seed:admin` script only |

**Note**: `SEED_ADMIN_*` variables are not required by the running application. They are only read by `scripts/seed-admin.js`. You may remove them from Render after the initial admin seed if desired, or keep them for re-running the seed.

### Generating a JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. CORS Configuration

In production, the backend only allows requests from origins listed in the `CORS_ORIGIN` environment variable.

```
CORS_ORIGIN=https://<VERCEL_PRODUCTION_URL>
```

For multiple allowed origins, use a comma-separated list:

```
CORS_ORIGIN=https://portfolio-frontend.vercel.app,https://www.your-domain.com
```

**Do not use wildcards (`*`) in production.** The backend implementation does not support wildcard CORS.

The CORS middleware is only restrictive in production. In development (`NODE_ENV !== "production"`), CORS is fully open (no origin restriction).

---

## 8. Neon Connection Details

| Property | Value |
|---|---|
| Adapter | `@prisma/adapter-pg` (PrismaPg) |
| Connection string | `DATABASE_URL` env var |
| SSL | Required (`sslmode=require`) |
| Pool max | 5 connections |

The PrismaPg adapter manages its own connection pool. The `max: 5` setting keeps Neon connection counts low, which is important for free-tier database plans with connection limits.

**Do not use `DIRECT_DATABASE_URL`** unless you have a specific need for direct connections (e.g., `prisma migrate dev` during development). The pooled endpoint is correct for production.

---

## 9. Cloudinary Configuration

| Concern | Implementation |
|---|---|
| Image uploads | JPEG, PNG, WebP only. Max 5MB. Magic-byte validated. |
| PDF uploads | Resume only. Max 10MB. Magic-byte validated (`%PDF` header). |
| Upload strategy | Create new, then delete old (prevents data loss on failure). |
| URL format | `secure: true` — all URLs are HTTPS. |
| Public IDs | Images: auto-generated by Cloudinary. PDFs: sanitized filename stem (no extension). |
| Deletion | Gracefully fails if Cloudinary is unconfigured or file not found. |
| **Secrets** | `CLOUDINARY_API_SECRET` is backend-only. Frontend never receives it. |

**Cloudinary is optional.** The application works without it — uploads will throw `STORAGE_NOT_CONFIGURED` but all other functionality works. You can configure Cloudinary later.

---

## 10. Health Check

```
GET /healthz
```

Returns:

```json
{"status":"ok"}
```

This is a simple health check endpoint. You can set the Render health check path to `/healthz` in your service settings.

---

## 11. How the Backend Starts

```
node src/server.js
  → imports app.js (Express setup)
  → imports env.js (validates env vars, exits if required vars missing)
  → app.listen(PORT) on 0.0.0.0
  → registers SIGTERM/SIGINT handlers for graceful shutdown
```

If `DATABASE_URL`, `JWT_SECRET`, or `CORS_ORIGIN` (in production) are missing, the server exits immediately with a clear error message.

---

## 12. Render Free Cold Start

- Render Free spins down after **15 minutes** without inbound traffic.
- First request after spin-down takes approximately **30–60 seconds**.
- The `/healthz` endpoint does **not** prevent spin-down.
- Optionally, you can use a free external ping service (e.g., cron-job.org) to request `/healthz` every 10 minutes. This is **not required** — it only reduces how often you encounter cold starts. It does not eliminate the underlying Free tier limitation.
- If cold starts are unacceptable, upgrade to a paid Render instance.

---

## 13. Architecture

```
Browser
  → HTTPS
    → Vercel (static SPA)
      → fetch(VITE_API_URL + "/api/v1/...")
        → HTTPS
          → Render Web Service
            → Express (app.js)
              → Helmet
              → CORS (origin check)
              → JSON parser (100KB)
              → /healthz
              → /api/v1/* routes
                → Rate Limiter (login, contact)
                → Auth Middleware (JWT)
                → Multer (file upload)
                → Validator
                → Controller → Service → Repository → Prisma
                  → Neon PostgreSQL
                → Cloudinary (image/file storage)
```

---

## 14. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `DATABASE_URL is not set` | Env var missing in Render | Add it in Render Environment tab |
| `CORS_ORIGIN is not set in production` | CORS env var missing | Add `CORS_ORIGIN` with your Vercel URL |
| `JWT_SECRET must be at least 32 characters` | Secret too short | Use a random 32+ char hex string |
| `PrismaClient initialization error` | Missing generated client | Ensure `npm install` ran successfully (postinstall generates client) |
| Login returns 401 for valid credentials | Admin user not seeded | Run `npm run seed:admin` locally against Neon |
| 502 errors on first request | Render Free cold start | Normal for free tier; ~30-60s spin-up |
| `Storage not configured` on image upload | Cloudinary env vars missing | Add `CLOUDINARY_*` env vars to Render |
