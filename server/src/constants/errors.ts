import MESSAGES from "../constants/messages";

export class SiteNotFoundError extends Error {
  constructor(id: string) {
    super(MESSAGES.SITE_WITH_ID_NOT_FOUND.replace(`{ID}`, `${id}`));
    this.name = "SiteNotFoundError";
  }
}

export class InvalidSiteIdError extends Error {
  constructor() {
    super(MESSAGES.INVALID_SITE_ID);
    this.name = "InvalidSiteIdError";
  }
}

export class FetchingSitesError extends Error {
  constructor() {
    super(MESSAGES.ERROR_FETCHING_SITES);
    this.name = "FetchingSitesError";
  }
}

export class InvalidToken extends Error {
  constructor() {
    super(MESSAGES.INVALID_TOKEN);
    this.name = "InvalidToken";
  }
}

export class InvalidDataError extends Error {
  constructor() {
    super(MESSAGES.INVALID_DATA);
    this.name = "InvalidDataError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super(MESSAGES.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}

export class FeedbackNotFoundError extends Error {
  constructor(id: string) {
    super(MESSAGES.FEEDBACK_WITH_ID_NOT_FOUND.replace(`{ID}`, `${id}`));
    this.name = "FeedbackNotFoundError";
  }
}

export class InvalidFeedbackDataError extends Error {
  constructor() {
    super(MESSAGES.FEEDBACK_INVALID_DATA);
    this.name = "InvalidFeedbackDataError";
  }
}

export class InvalidSiteDataError extends Error {
  constructor(msg?: string) {
    super(msg || MESSAGES.ERROR_OBJECT_ALREADY_EXITS);
    this.name = "InvalidSiteDataError";
  }
}
