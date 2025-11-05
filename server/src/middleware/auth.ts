import express from "express";
import jwt from "jsonwebtoken";
import MESSAGES from "../constants/messages";

import { UserPayload, AuthenticateRequest } from "../types/users";

export const verifyCsrfToken = (
  req: AuthenticateRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const csrfHeader = req.headers["x-csrf-token"];
  const csrfCookie = req.cookies["XSRF-TOKEN"];

  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  next();
};

export const optionalAuth = (
  req: AuthenticateRequest,
  _res: express.Response,
  next: express.NextFunction
) => {
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const COOKIE_NAME = process.env.COOKIE_NAME!;

  if (GOOGLE_CLIENT_SECRET === undefined) {
    throw new Error(MESSAGES.SECRET_ENV_NOT_SET);
  }

  const token = req.cookies[COOKIE_NAME];

  console.log(req.cookies);
  if (token) {
    try {
      const decoded = jwt.verify(token, GOOGLE_CLIENT_SECRET);

      console.log("decoded");

      if (typeof decoded !== "string") req.user = decoded as UserPayload;

      console.log(decoded);
    } catch {
      console.log("ERROR");
      // ignore invalid token
    }
  }
  next();
};

export const authenticateOwnerOrAdmin = (
  req: AuthenticateRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const COOKIE_NAME = process.env.COOKIE_NAME!;

    if (GOOGLE_CLIENT_SECRET === undefined) {
      throw new Error(MESSAGES.SECRET_ENV_NOT_SET);
    }

    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "Missing authentication token" });
    }

    const decodedToken = jwt.verify(token, GOOGLE_CLIENT_SECRET);

    if (typeof decodedToken === "string") {
      throw new Error("Invalid token payload type");
    }

    req.user = decodedToken as UserPayload;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).send({ error: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
