import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import sitesRouter from "./routes/sites";

import { createTables } from "./models/db";
import MESSAGES from "./constants/messages";

createTables();

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "localhost";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/", profileRouter);
app.use("/api/sites", sitesRouter);

app.listen(PORT, HOST, () => {
  console.log(MESSAGES.FEEDBACKER_API_LISTENING_TO_PORT, 4000);
});
