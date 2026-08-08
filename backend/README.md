# SnugTalk backend

Node + Express + Prisma + MySQL. A standalone API the Next.js frontend calls.

**Status: built and connected.** Auth, meeting requests and chat all run against
MySQL end to end.

## Running it

Three things, in three terminals (PowerShell has no `&&` — one command per line):

```powershell
docker start hearmeout-mysql     # 1. database
cd backend; npm run dev          # 2. API   → http://localhost:4000
cd HearYouOut; npm run dev       # 3. web   → http://localhost:3000
```

### Seeded accounts

`npm run db:seed` creates these. Password for all: **`password123`**

| Email | Role | Sees |
| --- | --- | --- |
| `member@snugtalk.test` | MEMBER | `/dashboard`, `/chat`, `/book` |
| `amara@snugtalk.test` | LISTENER | plus `/listener/*` |
| `daniel@snugtalk.test` | LISTENER | plus `/listener/*` |
| `admin@snugtalk.test` | ADMIN | everything |

### What's wired

| Frontend | Endpoint |
| --- | --- |
| Sign up / log in / log out | `POST /api/auth/register` · `login` · `logout` |
| Session on load | `GET /api/auth/me` |
| `/book` form | `POST /api/requests` |
| `/listener/requests` queue | `GET /api/requests` · `PATCH /api/requests/:id` |
| `/chat` | `GET /api/conversations/mine` · `POST /api/conversations/:id/messages` |
| `/listener/chats` inbox | `GET /api/conversations` · same message endpoints |

Chat polls every 5–6 seconds. That's deliberate: correct, simple, and cheap at
this scale. Move to websockets when concurrent threads make polling wasteful,
not before.

### Security decisions worth keeping

- **Passwords** hashed with bcrypt at cost 12. Never logged, never returned.
- **Session** is a JWT in an **httpOnly** cookie — unreadable from JavaScript,
  so an XSS bug can't steal it. Verified in the browser.
- **Roles enforced server-side.** `/api/requests` (list), `PATCH`, and the chat
  inbox are LISTENER/ADMIN only; a member gets 403. The `StaffOnly` guard on
  `/listener/*` is only cosmetic — the API is the real boundary.
- **Identity comes from the token**, never from the request body, so nobody can
  file a request or post a message as someone else.
- **Every body and route param validated with zod** before it reaches Prisma.
- **CORS is an explicit allow-list** with credentials — the spec forbids `*`
  with credentials, and accepting any origin would let any site call this API as
  your signed-in user.
- **Rate limiting** on register/login: 20 attempts per 15 minutes.
- **Errors are sanitised** — only deliberate `ApiError`s and validation failures
  reach the client; anything else logs server-side and returns a bare 500.

---

## First-time setup

Already done on this machine — kept for reference and for the next person.

---

## 0. Fix the frontend first

The restructure moved the app into `HearYouOut/` but left its dependencies
behind, so it won't start right now:

```powershell
cd HearYouOut
npm install
```

> **PowerShell note:** this is PowerShell 5.1, which has no `&&`. Chaining two
> commands with it is a parser error. Run them on separate lines, or use `;` to
> run both regardless of failure. All commands below are written one per line
> for that reason.

There's also a stray 1 KB `package-lock.json` at the repo root from an
accidental install. Delete it — it belongs to nothing:

```powershell
Remove-Item package-lock.json
```

---

## 1. Install MySQL locally

**Option B — Docker (what you're using; already done)**

```powershell
docker run --name hearmeout-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hearmeout -p 3306:3306 -d mysql:8
```

That gives you **MySQL 8.4** with the `hearmeout` database already created.
`docker rm -f hearmeout-mysql` throws it away; re-run the command for a clean
slate.

**Option A — the Windows installer (only if you want a permanent local service)**

1. Download the **MySQL Installer for Windows** from
   <https://dev.mysql.com/downloads/installer/>.
2. Choose **Custom** → install *MySQL Server 8.x* and *MySQL Workbench*.
3. Authentication: pick **Use Strong Password Encryption**.
4. Set a **root password** and write it down.
5. Leave the port at **3306** and let it install as a Windows service, so it
   starts with the machine.

Check it's running:

```bash
mysql --version
```

If `mysql` isn't recognised, add `C:\Program Files\MySQL\MySQL Server 8.0\bin`
to your PATH, or use MySQL Workbench instead of the CLI.

---

## 2. Create the database and a user

With Docker, the database already exists. You still need an application user:

```powershell
docker exec hearmeout-mysql mysql -uroot -proot -e "CREATE USER IF NOT EXISTS 'hearmeout'@'%' IDENTIFIED WITH caching_sha2_password BY 'change_me'; GRANT ALL PRIVILEGES ON *.* TO 'hearmeout'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

Two details that will otherwise cost you an hour:

> **Host must be `%`, not `localhost`.** MySQL matches users on *username +
> host*. Connecting from Windows into a container arrives from the Docker
> gateway, not localhost, so `'hearmeout'@'localhost'` is never matched and you
> get "Access denied". Use `@'%'` for a containerised database. (`@'localhost'`
> is correct for a natively installed MySQL.)

> **`IDENTIFIED WITH caching_sha2_password`.** MySQL 8.4 ships with
> `mysql_native_password` **disabled**, so the old advice to use it fails with
> "Unknown authentication plugin". `caching_sha2_password` is the default and
> Prisma supports it.

> **Why `ON *.*` and not `ON hearmeout.*`?** `prisma migrate dev` creates and
> drops a temporary *shadow database* to work out what changed. A user with
> rights on one database only cannot do that, and you get a confusing `P3014`.
> Broad rights are fine locally — in production grant only `hearmeout.*` and use
> `npm run db:deploy` (`prisma migrate deploy`), which needs no shadow database.

---

## 3. Scaffold the backend project

Already done, but for reference:

```powershell
npm install express cors cookie-parser bcryptjs jsonwebtoken zod dotenv
npm install @prisma/client @prisma/adapter-mariadb mariadb
npm install -D prisma typescript tsx @types/node @types/express @types/cors @types/cookie-parser @types/bcryptjs @types/jsonwebtoken
```

`@prisma/adapter-mariadb` is the MySQL driver adapter — Prisma 7 clients no
longer open their own connections. `package.json` is set to `"type": "module"`
with the `dev` / `db:*` scripts already in place.

---

## 4. Configure the connection

Copy `.env.example` to `.env` and fill it in:

```powershell
Copy-Item .env.example .env
```

`.env` is gitignored. Never commit it — it holds the DB password and JWT secret.

---

## 5. Create the tables

The schema is already written for you in `prisma/schema.prisma`, and this step
has been run — the five tables exist and a write/read/delete was verified
end to end.

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

### Prisma 7 changed where the connection URL lives

If you follow an older tutorial you'll hit `P1012: The datasource property
'url' is no longer supported in schema files`. In v7:

- `schema.prisma` declares only `provider = "mysql"` — no `url`.
- The URL for the CLI and migrations lives in **`prisma.config.ts`**.
- The runtime client takes a **driver adapter** — see `src/lib/prisma.ts`.

Both files are already written.

That creates the tables and writes a migration file under
`prisma/migrations/`. **Commit that folder** — it is the history of your
database, and it's how you'll apply the same changes to production later.

Look at what you built:

```powershell
npm run db:studio
```

### What's in the schema

| Table | Holds |
| --- | --- |
| `users` | Accounts. `role` is MEMBER, LISTENER or ADMIN |
| `listener_profiles` | 1-to-1 extension of a LISTENER user — bio, specialties, on-shift flag |
| `meeting_requests` | The `/book` form: reference, name, email, topic, status, scheduled time |
| `conversations` | One chat thread per member, with an optional assigned listener |
| `messages` | Individual chat messages |

Parked features (services, plans, subscriptions, sessions, notes, ideas,
reviews, availability) are listed as comments at the bottom of the schema. Add
each table when its feature is unparked — an unused table is just something to
migrate around.

---

## 6. Build the API

Suggested layout:

```
backend/
  prisma/
    schema.prisma
    seed.ts
  src/
    generated/prisma/    # generated client — do not edit, do not commit
    lib/prisma.ts        # single PrismaClient + adapter  ✅ written
    server.ts            # express app, cors, cookie-parser
    middleware/auth.ts   # reads the JWT cookie, attaches req.user
    routes/
      auth.routes.ts
      requests.routes.ts
      conversations.routes.ts
```

### Endpoints the frontend needs

These map onto the exact places the frontend currently fakes — each one is
marked `// Front-end only` in the code.

| Method | Path | Replaces |
| --- | --- | --- |
| `POST` | `/api/auth/register` | `signUp()` in `src/lib/auth.tsx` |
| `POST` | `/api/auth/login` | `signIn()` in `src/lib/auth.tsx` |
| `POST` | `/api/auth/logout` | `signOut()` in `src/lib/auth.tsx` |
| `GET` | `/api/auth/me` | The localStorage read on mount |
| `POST` | `/api/requests` | The submit in `meeting-request-form.tsx` |
| `GET` | `/api/requests` | The team queue in `request-queue.tsx` (staff only) |
| `PATCH` | `/api/requests/:id` | "Schedule" / "Decline" in the queue |
| `GET` | `/api/conversations` | The team inbox in `team-chat-inbox.tsx` |
| `GET` | `/api/conversations/:id/messages` | Loading a thread |
| `POST` | `/api/conversations/:id/messages` | Sending — replaces the canned replies in `chat-panel.tsx` |

Rules worth setting from the start:

- **Hash passwords with bcrypt** (cost 12). Never store or log a plain password.
- **JWT in an httpOnly cookie**, not localStorage — a script that can read
  localStorage can steal the token. Use `httpOnly: true`, `sameSite: 'lax'`,
  and `secure: true` in production.
- **Validate every request body with zod** before it reaches Prisma.
- **Check `role` on staff endpoints.** `/api/requests` (list) and every
  `/listener/*` screen must be ADMIN or LISTENER only. Right now the frontend
  lets any signed-up user reach the team dashboard.
- **Never trust `userId` from the request body** — take it from the verified JWT.

---

## 7. Point the frontend at it

In `HearYouOut/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Then replace the mock in `src/lib/auth.tsx` with real `fetch` calls. The
provider's shape doesn't need to change — `useAuth()`, the middleware and every
component that consumes it can stay exactly as they are. Two things do change:

1. `signIn`/`signUp` call the API; the **server** sets the session cookie.
2. `src/middleware.ts` keeps checking for the cookie, but the cookie now holds
   a signed JWT instead of the literal `1`.

Because the API is on a different origin, you need CORS with credentials:

```ts
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```

and every frontend fetch needs `credentials: "include"`.

---

## 8. Seed some data

Write `prisma/seed.ts` to create one ADMIN, two LISTENER accounts with
profiles, and a couple of meeting requests — so the team dashboard has
something to show. Run it with `npm run db:seed`.

---

## Order I'd actually build in

1. `POST /api/auth/register` + `login` + `me` — nothing works without accounts.
2. `POST /api/requests` — the form is the product right now.
3. `GET`/`PATCH /api/requests` — so you can see and schedule them.
4. Chat endpoints last: they're the most work, and polling is fine before you
   reach for websockets.

Do **not** start with realtime chat. Get one endpoint working end to end —
form submits, row lands in MySQL, team dashboard shows it — before adding more.
