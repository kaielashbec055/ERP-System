# EduPulse ERP — Backend

Production backend for the **EduPulse** school ERP React/Vite frontend.
Node.js 18+ · Express · TypeScript · PostgreSQL · Prisma ORM · JWT · Socket.IO · Cloudinary.

> **Important context:** the uploaded frontend ships as a fully mock-data-driven
> demo (all state lives in `AppContext`/`ChatContext`, backed by `mockData.ts`
> — there are no `fetch`/`axios` calls anywhere in it yet). This backend was
> built by reverse-engineering the frontend's exact TypeScript interfaces
> (`UserProfile`, `ChildInfo`, `BusTrackingInfo`, `DigitalGatePass`,
> `EmergencyAlert`, `CircularAnnouncement`, `NotificationItem`, `ChatMessage`,
> `SubjectGrade`, `Assignment`, `AchievementBadge`, `MoodEntry`,
> `StrugglingStudentAlert`, etc.) so every response shape is a **byte-for-byte
> match**. See `API_INTEGRATION_GUIDE.md` for the small, mechanical set of
> edits needed on the frontend side to swap `mockData.ts` for real API calls.

---

## 1. Tech stack

| Layer          | Choice                                              |
|----------------|------------------------------------------------------|
| Runtime        | Node.js 18+, TypeScript (strict mode)                |
| Web framework  | Express 4                                             |
| Database       | PostgreSQL                                            |
| ORM            | Prisma                                                 |
| Auth           | JWT (access + rotating refresh tokens), bcrypt        |
| Realtime       | Socket.IO (chat, live bus GPS, notifications, SOS)    |
| File storage   | Cloudinary (falls back to a warning + local `/uploads` note if unset) |
| Validation     | Zod                                                    |
| Docs           | Swagger UI at `/api-docs` (OpenAPI 3, swagger-jsdoc)   |
| Security       | Helmet, CORS allow-list, rate limiting, input validation |
| Logging        | Winston + morgan                                       |

## 2. Project structure

```
backend/
 ├── prisma/
 │   ├── schema.prisma      # full data model
 │   └── seed.ts            # seeds data 1:1 with the frontend's mockData.ts
 ├── src/
 │   ├── config/            # env, logger, prisma client, cloudinary, swagger
 │   ├── controllers/       # thin HTTP layer — no business logic
 │   ├── services/          # all business logic + Prisma queries live here
 │   ├── routes/            # one file per resource, mounted in routes/index.ts
 │   ├── middlewares/        # auth, role guard, validation, errors, rate limit, upload
 │   ├── validators/        # Zod schemas per resource
 │   ├── sockets/            # Socket.IO auth + chat/bus event handlers
 │   ├── jobs/               # optional demo bus GPS simulator
 │   ├── utils/              # response envelope, AppError, JWT/hash, pagination
 │   ├── types/              # Express Request augmentation
 │   ├── docs/                # points to the auto-generated Swagger docs
 │   ├── app.ts              # Express app wiring
 │   └── server.ts           # HTTP + Socket.IO bootstrap, graceful shutdown
 ├── .env.example
 └── package.json
```

> **Note on the requested `repositories/` layer:** services call Prisma
> directly rather than through a separate repository abstraction. Prisma's
> generated client already *is* a type-safe repository layer, so adding
> another indirection on top of it would mean more files with no behavioral
> benefit. Every service function is still small, single-purpose, and easy
> to unit test in isolation.

## 3. Getting started

### Prerequisites
- Node.js 18.18+
- A running PostgreSQL instance (local, Docker, Supabase, Neon, RDS — anything)

### Setup

```bash
cd backend
cp .env.example .env      # then fill in DATABASE_URL, JWT secrets, etc.
npm install
npx prisma migrate dev    # creates the database schema
npm run seed               # loads demo data identical to the frontend's mockData.ts
npm run dev                 # starts the API on http://localhost:5000
```

Visit `http://localhost:5000/api-docs` for interactive Swagger docs, and
`http://localhost:5000/health` for a liveness check.

### Demo accounts (created by `npm run seed`)

All four personas share the password `Password123!`:

| Role    | Email                        |
|---------|-------------------------------|
| Student | alex.vance@edupulse.edu       |
| Parent  | sarah.vance@gmail.com          |
| Teacher | m.thorne@edupulse.edu          |
| Admin   | principal@edupulse.edu         |

### Production build

```bash
npm run build
npm start
```

## 4. Environment variables

See `.env.example` for the full list with inline documentation. Minimum
required to boot: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
Everything else (Cloudinary, SMTP, AI provider keys, the bus simulator) is
optional and degrades gracefully with a logged warning if left unset.

## 5. Authentication

- `POST /api/v1/auth/register` — creates a User + the matching role profile
  (StudentProfile / ParentProfile / TeacherProfile) in one transaction.
- `POST /api/v1/auth/login` — returns `{ user, tokens: { accessToken, refreshToken } }`.
- `POST /api/v1/auth/refresh` — rotates the refresh token (old one is revoked).
- `POST /api/v1/auth/logout` — revokes the current refresh token.
- `GET /api/v1/auth/me` — current user, in the exact `UserProfile` shape.

Send the access token as `Authorization: Bearer <token>` on every
subsequent request. Refresh tokens are also set as an httpOnly cookie as a
convenience for browser clients, but the JSON body value works everywhere
(mobile, Postman, etc.).

## 6. Realtime (Socket.IO)

Connect with the access token:

```js
import { io } from 'socket.io-client';
const socket = io(API_BASE_URL, { auth: { token: accessToken } });
```

Every socket automatically joins a private `user:{id}` room. Events:

| Event                 | Direction        | Purpose                                   |
|------------------------|-------------------|---------------------------------------------|
| `notification:new`     | server → client  | New notification (from any module)          |
| `chat:message`          | server → client  | New 1:1 chat message                        |
| `chat:typing`           | both              | Typing indicator (join a room with `chat:join`) |
| `chat:read`              | both              | Read receipts                               |
| `bus:track` / `bus:untrack` | client → server | Join/leave a bus's live-GPS room          |
| `bus:update`              | server → client  | Live bus telemetry (speed, position, ETA, stops) |
| `emergency:alert`         | server → client  | Campus-wide SOS/emergency broadcast          |
| `announcement:new`         | server → client  | New circular published                       |
| `presence:online` / `presence:offline` | server → client | Basic online-status signal |

## 7. API surface (high level)

All responses use the envelope `{ success, message, data, errors }`.
Full interactive docs live at `/api-docs`. Route groups:

- `/api/v1/auth` — register, login, refresh, logout, me, change-password
- `/api/v1/users` — profile update, avatar upload, admin user directory
- `/api/v1/students` — my subjects, my assignments (+ submit), my badges, dashboard summary
- `/api/v1/parents` — my children (`ChildInfo[]`), link a child
- `/api/v1/teachers` — my classes, roster, attendance marking, assignment creation, grading
- `/api/v1/academics` — classes, subjects, subject-grade entry (admin/teacher)
- `/api/v1/wellness` — mood check-ins, AI Early Warning risk alerts
- `/api/v1/safety` — bus tracking, digital gate passes, emergency alerts/SOS
- `/api/v1/communication` — announcements/circulars, notifications, 1:1 chat
- `/api/v1/ai` — assistant chat + structured endpoints (study plan, homework help,
  performance prediction, wellness analysis, parent weekly report, student progress summary)
- `/api/v1/fees` — invoices, fee payment
- `/api/v1/admin` — dashboard stats, recent activity

## 8. The "AI" module

Per the brief, there is **no dedicated AI UI** — only backend endpoints.
Out of the box, `src/services/ai.service.ts` runs as a deterministic,
rule-based engine derived from real database data (grades, attendance,
mood entries, bus status) — it needs zero external API keys and mirrors
(and upgrades) the client-side logic that used to live in the frontend's
`ChatContext.tsx`. If you set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in
`.env`, `callExternalLLM()` in that file is the single, clearly-marked
extension point to swap in a real model call — no route or controller
changes required.

## 9. Security checklist

- Helmet security headers, strict CORS allow-list
- bcrypt password hashing (configurable cost factor)
- JWT access tokens (short-lived) + rotating, hashed refresh tokens
- Role-based authorization on every protected route
- Zod validation on every request body/query/params
- Rate limiting (global + a stricter one on auth endpoints)
- Prisma parameterized queries (no raw SQL string interpolation anywhere
  except the seed script's own `TRUNCATE` statements, which take no user input)
- File upload MIME allow-list + 15MB size cap, streamed straight to Cloudinary
- Centralized error handler that never leaks stack traces in production

## 10. Testing the API quickly

```bash
# Log in
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.vance@edupulse.edu","password":"Password123!"}'

# Use the returned accessToken
curl http://localhost:5000/api/v1/students/me/subjects \
  -H "Authorization: Bearer <accessToken>"
```

## 11. Deploying

Any Node host works (Railway, Render, Fly.io, EC2, etc.):

1. Provision PostgreSQL and set `DATABASE_URL`.
2. `npm run build && npx prisma migrate deploy && npm run seed` (seed once, optionally).
3. `npm start`.
4. Point `CLIENT_URL` / `ADDITIONAL_CORS_ORIGINS` at your deployed frontend origin(s).
