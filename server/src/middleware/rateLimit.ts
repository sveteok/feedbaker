import express from "express";

type RateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
  message: string;
  keyPrefix: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const resetRateLimiterBuckets = () => {
  buckets.clear();
};

export const createRateLimiter = ({
  maxRequests,
  windowMs,
  message,
  keyPrefix,
}: RateLimiterOptions) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const now = Date.now();
    const ip = req.ip || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000)
      );
      res.setHeader("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json({ error: message });
    }

    current.count += 1;
    buckets.set(key, current);
    next();
  };
};
