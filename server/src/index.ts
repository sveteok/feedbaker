import express from "express";
import { restrictedCors, publicCors } from "./middleware/cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import sitesRouter from "./routes/sites";
import feedbackRouter from "./routes/feedback";
import usersRouter from "./routes/users";

import { createTables } from "./models/db";
import MESSAGES from "./constants/messages";
import { errorHandler } from "./middleware/errorHandler";

createTables();

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "localhost";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", restrictedCors, authRouter);
app.use("/api/", restrictedCors, profileRouter);
app.use("/api/sites", publicCors, sitesRouter);
app.use("/api/feedback", publicCors, feedbackRouter);
app.use("/api/users", restrictedCors, usersRouter);

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(MESSAGES.FEEDBACKER_API_LISTENING_TO_PORT, 4000);
});
