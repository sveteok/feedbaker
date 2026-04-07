import { beforeEach, describe, expect, it } from "vitest";
import jwt, { SignOptions } from "jsonwebtoken";
import request from "supertest";

import app from "../testApp";
import { resetRateLimiterBuckets } from "../middleware/rateLimit";

const COOKIE_NAME = "feedbaker_session";
const SECRET = "testsecret";

process.env.JWT_SECRET = SECRET;
process.env.COOKIE_NAME = COOKIE_NAME;

function createTestToken(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1h"
) {
  return jwt.sign(payload, SECRET, { expiresIn });
}

beforeEach(() => {
  resetRateLimiterBuckets();
});

describe("CSRF protection", () => {
  it("rejects authenticated mutation without csrf token", async () => {
    const token = createTestToken({
      user_id: "u1",
      email: "user@example.com",
      name: "User",
    });

    const res = await request(app)
      .post("/api/protected-csrf")
      .set("Cookie", `${COOKIE_NAME}=${token}`)
      .expect(403);

    expect(res.body.error).toBe("Invalid CSRF token");
  });

  it("allows authenticated mutation with matching csrf header and cookie", async () => {
    const token = createTestToken({
      user_id: "u1",
      email: "user@example.com",
      name: "User",
    });

    const res = await request(app)
      .post("/api/protected-csrf")
      .set("Cookie", [`${COOKIE_NAME}=${token}`, "XSRF-TOKEN=csrf-token"])
      .set("x-csrf-token", "csrf-token")
      .expect(200);

    expect(res.body.ok).toBe(true);
  });
});

describe("Rate limiting", () => {
  it("returns 429 after the configured request limit", async () => {
    await request(app).get("/api/rate-limited").expect(200);
    await request(app).get("/api/rate-limited").expect(200);

    const res = await request(app).get("/api/rate-limited").expect(429);

    expect(res.body.error).toBe("Too many requests");
    expect(res.headers["retry-after"]).toBeDefined();
  });
});
