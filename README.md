# Feedbaker

**Feedbaker** (a playful twist on "feedback") is a lightweight feedback management service for websites and web apps.
It provides a simple but powerful way to **collect, organize, and moderate** user feedback.

## Overview

Owners (developers or product managers) can register using **Google OAuth**, create site entries, and embed a **lightweight feedback widget** on their websites.
Visitors can submit feedback directly through these widgets, while owners can view, moderate, and respond to feedback in a web dashboard or REST API.

**_Standout features:_**

- Lightweight embeddable feedback widget.
- Three main roles: visitor, owner, and admin
- Secure authentication with Google OAuth + JWT
- RESTful API for integrations
- AI-powered feedback summarization

## MVP feature list

1. **Authentication**

   - Login with **Google OAuth (One Tap)**
   - JWT stored in **HTTP-only cookies**

2. **Site management**

   - Create, update, and delete owned sites

3. **Feedback system**

   - Public feedback submission via widget or form
   - Owners can view, comment on, or delete feedback

4. **Public views**

   - Anyone can browse public sites and feedback

5. **Admin role**

   - Full management of users, sites, and feedback

## Tech stack

### Frontend:

- **Next.js16 (React 19, App Router)**
- TypeScript
- TailwindCSS
- React Hook Form + Zod (validation)
- TanStack Query (data fetching)
- Axios, React Hot Toast, React Error Boundary
- clsx, jsonwebtoken

### Backend:

- **Express.js (TypeScript)**
- PostgreSQL
- JWT-based authentication
- Google OAuth (One Tap)
- Zod (validation)
- Google Gemini AI (for summarization)
- CORS, dotenv, cookie-parser, pg

### Development Tools:

- ESLint, Prettier
- TanStack Query Devtools
- pnpm workspaces + Turborepo
- Git + GitLab
- Supertest, Vitest

## Monorepo Commands

From the repo root:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Package-specific commands:

```bash
pnpm --filter @feedbaker/client dev
pnpm --filter @feedbaker/server dev
```

## CI/CD

GitHub Actions workflows live in [`.github/workflows/`](./.github/workflows):

- `ci.yml`: runs on pull requests and pushes to `main`, installs dependencies, runs lint, build, and server tests against a temporary PostgreSQL service.
- `deploy-frontend.yml`: currently manual-only via GitHub Actions `workflow_dispatch`; deploys the `client` app to Vercel when triggered.
- `deploy-backend.yml`: currently manual-only via GitHub Actions `workflow_dispatch`; triggers a Render production deploy hook when triggered.
- `security.yml`: runs scheduled and manual dependency audits with `pnpm audit`.
- `seed-database.yml`: manually seeds the Neon database from GitHub Actions.

### Required GitHub Secrets

Add these repository secrets before enabling the deploy workflows:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RENDER_DEPLOY_HOOK_URL`
- `NEON_DATABASE_URL`

### CI Environment Strategy

Do not move ordinary CI test values into GitHub secrets unless they are actually sensitive.

- Keep ephemeral CI Postgres values inline in `ci.yml`: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `DATABASE_URL`.
- Keep non-secret app placeholders in the committed [`.env.test`](./.env.test): `DATABASE_SSL`, `COOKIE_NAME`, `API_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ORIGIN`, `NEXT_PUBLIC_COOKIE_NAME`, `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, and `GEMINI_API_KEY`.
- Run tests with `NODE_ENV=test`, not `development`.
- Use GitHub repository secrets only for real secrets that target external systems or production-like infrastructure, such as `VERCEL_TOKEN`, `RENDER_DEPLOY_HOOK_URL`, and `NEON_DATABASE_URL`.
- Use GitHub Environments for workflows that touch protected infrastructure, such as the manual Neon seed workflow and production deploy workflows.

### Service Setup Notes

- Render: create a deploy hook for the production backend service and store it as `RENDER_DEPLOY_HOOK_URL`.
- Vercel: link the production frontend project and store its org and project IDs as GitHub secrets.
- Neon: store the connection string as `NEON_DATABASE_URL`. The manual seed workflow uses it and can optionally truncate existing data before inserting placeholders.

### Avoid Double Deploys

If Render or Vercel are still configured to auto-deploy directly from Git pushes, disable those automatic production deploys before turning on these workflows. Otherwise the same commit can deploy twice: once from the platform integration and once from GitHub Actions.

### Manual Seed Workflow

Use the `Seed Database` workflow from the GitHub Actions tab when you want to populate Neon with demo data.

- Default mode is non-destructive: it inserts placeholder records and skips rows that already exist.
- If you enable `truncate_existing`, the workflow clears `feedback`, `sites`, and `users` before seeding.
- The workflow targets the GitHub `production` environment, so you can add required reviewers there before anyone can run it against Neon.

## Docker Local Testing

The repo now includes `docker/backend.dev.Dockerfile`, `docker/frontend.dev.Dockerfile`, and `docker-compose.dev.yml` for a local stack with:

- `client` on `http://localhost:3000`
- `server` on `http://localhost:8080`
- `postgres` on `localhost:5432`

Run it from the repo root:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Optional overrides can be provided through shell environment variables before starting Compose, for example `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`, `POSTGRES_PORT`, `CLIENT_PORT`, and `SERVER_PORT`.

Use [`client/TEMPLATE.env`](./client/TEMPLATE.env) and [`server/TEMPLATE.env`](./server/TEMPLATE.env) as the source of truth for non-Docker local development.

### Database Schema

Feedbaker uses PostgreSQL with the following core tables:

| Table            | Description                                            |
| ---------------- | ------------------------------------------------------ |
| users            | System users (owners, admins) authenticated via Google |
| sites            | Registered sites where feedback can be left            |
| feedback         | Individual feedback entries                            |
| feedback_summary | AI-generated summaries for each site’s feedback        |

### REST API Overview

##### **Public Endpoints**

**Sites**

```
GET /api/sites
GET /api/sites?page=[PAGE]&search=[SEARH_BY_NAME]&owner_id=[OWNER_ID]
GET /api/sites?limit=[LIMIT]&offset=[OFFSET]&searchText=[SEARH_BY_NAME]&owner_id=[OWNER_ID]
```

**Feedback**

```
GET /api/feedback?site_id=[SITE_ID]
GET /api/feedback?feedback_id=[FEEDBACK_ID]
POST /api/feedback
```

##### **Authenticated User (Owner or Admin)**

**Sites**

```
POST /api/sites
PUT /api/sites/:site_id
DELETE /api/sites/:site_id
```

**Feedback**

```
GET /api/feedback/summarize?site_id=[SITE_ID]
PUT /api/feedback/:feedback_id
DELETE /api/feedback/:feedback_id
```

**Users**

```
DELETE /api/users/:user_id
```

##### **Admin-Only**

**Users**

```
GET /api/users
GET /api/users?page=[PAGE]&search=[SEARH_BY_NAME]
GET /api/users?limit=[LIMIT]&offset=[OFFSET]&searchText=[SEARH_BY_NAME]
```

##### **Authentication**

**Users**

```
POST /api/auth/google
GET /api/profile
POST /api/logout
GET /api/csrf
```

## Frontend Overview

### UI Pages

| Page                  | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| **Main Page**         | Welcome / landing                                           |
| **Login Page**        | Google One Tap sign-in                                      |
| **Profile Page**      | User info, links to manage own sites, delete account        |
| **Sites Page**        | Paginated site list, filter/search, CRUD (by role)          |
| **Feedback Page**     | Paginated feedback list, moderation tools, AI summarization |
| **Help Page**         | Widget instructions, API info, examples                     |
| **Unauthorized Page** | Shown when access is restricted                             |
| **Users Page**        | Admin-only list and management view                         |

### Core UI Components

**General UI**
`Section`, `SectionContent`, `Title`, `FormInput`, `FormText`, `Serach`, `Modal`, `DeleteContent`

**Sites**
`SiteList`, `SiteCard`, `SiteUpdateForm`,`WidgetInstructions`

**Feedback**
`FeedbackList`, `FeedbackCard`, `FeedbackAddForm`, `FeedbackUpdateCommentForm`

**Users**
`UserList`, `UserCard`, `UserDeleteContent`

## Widget Integration Example

```html
<script
  src="https://feedbaker.com/feedbaker.js"
  data-site="SITE_ID"
  data-bg="#0088aa"
  data-fg="#ffffff"
></script>
```

## Customization

`data-site`: required, site identifier
`data-bg`: background color
`data-fg`: text/border color

Example predefined color styles:

```js
{
  style1: { bg: "#0088aa", fg: "#ffffff" },
  style2: { bg: "#ffffff", fg: "#000000" },
  style3: { bg: "#000000", fg: "#ffffff" },
  style4: { bg: "#ffff22", fg: "#008800" },
}
```

## Project Structure

```
feedbaker/
├── docker-compose.dev.yml
├── package.json           # pnpm + turbo workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── client/                # Next.js frontend
│   ├── app/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── help/
│   │   ├── sites/
│   │   │   ├── [site_id]/
│   │   │   ├── [site_id]/feedback/
│   │   │   └── new/
│   │   ├── unauthorized/
│   │   ├── users/
│   │   └── layout.tsx
│   ├── components/
│   ├── config/
│   ├── lib/
│   ├── fetchers/
│   ├── public/            # feedback widget, assets
│   ├── types/
│   ├── validations/
│   └── README.md
│
└── server/                # Express REST API
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   ├── models/
    │   ├── scripts/
    │   ├── tests/
    │   ├── types/
    │   ├── validations/
    │   └── utils/
    ├── .env
    ├── TEMPLATE.env
    ├── package.json
    └── vitest.config.ts

```

## Optional features (Planned)

- Anti-spam and rate limiting to prevent spam feedback using CAPTCHA, rate limits, or content analysis
- Improved logging system
- Additional authentication providers
- Email or webhook notifications to notify owners about new feedback or summary completion
- Feedback analytics to visualize trends, categories, and summary metrics per site
- Dark/light theme for widget
- Admin dashboard improvements
