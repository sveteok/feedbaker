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
  const JWT_SECRET = process.env.JWT_SECRET!;
  const COOKIE_NAME = process.env.COOKIE_NAME!;

  if (JWT_SECRET === undefined) {
    throw new Error(MESSAGES.SECRET_ENV_NOT_SET);
  }

  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded !== "string") req.user = decoded as UserPayload;
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
    const JWT_SECRET = process.env.JWT_SECRET!;
    const COOKIE_NAME = process.env.COOKIE_NAME!;

    if (JWT_SECRET === undefined) {
      throw new Error(MESSAGES.SECRET_ENV_NOT_SET);
    }

    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "Missing authentication token" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

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
