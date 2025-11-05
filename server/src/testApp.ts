import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { authenticateOwnerOrAdmin } from "./middleware/auth";
import { AuthenticateRequest } from "./types/users";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get(
  "/api/protected",
  authenticateOwnerOrAdmin,
  (req: AuthenticateRequest, res: express.Response) => {
    return res.json({ ok: true, user: req.user });
  }
);

export default app;
