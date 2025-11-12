## Feedback

| Method | Endpoint                 | Description                  | Auth Required   |
| :----- | :----------------------- | :--------------------------- | :-------------- |
| GET    | `/`                      | Get paginated feedback list  | Optional        |
| GET    | `/:feedback_id`          | Get feedback by ID           | no              |
| POST   | `/`                      | Create new feedback entry    | no              |
| PUT    | `/:feedback_id`          | Update (comment/public flag) | yes Owner/Admin |
| DELETE | `/:feedback_id`          | Delete feedback              | yes Owner/Admin |
| GET    | `/summarize?site_id=...` | Generate or get AI summary   | yes Owner/Admin |

##### `GET /api/feedback` Retrieve a paginated list of feedback entries for a given site.

Request Body

| Name         | Type    | Required | Description          |
| ------------ | ------- | -------- | -------------------- |
| `site_id`    | UUID    | yes      | Site ID              |
| `limit`      | int     | no       | Default 10           |
| `offset`     | int     | no       | Default 0            |
| `searchText` | string  | no       | Filter feedback text |
| `is_admin`   | boolean | no       | Used internally      |
| `owner_id`   | UUID    | no       | Used internally      |

Response (200 OK)

```
{
  "feedback": [
    {
      "feedback_id": "8b60c4b3-2d23-45ab-8a21-dcd76d23d7a0",
      "site_id": "9f1d5f2e-927a-4e31-b26a-19c5c1ad92f4",
      "author": "Jane Doe",
      "body": "I love the new design!",
      "public": true,
      "created_on": "2025-11-10T12:30:00Z",
      "updated_on": "2025-11-10T12:30:00Z"
    }
  ],
  "totalCount": 1
}
```

##### `GET /api/feedback/:feedback_id` Fetch a specific feedback by its ID.

Request Body

| Name          | Type | Required |
| ------------- | ---- | -------- |
| `feedback_id` | UUID | yes      |

Response (200 OK)

```
{
  "feedback_id": "8b60c4b3-2d23-45ab-8a21-dcd76d23d7a0",
  "site_id": "9f1d5f2e-927a-4e31-b26a-19c5c1ad92f4",
  "author": "Jane Doe",
  "body": "Love the dark mode option!",
  "public": true,
  "created_on": "2025-11-10T12:30:00Z",
  "updated_on": "2025-11-10T12:31:00Z"
}
```

Error Responses

| Code | Example                                | Meaning                |
| ---- | -------------------------------------- | ---------------------- |
| 404  | `{ "error": "FeedbackNotFoundError" }` | Feedback doesn’t exist |

##### `POST /api/feedback` Create a new feedback entry. This endpoint is public — no authentication required.

Request Body

| Field     | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `site_id` | UUID   | yes      | Target site      |
| `author`  | String | yes      | Name of the user |
| `body`    | String | yes      | Feedback message |

Validation (via Zod):
author: 1–255 chars
body: 1–1000 chars

Example Request

```
{
  "site_id": "9f1d5f2e-927a-4e31-b26a-19c5c1ad92f4",
  "author": "John Doe",
  "body": "The feedback form was very intuitive!"
}
```

Response (201 Created)

```
{
  "feedback_id": "b132a872-4d2c-4d77-b6a0-d11ffb9ebae1",
  "site_id": "9f1d5f2e-927a-4e31-b26a-19c5c1ad92f4",
  "author": "John Doe",
  "body": "The feedback form was very intuitive!",
  "public": false,
  "created_on": "2025-11-10T10:22:00Z",
  "updated_on": "2025-11-10T10:22:00Z"
}
```

##### `PUT /api/feedback/:feedback_id` Update a feedback entry (comment and/or visibility).

Only the **site owner or admin** may update.

Path Parameters

| Name          | Type | Required |
| ------------- | ---- | -------- |
| `feedback_id` | UUID | yes      |

Request Body

| Field             | Type          | Required | Description              |
| ----------------- | ------------- | -------- | ------------------------ |
| `comment`         | String / null | no       | Optional internal note   |
| `feedback_public` | Boolean       | yes      | Public visibility toggle |

Response (200 OK)

```
{
  "feedback_id": "b132a872-4d2c-4d77-b6a0-d11ffb9ebae1",
  "comment": "User contacted via email",
  "public": true,
  "updated_on": "2025-11-10T12:40:00Z"
}
```

Error Responses

| Code | Example                                | Meaning            |
| ---- | -------------------------------------- | ------------------ |
| 403  | `{ "error": "ForbiddenError" }`        | Not owner/admin    |
| 404  | `{ "error": "FeedbackNotFoundError" }` | Feedback not found |

##### `DELETE /api/feedback/:feedback_id` Delete a feedback entry by ID.

Only **owner/admin** may delete.

Path Parameters

| Name          | Type | Required |
| ------------- | ---- | -------- |
| `feedback_id` | UUID | yes      |

Response (200 OK)

```
{
  "deleted": true,
  "feedback_id": "b132a872-4d2c-4d77-b6a0-d11ffb9ebae1"
}
```

Error Responses

| Code | Example                                | Meaning               |
| ---- | -------------------------------------- | --------------------- |
| 403  | `{ "error": "ForbiddenError" }`        | Unauthorized deletion |
| 404  | `{ "error": "FeedbackNotFoundError" }` | Feedback not found    |

`GET /api/feedback/summarize?site_id=<UUID>` Trigger or retrieve an **AI-generated summary** of feedback for a site.

If a summarization process is already in progress, it returns the existing status instead of starting a new one.

Query Parameters

| Name       | Type    | Required | Description          |
| ---------- | ------- | -------- | -------------------- |
| `site_id`  | UUID    | yes      | Site ID to summarize |
| `is_admin` | Boolean | no       | Internal use         |
| `owner_id` | UUID    | no       | Internal use         |

Response (200 OK)

```
{
  "site_id": "9f1d5f2e-927a-4e31-b26a-19c5c1ad92f4",
  "summary": "Users appreciate the new UI but request faster load times.",
  "started_on": "2025-11-10T10:30:00Z",
  "updated_on": "2025-11-10T10:35:00Z"
}
```

Behavior

Checks if a summary is already being generated.
If not, creates a new summarization record (feedback_summary table).
Fetches all feedback via getFeedbackBody().
Calls summarizeFeedback() (Google GenAI).
Returns existing or newly started summarization entry.

Error Reference

| HTTP Code | Error                     | Cause                      |
| --------- | ------------------------- | -------------------------- |
| 400       | `ZodError`                | Validation failed          |
| 403       | `ForbiddenError`          | Unauthorized access        |
| 404       | `FeedbackNotFoundError`   | Record not found           |
| 429       | `SummarizationInProgress` | Already processing summary |
| 500       | `ServerError`             | Unexpected exception       |

### Example Workflow

User submits feedback via widget => POST /api/feedback
Owner views feedback => GET /api/feedback?site_id=...
Owner updates visibility/comment => PUT /api/feedback/:id
Owner deletes spam => DELETE /api/feedback/:id
Owner generates summary => GET /api/feedback/summarize?site_id=...
