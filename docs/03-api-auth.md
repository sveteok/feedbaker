# API Reference - Auth

## Base Path

`/api/auth`

**CORS**: restrictedCors
**Auth**: Varies by endpoint — some public, some require authentication

This route handles Google authentication, and CSRF token generation.

Endpoints Overview

| Method | Endpoint           | Description                        | Auth Required | Access Level |
| :----- | :----------------- | :--------------------------------- | :------------ | :----------- |
| `POST` | `/api/auth/google` | Authenticate user via Google OAuth | no            | Public       |
| `GET`  | `/api/profile`     | Get authenticated user info        | yes           | Owner/Admin  |
| `POST` | `/api/logout`      | Log out user and clear cookie      | yes           | Owner/Admin  |
| `GET`  | `/api/csrf`        | Generate CSRF token                | no            | Public       |

##### `POST /api/auth/google` Verifies Google OAuth credential, creates or fetches the user, sets JWT in HTTP-only cookie.

Auth: None (public)
CORS: restrictedCors

Request Body

| Field        | Type     | Required | Description                         |
| ------------ | -------- | -------- | ----------------------------------- |
| `credential` | `string` | yes      | Google ID token from Google One Tap |

Example Request

```
POST /api/auth/google
Content-Type: application/json

{
  "credential": "<GOOGLE_ID_TOKEN>"
}
```

Example Response

```
{
  "message": "Authenticated",
  "userPayload": {
    "user_id": "cd2d6b3b-8bcd-4d7f-8a5d-6de8cdd66f7d",
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://lh3.googleusercontent.com/john123",
    "is_admin": false
  }
}
```

Response Codes

| Code               | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `200 OK`           | Successful authentication; JWT set in HTTP-only cookie |
| `401 Unauthorized` | Invalid Google token                                   |

##### `GET /api/profile` Returns the authenticated user’s info.

Auth: authenticateOwnerOrAdmin
CORS: restrictedCors

Example Request

```
GET /api/profile
Authorization: Bearer <JWT>
```

Example Response

```
{
  "user_id": "cd2d6b3b-8bcd-4d7f-8a5d-6de8cdd66f7d",
  "name": "John Doe",
  "email": "john@example.com",
  "picture": "https://lh3.googleusercontent.com/john123",
  "is_admin": false
}
```

Response Codes

| Code               | Description                      |
| ------------------ | -------------------------------- |
| `200 OK`           | Authenticated user info returned |
| `401 Unauthorized` | User not authenticated           |

##### `POST /api/logout` Logs out the user by clearing the HTTP-only JWT cookie.

Auth: authenticateOwnerOrAdmin
CORS: restrictedCors

Example Request

```
POST /api/logout
Authorization: Bearer <JWT>
```

Example Response

```
{
  "success": true
}
```

Response Codes

| Code               | Description             |
| ------------------ | ----------------------- |
| `200 OK`           | Successfully logged out |
| `401 Unauthorized` | User not authenticated  |

##### `GET /api/csrf` Generates a CSRF token and sets it in a secure cookie (XSRF-TOKEN).

Auth: None (public)
CORS: restrictedCors

Example Request

```
GET /api/csrf
```

Example Response

```
{
  "csrfToken": "b5d1f2e6a7c8d9e0f123456789abcdef1234567890abcdef1234567890abcdef"
}
```

Response Codes

| Code     | Description                       |
| -------- | --------------------------------- |
| `200 OK` | CSRF token generated successfully |

## Notes

POST `/api/auth/google` issues a JWT token in an **HTTP-only cookie**.
CSRF token can be sent with requests for extra security.
**profile** and **logout** endpoints require a valid JWT cookie.
JWT expiration: 1 hour by default.
Admin users are automatically set based on the **ADMIN_USER** environment variable.
