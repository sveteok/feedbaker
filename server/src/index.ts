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
import { errorHandler } from "./middleware/errorHandler";

createTables();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.options("/api/feedback", publicCors);
app.options(/^(?!\/api\/feedback).*/, restrictedCors);

app.use("/api/auth", restrictedCors, authRouter);
app.use("/api/profile", restrictedCors, profileRouter);
app.use("/api/sites", restrictedCors, sitesRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/users", restrictedCors, usersRouter);

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
