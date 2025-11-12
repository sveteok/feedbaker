Getting Started with Feedbaker

This guide helps you set up **Feedbaker** locally using **Next.js + Express + PostgreSQL**.

## Prerequisites

- Node.js 20+
- pnpm or npm
- PostgreSQL 14+
- Google Cloud OAuth credentials (Client ID)

## Clone the Repository

```Clone with HTTPS
git clone https://gitlab.com/sveteok/feedbaker.git
cd feedbaker
```

## Environment Setup

Copy template files:

```
cp client/TEMPLATE.env client/.env.local
cp server/TEMPLATE.env server/.env
```

Fill in values (example):

```
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
COOKIE_NAME=auth_cookie
JWT_SECRET=supersecretkey

# server/.env
PORT=4000

PRIVATE_CORS_ORIGINS=["http://localhost:3000", ]
ADMIN_USER=admin_user_google_email

PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=password
PG_DATABASE=feedbaker

COOKIE_NAME=auth_cookie
JWT_SECRET=supersecretkey
GOOGLE_CLIENT_ID=your-google-client-id
GEMINI_API_KEY=your-google-genai-key

```

## Install Dependencies

```
npm install # or pnpm install
```

## Run the Services

Start the API:

```
cd server
npm dev
```

Start the frontend:

```
cd client
npm dev
```

The app will be available at:
http://localhost:3000

## Seed the Database (Optional)

For demo/testing data:

```
cd server
npm run seed
```

You're ready to explore Feedbaker's dashboard, submit feedback, and test the AI summarization.
