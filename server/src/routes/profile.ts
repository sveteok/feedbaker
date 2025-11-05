import express from "express";
import { authenticateOwnerOrAdmin } from "../middleware/auth";
import { AuthenticateRequest } from "../types/users";

const router = express.Router();

router.get(
  "/profile",
  authenticateOwnerOrAdmin,
  (req: AuthenticateRequest, res: express.Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(req.user);
  }
);

router.post("/logout", (_req, res: express.Response) => {
  const COOKIE_NAME = process.env.COOKIE_NAME!;
  res.clearCookie(COOKIE_NAME, { httpOnly: true });
  res.json({ success: true });
});

export default router;
