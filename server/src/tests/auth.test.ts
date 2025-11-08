import { vi, describe, it, expect, beforeEach } from "vitest";
import { OAuth2Client } from "google-auth-library";

import request from "supertest";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";
import app from "../testApp";

const COOKIE_NAME = "feedbaker_session";
const SECRET = "testsecret";
process.env.JWT_SECRET = SECRET;
process.env.COOKIE_NAME = COOKIE_NAME;
process.env.ADMIN_USER = "admin@example.com";
process.env.GOOGLE_CLIENT_ID = "fake-client-id";

vi.mock("google-auth-library", async () => {
  const actual = await vi.importActual<typeof import("google-auth-library")>(
    "google-auth-library"
  );

  class MockOAuth2Client {
    async verifyIdToken() {
      return {
        getPayload: () => ({
          sub: "google-sub-123",
          email: "user@example.com",
          name: "Test User",
          picture: "http://example.com/avatar.png",
        }),
      } as unknown as LoginTicket;
    }
  }

  return { ...actual, OAuth2Client: MockOAuth2Client as unknown };
});

interface LoginTicketPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
  provider_id?: string;
}

interface LoginTicketEnvelope {
  [key: string]: unknown;
}

interface LoginTicketAttributes {
  [key: string]: unknown;
}

interface LoginTicket {
  getPayload(): LoginTicketPayload;
  getUserId(): string;
  getEnvelope(): LoginTicketEnvelope;
  getAttributes(): LoginTicketAttributes;
}

function createTestToken(
  payload: object,
  expiresIn: number | ms.StringValue = "1h"
) {
  const options: SignOptions = {
    expiresIn,
  };
  return jwt.sign(payload, SECRET, options);
}

const fakeUser = {
  sub: "google-sub-123",
  email: "user@example.com",
  name: "Test User",
  picture: "http://example.com/avatar.png",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Google Auth", () => {
  it("should login successfully and set cookie", async () => {
    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "mocked.jwt.token" })
      .expect(200);

    const cookies = res.headers["set-cookie"];
    expect(cookies?.[0]).toContain(COOKIE_NAME);
    expect(res.body.user.email).toBe(fakeUser.email);
  });

  it("should reject invalid google token", async () => {
    vi.spyOn(OAuth2Client.prototype, "verifyIdToken").mockRejectedValueOnce(
      new Error("Invalid Google token")
    );

    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "invalid" })
      .expect(401);

    expect(res.body.error).toMatch(/Invalid Google token/);
  });
});

describe("JWT Auth", () => {
  it("should allow access with valid jwt cookie", async () => {
    const token = createTestToken({
      user_id: "u1",
      email: "user@example.com",
      name: "User",
    });

    const res = await request(app)
      .get("/api/protected")
      .set("Cookie", `${COOKIE_NAME}=${token}`)
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(res.body.user.email).toBe("user@example.com");
  });

  it("should fail with invalid jwt cookie", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Cookie", `${COOKIE_NAME}=invalid.jwt.token`)
      .expect(401);

    expect(res.body.error).toBeDefined();
  });

  it("should reject missing cookie", async () => {
    await request(app).get("/api/protected").expect(401);
  });

  it("should reject expired jwt cookie", async () => {
    const token = createTestToken(
      { user_id: "u1", email: "user@example.com" },
      "-1s" // Expired token
    );

    await request(app)
      .get("/api/protected")
      .set("Cookie", `${COOKIE_NAME}=${token}`)
      .expect(401);
  });
});
