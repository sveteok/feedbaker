import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import {
  authenticateOwnerOrAdmin,
  verifyCsrfToken,
} from "./middleware/auth";
import { AuthenticateRequest } from "./types/users";
import { createRateLimiter } from "./middleware/rateLimit";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

const testRateLimit = createRateLimiter({
  maxRequests: 2,
  windowMs: 60 * 1000,
  message: "Too many requests",
  keyPrefix: "test",
});

app.get(
  "/api/protected",
  authenticateOwnerOrAdmin,
  (req: AuthenticateRequest, res: express.Response) => {
    return res.json({ ok: true, user: req.user });
  }
);

app.post(
  "/api/protected-csrf",
  authenticateOwnerOrAdmin,
  verifyCsrfToken,
  (req: AuthenticateRequest, res: express.Response) => {
    return res.json({ ok: true, user: req.user });
  }
);

app.get("/api/rate-limited", testRateLimit, (_req, res: express.Response) => {
  return res.json({ ok: true });
});

export default app;
