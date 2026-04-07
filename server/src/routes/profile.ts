import express from "express";
import crypto from "crypto";
import {
  authenticateOwnerOrAdmin,
  verifyCsrfToken,
} from "../middleware/auth";
import { AuthenticateRequest } from "../types/users";

const router = express.Router();

router.get(
  "/",
  authenticateOwnerOrAdmin,
  (req: AuthenticateRequest, res: express.Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(req.user);
  }
);

router.post("/logout", verifyCsrfToken, (_req, res: express.Response) => {
  const COOKIE_NAME = process.env.COOKIE_NAME!;
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.json({ success: true });
});

router.get("/csrf", (_req, res: express.Response) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");

  res.cookie("XSRF-TOKEN", csrfToken, {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({ csrfToken });
});

export default router;
