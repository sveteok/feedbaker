# Users Endpoints

## Base Path

`/api/users`

**CORS**: restrictedCors
**Auth**: Requires authentication (authenticateOwnerOrAdmin)
**Access**: Admin-only for listing users; owners or admins for deletion

This route manages Feedbaker users.
Only admins can retrieve all users; individual users or admins can delete accounts.

## Endpoints Overview

| Method   | Endpoint              | Description                     | Auth Required | Access Level |
| :------- | :-------------------- | :------------------------------ | :------------ | :----------- |
| `GET`    | `/api/users`          | Get paginated list of all users | yes           | Admin only   |
| `DELETE` | `/api/users/:user_id` | Delete a user account           | yes           | Owner/Admin  |

##### `GET /api/users` Returns a paginated list of users.

Accessible only to **admin** accounts.

Auth: authenticateOwnerOrAdmin
CORS: restrictedCors

Query Parameters

| Name         | Type     | Required | Description                                  |
| ------------ | -------- | -------- | -------------------------------------------- |
| `limit`      | `number` | No       | Number of results per page (default: `10`)   |
| `offset`     | `number` | No       | Number of results to skip (default: `0`)     |
| `searchText` | `string` | No       | Filter by user name or email (partial match) |

Example Request

```
GET /api/users?limit=10&offset=0&searchText=john
Authorization: Bearer <JWT>
```

Example Response

```
{
  "users": [
    {
      "user_id": "cd2d6b3b-8bcd-4d7f-8a5d-6de8cdd66f7d",
      "name": "John Doe",
      "email": "john@example.com",
      "picture": "https://lh3.googleusercontent.com/john123",
      "is_admin": false
    }
  ],
  "totalCount": 1
}
```

Response Codes

| Code               | Description                        |
| ------------------ | ---------------------------------- |
| `200 OK`           | Success — paginated users returned |
| `403 Forbidden`    | Requesting user is not an admin    |
| `401 Unauthorized` | Missing or invalid token           |

##### `DELETE /api/users/:user_id` Deletes a user account.

Available to **admins** and the **user themselves**.

Auth: authenticateOwnerOrAdmin
CORS: restrictedCors

URL Parameters

| Name      | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `user_id` | `UUID` | yes      | ID of the user to delete |

Example Request

```
DELETE /api/users/5f1c9f10-1234-4d9a-8b45-cbd79b9e3b6a
Authorization: Bearer <JWT>
```

Example Response

```
  {
      "user_id": "5f1c9f10-1234-4d9a-8b45-cbd79b9e3b6a",
      "name": "John Doe",
      "email": "john@example.com",
      "picture": "https://lh3.googleusercontent.com/john123",
      "is_admin": false
    }
```

Response Codes

| Code               | Description               |
| ------------------ | ------------------------- |
| `200 OK`           | User deleted successfully |
| `401 Unauthorized` | Not authenticated         |
| `403 Forbidden`    | Not owner or admin        |
| `404 Not Found`    | User not found            |

## Notes

Cookies are automatically cleared (res.clearCookie(COOKIE_NAME)) on account deletion.
The COOKIE_NAME is defined in your environment configuration (.env file).
Only admin users can list other users; all others will receive 403 Forbidden.
