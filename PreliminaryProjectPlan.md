# Feedbaker - Preliminary Project Plan

## Project pitch

**Feedbaker** (a playful twist on "feedback") is a small-scale feedback management service designed for websites and applications.
Its purpose is to provide a simple yet powerful platform for collecting, organizing, and moderating user feedback.

Owners (developers or product managers) can register using Google OAuth, create site entries, and embed a lightweight feedback widget on their websites.
Visitors can submit feedback directly through these widgets, while owners can view, moderate, and respond to feedback in a web dashboard or via a REST API.

**_Standout features:_**

- Lightweight embeddable feedback widget.
- Owner dashboard with moderation tools.
- Secure Google authentication (OAuth + JWT).
- RESTful API for integration into other apps.

## MVP feature list

1. Authentication
   - Login using Google OAuth (One Tap) with JWT stored in HTTP-only cookies.
2. Site management
   - Create, update, and delete “sites” (owned apps or websites).
3. Feedback system
   - Public feedback submission via embeddable widget or form.
   - Owners can view, comment on, or delete feedback.
4. Public views
   - Anyone can browse public sites and feedback.
5. Admin role
   - Admins can review and manage all users, sites, and feedback.

## Tech stack

### Frontend:

- Next.js (React 19, App Router)
- TypeScript
- TailwindCSS
- React Hook Form + Zod (validation)
- TanStack Query (data fetching)
- Axios
- React Hot Toast
- React Error Boundary

### Backend:

- Express.js (TypeScript)
- PostgreSQL
- jsonwebtoken (JWT-based auth)
- Google OAuth (One Tap)
- Zod (validation)
- CORS, dotenv, pg

### Development Tools:

- ESLint (linting)
- Prettier (formatting)
- pnpm / npm workspaces
- Git + GitLab

## Backend

### Database tables

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  picture TEXT,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (provider, provider_id)
);

CREATE TABLE sites (
  site_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  url TEXT,
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  description TEXT,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (owner_id, name)
);

CREATE TABLE feedbacks (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
  author VARCHAR(255),
  body TEXT NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  public BOOLEAN DEFAULT TRUE,
  comment TEXT
);

CREATE INDEX idx_users_name_trgm ON users USING gin (name gin_trgm_ops);
CREATE INDEX idx_sites_name_trgm ON sites USING gin (name gin_trgm_ops);
CREATE INDEX idx_sites_url_trgm ON sites USING gin (url gin_trgm_ops);
CREATE INDEX idx_feedbacks_body_trgm ON feedbacks USING gin (body gin_trgm_ops);
CREATE INDEX idx_feedbacks_site_public_created ON feedbacks (site_id, public, created_on DESC);
CREATE INDEX idx_created ON sites (created_on DESC);
```

### Endpoints

**Authentication**

- `POST /api/auth/google` - Verify Google credential, set JWT cookie.
- `GET /api/profile` - Get authenticated user info.
- `POST /api/logout` - Clear JWT cookie.
- `GET /api/csrf` - Generate CSRF token.

**Sites**

- `GET /api/sites` - List all sites (public).
- `GET /api/sites/:site_id` - Get site details.
- `POST /api/sites` - Create new site (owner/admin only).
- `PUT /api/sites/:site_id` - Update site (owner/admin only).
- `DELETE /api/sites/:site_id` - Delete site (owner/admin only).

**Feedback**

- `GET /api/feedback` - List feedback (public or owner-specific).
- `GET /api/feedback/:feedback_id` - Get single feedback (owner/admin only).
- `POST /api/feedback` - Submit public feedback.
- `PUT /api/feedback/:feedback_id` - Update or moderate feedback. (owner/admin only).
- `DELETE /api/feedback/:feedback_id` - Delete feedback (owner/admin only).

## Frontend

### UI Mockup

Proposed views:

1. **Login Page** - Google One Tap sign-in.
2. **Profile Page** - Display user info and owned sites.
3. **Sites Page** - List and manage owned sites.
4. **Feedback Page** - View and moderate site feedback.
5. **Public Feedback Page** - Submit new feedback.

### Component list

**General UI**

- `Title`, `LinkButton`, `PageNavigator`, `FormInput`, `FormText`, `Modal`

**Sites**

- `SiteList` - Client component (useSuspenseQuery for paginated sites)
- `SiteCard` - Server component
- `SiteForm` - Add/update form (server)
- `SiteController` - Client component for CRUD actions

**Feedback**

- `FeedbackList` - Client component (paginated)
- `FeedbackCard` - Server component
- `FeedbackAddForm` - Add feedback (server)
- `FeedbackController` - Manage feedback actions

## Extra: Repository structure

Sketch of the folder structure of your repo.

## Extra: Proposed timeline

```bash
feedbaker/
│
├── client/                        #Next.js frontend
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── sites/
│   │   │   ├── page.tsx
│   │   │   ├── [site_id]/page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [site_id]/feedback/
│   │   │                   ├── page.tsx
│   │   │                   └── new/page.tsx
│   │   └── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   ├── utils/
│   ├── types/
│   ├── lib/
│   ├── package.json
│   └── .env.local
│
└── server/                         # Express REST API
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── sites.ts
    │   │   └── feedback.ts
    │   ├── middleware/auth.ts
    │   ├── models/
    │   │   ├── db.ts
    │   │   ├── users.ts
    │   │   ├── sites.ts
    │   │   └── feedbacks.ts
    │   └── utils/env.ts
    ├── package.json
    └── .env

```

## Extra: Proposed timeline

| Phase | Description                                         | Estimated Duration |
| ----- | --------------------------------------------------- | ------------------ |
| 1     | Setup project, database schema, Express boilerplate | 1 week             |
| 2     | Implement Google OAuth (One Tap + JWT cookie)       | 1 week             |
| 3     | Sites CRUD API + tests                              | 1 week             |
| 4     | Feedback API + moderation logic                     | 1 week             |
| 5     | Next.js frontend (sites + feedback pages)           | 2 weeks            |
| 6     | Authentication integration (JWT cookie flow)        | 1 week             |
| 7     | UI polish, error handling, admin dashboard          | 1 week             |
| 8     | Final testing & documentation                       | 1 week             |

## Optional features

- Feedback "like/dislike" system.
- AI-powered feedback summarization.
- Soft delete / audit log.
- Localization (multi-language).
- Email notifications for new feedback.
- Dockerized deployment (for both Next.js and Express).
- CI/CD pipeline (GitHub Actions).
