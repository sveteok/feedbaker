import express from "express";
import { restrictedCors, publicCors } from "./middleware/cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import sitesRouter from "./routes/sites";
import feedbackRouter from "./routes/feedback";
import usersRouter from "./routes/users";

import { createTables } from "./models/db";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const requiredEnvVars = ["COOKIE_NAME", "GOOGLE_CLIENT_ID", "JWT_SECRET"] as const;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.options("/api/feedback", publicCors);
app.options(/^(?!\/api\/feedback).*/, restrictedCors);

app.use("/api/auth", restrictedCors, authRouter);
app.use("/api/profile", restrictedCors, profileRouter);
app.use("/api/sites", restrictedCors, sitesRouter);
app.use("/api/feedback", publicCors, feedbackRouter);
app.use("/api/users", restrictedCors, usersRouter);

app.use(errorHandler);

const port = process.env.PORT || 8080;

async function startServer() {
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  await createTables();
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
