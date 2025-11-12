# Site Endpoints

The **Sites API** manages the registered websites that can receive feedback.
Each site belongs to an owner and may include optional metadata like URL, description, and summary information.

## Base Path

`/api/sites`

| Method | Endpoint    | Description            | Auth Required   |
| :----- | :---------- | :--------------------- | :-------------- |
| GET    | `/`         | List sites (paginated) | Optional        |
| GET    | `/:site_id` | Get site details by ID | no              |
| POST   | `/`         | Create new site        | yes Owner/Admin |
| PUT    | `/:site_id` | Update existing site   | yes Owner/Admin |
| DELETE | `/:site_id` | Delete site            | yes Owner/Admin |

##### `/api/sites` Returns a paginated list of sites.

Available publicly, but authenticated users may receive more detail (depending on ownership/admin privileges).

Query Parameters

| Name          | Type    | Required | Description               |
| ------------- | ------- | -------- | ------------------------- |
| `limit`       | int     | no       | Default 10                |
| `offset`      | int     | no       | Default 0                 |
| `searchText`  | string  | no       | Search by name or URL     |
| `owner_id`    | UUID    | no       | Filter sites by owner     |
| `is_admin`    | boolean | no       | Used internally for admin |
| `site_public` | boolean | no       | Show only public sites    |

Example Request

```
GET /api/sites?limit=10&offset=0
```

Response (200 OK)

```
{
  "sites": [
    {
      "site_id": "32be9ff4-4ad4-41b0-9251-b7c5c09b45c9",
      "name": "Feedbaker Demo",
      "url": "https://feedbaker.app",
      "description": "Official demo site for Feedbaker",
      "owner_id": "0e1f8f4d-d5f7-4c82-8c65-322a6cb38410",
      "created_on": "2025-11-01T09:20:00Z",
      "updated_on": "2025-11-05T10:05:00Z",
      "feedback_count": 12
    }
  ],
  "totalCount": 1
}
```

##### `GET /api/sites/:site_id` Fetch detailed information about a specific site.

Path Parameters

| Name      | Type | Required |
| --------- | ---- | -------- |
| `site_id` | UUID | yes      |

Response (200 OK)

```
{
  "site_id": "32be9ff4-4ad4-41b0-9251-b7c5c09b45c9",
  "name": "Feedbaker Demo",
  "url": "https://feedbaker.app",
  "description": "Official demo instance",
  "owner_id": "0e1f8f4d-d5f7-4c82-8c65-322a6cb38410",
  "created_on": "2025-11-01T09:20:00Z",
  "updated_on": "2025-11-05T10:05:00Z",
  "summary": null
}
```

Error Responses

| Code | Example                            | Meaning            |
| ---- | ---------------------------------- | ------------------ |
| 404  | `{ "error": "SiteNotFoundError" }` | Site doesn’t exist |

##### `POST /api/sites` Create a new site entry.

Authenticated **owners or admins** only.

Request Body

| Field         | Type          | Required | Description              |
| ------------- | ------------- | -------- | ------------------------ |
| `name`        | String        | yes      | Display name of the site |
| `url`         | String / null | no       | Public website URL       |
| `description` | String / null | no       | Short description        |

`owner_id` is automatically set from the authenticated user.

Example Request

```
{
  "name": "My Project Docs",
  "url": "https://mydocs.app",
  "description": "Documentation portal"
}
```

Response (201 Created)

```
{
  "site_id": "7f10b0e8-6432-4d0a-98a2-28dcfc74234c",
  "name": "My Project Docs",
  "url": "https://mydocs.app",
  "description": "Documentation portal",
  "owner_id": "2f0a0de0-77c4-4a1d-a29d-3a2b7b7332f4",
  "created_on": "2025-11-10T09:00:00Z",
  "updated_on": "2025-11-10T09:00:00Z"
}
```

Error Responses

| Code | Example                                         | Meaning                                 |
| ---- | ----------------------------------------------- | --------------------------------------- |
| 400  | `{ "error": "InvalidSiteDataError" }`           | Validation or unique constraint failure |
| 409  | `{ "error": "ERROR_SITE_NAME_ALREADY_EXISTS" }` | Duplicate name                          |
| 403  | `{ "error": "ForbiddenError" }`                 | Unauthorized creation                   |

##### `PUT /api/sites/:site_id` Update a site’s information (name, URL, description).

Only the site owner or an admin may modify.

Path Parameters

| Name      | Type | Required |
| --------- | ---- | -------- |
| `site_id` | UUID | yes      |

Request Body

| Field         | Type          | Required | Description         |
| ------------- | ------------- | -------- | ------------------- |
| `name`        | String        | no       | New name            |
| `url`         | String / null | no       | Updated URL         |
| `description` | String / null | no       | Updated description |

Response (200 OK)

```
{
  "site_id": "7f10b0e8-6432-4d0a-98a2-28dcfc74234c",
  "name": "My Updated Docs",
  "url": "https://docs.example.com",
  "description": "Updated description",
  "owner_id": "2f0a0de0-77c4-4a1d-a29d-3a2b7b7332f4",
  "updated_on": "2025-11-10T12:40:00Z"
}
```

Error Responses

| Code | Example                            | Meaning         |
| ---- | ---------------------------------- | --------------- |
| 403  | `{ "error": "ForbiddenError" }`    | Not owner/admin |
| 404  | `{ "error": "SiteNotFoundError" }` | Site not found  |

##### `DELETE /api/sites/:site_id` Delete a site by its ID.

Only **owner or admin** can delete a site.

Path Parameters

| Name      | Type | Required |
| --------- | ---- | -------- |
| `site_id` | UUID | yes      |

Response (200 OK)

`{
"site_id": "7f10b0e8-6432-4d0a-98a2-28dcfc74234c",
"name": "My Updated Docs",
"url": "https://docs.example.com",
"description": "Updated description",
"owner_id": "2f0a0de0-77c4-4a1d-a29d-3a2b7b7332f4",
"updated_on": "2025-11-10T12:40:00Z"
}`

Error Responses

| Code | Example                            | Meaning        |
| ---- | ---------------------------------- | -------------- |
| 403  | `{ "error": "ForbiddenError" }`    | Unauthorized   |
| 404  | `{ "error": "SiteNotFoundError" }` | Site not found |

Error Reference

| HTTP Code | Error                  | Description                     |
| --------- | ---------------------- | ------------------------------- |
| 400       | `ZodError`             | Validation failure              |
| 403       | `ForbiddenError`       | Unauthorized request            |
| 404       | `SiteNotFoundError`    | No matching record              |
| 409       | `InvalidSiteDataError` | Conflict (e.g., duplicate name) |
| 500       | `ServerError`          | Unexpected backend error        |

## Example Workflow

Admin or owner creates a site => POST /api/sites
Anyone lists public sites => GET /api/sites
Owner edits metadata => PUT /api/sites/:id
Admin deletes an inactive site => DELETE /api/sites/:id
