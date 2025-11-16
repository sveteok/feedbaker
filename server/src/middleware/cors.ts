import cors from "cors";

export const publicCors = cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
});

const allowedOrigins = process.env.PRIVATE_CORS_ORIGINS?.split(",") || [];

export const restrictedCors = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
