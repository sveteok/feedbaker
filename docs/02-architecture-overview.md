# Architecture Overview

Feedbaker follows a **modular full-stack architecture** with clear separation between frontend (Next.js) and backend (Express).

## System Overview

[Visitor]
↓
[Feedback Widget] → [Express API] → [PostgreSQL]
↑
[Next.js Dashboard]
↑
[Google OAuth]

## Components

### Frontend (client/)

- **Next.js 16 (React 19)** – UI and routing
- **TanStack Query** – data caching
- **React Hook Form + Zod** – forms and validation
- **TailwindCSS** – design system
- **Axios** – HTTP client

### Backend (server/)

- **Express 5 (TypeScript)** – REST API
- **Zod** – input validation
- **JWT + Google OAuth** – authentication
- **PostgreSQL** – data persistence
- **Google Gemini AI** – feedback summarization

## Authentication Flow

1. User logs in with **Google OAuth One Tap**
2. Backend verifies the credential via `google-auth-library`
3. Server issues a **JWT** stored in an HTTP-only cookie
4. Client fetches `/api/profile` to retrieve user info

## Database Schema

| Table              | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `users`            | Store Google-authenticated users (roles: owner, admin) |
| `sites`            | Sites where feedback can be collected                  |
| `feedback`         | Feedback entries (public or private)                   |
| `feedback_summary` | AI-generated summaries of feedback                     |

## AI Summarization Flow

1. Owner clicks "Summarize"
2. API endpoint `/api/feedback/summarize?site_id=` triggers Google GenAI ("gemini-2.5-flash")
3. Result stored in `feedback_summary`
4. Endpoint blocks for 5 minutes to prevent frequent calls
