const MESSAGES = Object.freeze({
  FEEDBACKER_API_LISTENING_TO_PORT: `Feedbaker API listening to port`,
  ERROR_FETCHING_SITES: `Error fetching sites`,
  ERROR_CREATING_SITE: `Error creating site`,
  ERROR_DELETING_SITE: `Error deleting site`,
  ERROR_UPDATING_SITE: `Error updating site`,
  SITE_WITH_ID_NOT_FOUND: `Application with ID {ID} not found`,
  INVALID_SITE_ID: `Invalid application ID`,
  INVALID_DATA: `Invalid data`,
  ERROR_SITE_NAME_ALREADY_EXITS: `Site name already exists`,
  ERROR_OBJECT_ALREADY_EXITS: `Object already exists`,
  ERROR_FETCHING_FEEDBACK: `Error fetching feedback`,
  ERROR_CREATING_FEEDBACK: `Error creating feedback`,
  ERROR_DELETING_FEEDBACK: `Error deleting feedback`,
  ERROR_UPDATING_FEEDBACK: `Error updating feedback`,
  FEEDBACK_WITH_ID_NOT_FOUND: `Feedback with ID {ID} not found`,
  FEEDBACK_INVALID_DATA: `Invalid feedback data: site_id and text required`,

  DATABASE_ERROR: `Database error`,
  INTERNAL_SERVER_ERROR: `Internal Server Error`,
  INVALID_TOKEN: `Invalid token`,
  UNKNOWN_ENDPOINT: `Unknown Endpoint`,
  SECRET_ENV_NOT_SET: `SECRET environment variable is not set`,
  FORBIDDEN: `Forbidden`,
});

export default MESSAGES;
