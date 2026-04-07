import express from "express";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { UserPayload } from "../types/users";
import { baseUserSchema } from "../validations/users";
import { findOrCreateUser } from "../models/users";
import { createRateLimiter } from "../middleware/rateLimit";

const router = express.Router();
const googleAuthRateLimit = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
  message: "Too many login attempts. Try again later.",
  keyPrefix: "auth-google",
});

router.post(
  "/google",
  googleAuthRateLimit,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
  try {
    const COOKIE_NAME = process.env.COOKIE_NAME;
    const audience = process.env.GOOGLE_CLIENT_ID;
    const JWT_SECRET = process.env.JWT_SECRET;

    const { credential } = req.body;

    if (!COOKIE_NAME || !JWT_SECRET || !audience) {
      throw new Error("Missing auth environment variables");
    }

    const client = new OAuth2Client(audience);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience,
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const payload = ticket.getPayload();
    if (!payload || !payload?.sub || !payload?.email) {
      return res
        .status(400)
        .json({ error: "Invalid or malformed Google token payload" });
    }

    const ADMIN_USER = process.env.ADMIN_USER || "sveteok@gmail.com";

    const googlePayload = {
      provider: "google",
      provider_id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture,
      is_admin: payload.email === ADMIN_USER,
    };

    const parsed = baseUserSchema.safeParse(googlePayload);
    if (!parsed.success) {
      console.error("Invalid Google user data:", z.treeifyError(parsed.error));
      throw new Error("Invalid user data from Google");
    }

    const validatedUser = parsed.data;
    const user = await findOrCreateUser(validatedUser);

    const userPayload = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      picture: user.picture,
    } as UserPayload;

    const token = jwt.sign(userPayload, JWT_SECRET, {
      expiresIn: "10h",
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 10000,
      path: "/",
    });

    return res.status(200).json({ message: "Authenticated", userPayload });
  } catch (error) {
    return next(error);
  }
});

export default router;
