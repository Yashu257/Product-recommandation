# Cadence — Backend API

Production-ready REST API for the Cadence AI social media scheduling platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh token rotation) |
| AI | OpenAI GPT-4o |
| Scheduler | node-cron |
| Validation | Zod |
| Logging | Winston |

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Full DB schema
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── config/
│   │   └── index.ts           # Typed env config
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   └── logger.ts          # Winston logger
│   ├── types/
│   │   └── index.ts           # Shared TS types (AuthRequest, ApiResponse…)
│   ├── utils/
│   │   ├── jwt.ts             # Token sign/verify helpers
│   │   ├── errors.ts          # AppError hierarchy
│   │   └── response.ts        # sendSuccess / sendError / paginate
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT Bearer verification
│   │   ├── workspace.middleware.ts  # Role-based workspace guard
│   │   ├── validate.middleware.ts   # Zod request validation
│   │   ├── upload.middleware.ts     # Multer media upload
│   │   └── error.middleware.ts      # Global error + 404 handler
│   ├── services/
│   │   ├── auth.service.ts          # Register, login, token rotation
│   │   ├── post.service.ts          # Posts CRUD + duplicate/reschedule
│   │   ├── workspace.service.ts     # Workspace + members + invites
│   │   ├── ai.service.ts            # Caption gen, hashtags, chat
│   │   ├── scheduler.service.ts     # Cron-based post publisher
│   │   ├── social-account.service.ts # Connected channels
│   │   └── brand-voice.service.ts   # Brand voice profile
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── post.controller.ts
│   │   ├── workspace.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── social-account.controller.ts
│   │   └── brand-voice.controller.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── post.validator.ts
│   │   ├── workspace.validator.ts
│   │   └── ai.validator.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── post.routes.ts
│   │   ├── workspace.routes.ts
│   │   ├── ai.routes.ts
│   │   └── index.ts           # Route aggregator
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Entry point + graceful shutdown
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, OPENAI_API_KEY
```

### 3. Set up the database
```bash
# Run migrations
npm run db:migrate

# Seed demo data (sarah@cadence.app / password123)
npm run db:seed
```

### 4. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:4000/api/v1`

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account + workspace |
| POST | `/auth/login` | — | Login, get tokens |
| POST | `/auth/refresh` | — | Rotate refresh token |
| POST | `/auth/logout` | — | Revoke refresh token |
| POST | `/auth/logout-all` | ✓ | Revoke all sessions |
| GET  | `/auth/me` | ✓ | Get current user |

### Posts (workspace-scoped)
| Method | Endpoint | Min Role | Description |
|---|---|---|---|
| GET    | `/workspaces/:id/posts` | VIEWER | List posts (filterable) |
| POST   | `/workspaces/:id/posts` | EDITOR | Create post + upload media |
| GET    | `/workspaces/:id/posts/:postId` | VIEWER | Get single post |
| PATCH  | `/workspaces/:id/posts/:postId` | EDITOR | Update post |
| DELETE | `/workspaces/:id/posts/:postId` | EDITOR | Delete post |
| POST   | `/workspaces/:id/posts/:postId/duplicate` | EDITOR | Duplicate post |
| PATCH  | `/workspaces/:id/posts/:postId/reschedule` | EDITOR | Reschedule post |

### Workspace
| Method | Endpoint | Min Role | Description |
|---|---|---|---|
| GET    | `/workspaces/:id` | VIEWER | Get workspace details |
| PATCH  | `/workspaces/:id` | ADMIN | Update workspace |
| GET    | `/workspaces/:id/stats` | VIEWER | Post counts |
| GET    | `/workspaces/:id/activity` | VIEWER | Activity feed |
| GET    | `/workspaces/:id/members` | VIEWER | List members |
| POST   | `/workspaces/:id/members/invite` | ADMIN | Send invite |
| PATCH  | `/workspaces/:id/members/:userId/role` | ADMIN | Change role |
| DELETE | `/workspaces/:id/members/:userId` | ADMIN | Remove member |
| POST   | `/workspaces/:id/invites/:token/accept` | ✓ | Accept invite |
| GET    | `/workspaces/:id/accounts` | VIEWER | List social accounts |
| POST   | `/workspaces/:id/accounts` | ADMIN | Connect account |
| DELETE | `/workspaces/:id/accounts/:accountId` | ADMIN | Disconnect account |
| GET    | `/workspaces/:id/brand-voice` | VIEWER | Get brand voice |
| PATCH  | `/workspaces/:id/brand-voice` | EDITOR | Update brand voice |
| POST   | `/workspaces/:id/brand-voice/train` | EDITOR | Train on published posts |

### AI
| Method | Endpoint | Min Role | Description |
|---|---|---|---|
| POST | `/workspaces/:id/ai/generate/caption` | EDITOR | Generate caption |
| POST | `/workspaces/:id/ai/generate/hashtags` | EDITOR | Generate hashtags |
| GET  | `/workspaces/:id/ai/suggest-times` | EDITOR | Best posting times |
| POST | `/workspaces/:id/ai/chat` | EDITOR | AI Studio chat |
| GET  | `/workspaces/:id/ai/conversations` | EDITOR | List conversations |
| GET  | `/workspaces/:id/ai/conversations/:id` | EDITOR | Get conversation |

---

## Role Hierarchy

```
OWNER > ADMIN > EDITOR > VIEWER
```

- **VIEWER** — read-only access to posts, stats, activity
- **EDITOR** — create/edit posts, use AI features
- **ADMIN** — manage members, connect accounts, update workspace
- **OWNER** — full control, cannot be removed

---

## Scheduler

The post scheduler runs every minute via `node-cron`. It:
1. Queries all `SCHEDULED` posts where `scheduledAt <= now`
2. Marks them `PUBLISHING` (prevents double-processing)
3. Calls each platform's publish function (stub — wire in real SDKs)
4. Marks `PUBLISHED` or `FAILED` and logs activity

---

## Production Checklist

- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ random chars)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `DATABASE_URL` with connection pooling (PgBouncer recommended)
- [ ] Set `CORS_ORIGIN` to your frontend domain
- [ ] Add real platform OAuth tokens to `SocialAccount` (encrypt at rest)
- [ ] Wire real social platform SDKs in `scheduler.service.ts`
- [ ] Set up email service for workspace invites
- [ ] Configure log aggregation (Datadog, Logtail, etc.)
- [ ] Add Redis for rate limiting in multi-instance deployments
