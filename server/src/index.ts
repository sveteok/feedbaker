import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { createTables } from "./models/db";
createTables();

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "localhost";

const app = express();

app.listen(PORT, HOST, () => {
  console.log(`Feedbaker API listening to port`, 4000);
});
