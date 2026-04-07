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
- pnpm / npm Workspaces
- Git + GitLab
- Supertest, Vitest

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
POST /api/feedback/summarize
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
POST /api/profile/logout
GET /api/profile/csrf
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
