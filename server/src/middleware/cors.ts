import cors from "cors";

export const publicCors = cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
});
export const restrictedCors = cors({
  // origin: process.env.PRIVATE_CORS_ORIGINS,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (process.env.PRIVATE_CORS_ORIGINS!.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
