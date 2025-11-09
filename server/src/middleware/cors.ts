import cors from "cors";

export const publicCors = cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
});
export const restrictedCors = cors({
  origin: process.env.PRIVATE_CORS_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
