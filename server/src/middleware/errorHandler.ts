import { DatabaseError } from "pg";
import {
  SiteNotFoundError,
  InvalidSiteIdError,
  ForbiddenError,
  InvalidDataError,
  InvalidSiteDataError,
  FeedbackNotFoundError,
} from "../constants/errors";
import MESSAGES from "../constants/messages";

import { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${req.method} ${req.path}]`, err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: MESSAGES.INVALID_DATA,
      details: err.issues,
    });
  }

  if (err instanceof InvalidSiteIdError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof InvalidDataError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof SiteNotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof FeedbackNotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ForbiddenError) {
    return res.status(403).json({ error: err.message });
  }
  if (err instanceof InvalidSiteDataError) {
    return res.status(409).json({ error: err.message });
  }
  if (err instanceof DatabaseError) {
    return res.status(500).json({ error: MESSAGES.DATABASE_ERROR });
  }

  res.status(500).json({ error: MESSAGES.INTERNAL_SERVER_ERROR });
}
