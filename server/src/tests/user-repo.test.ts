import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createTables, executeQuery } from "../models/db";

describe("User Repository", () => {
  beforeAll(async () => {
    await createTables();
  });

  beforeEach(async () => {
    await executeQuery(
      "TRUNCATE feedback, sites, users RESTART IDENTITY CASCADE;"
    );
  });

  it("creates a new user", async () => {
    const result = await executeQuery(
      `INSERT INTO users (provider, provider_id, email, name)
       VALUES ('github', gen_random_uuid()::text, 'user@test.com', 'Test User')
       RETURNING *;`
    );
    expect(result.rows[0].email).toBe("user@test.com");
  });

  it("prevents duplicate provider/provider_id", async () => {
    const providerId = crypto.randomUUID();
    await executeQuery(
      `INSERT INTO users (provider, provider_id, email, name)
       VALUES ('google', $1, 'first@test.com', 'User1');`,
      [providerId]
    );
    await expect(async () => {
      await executeQuery(
        `INSERT INTO users (provider, provider_id, email, name)
         VALUES ('google', $1, 'second@test.com', 'User2');`,
        [providerId]
      );
    }).rejects.toThrow();
  });
});
