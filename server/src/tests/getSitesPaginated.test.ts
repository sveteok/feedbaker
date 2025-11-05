import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createTables, executeQuery } from "../models/db";
import { createSite, getSitesPaginated } from "../models/sites";

const insertTestUser = async (email: string) => {
  const res = await executeQuery(
    `INSERT INTO users (provider, provider_id, email, name)
     VALUES ('google', gen_random_uuid()::text, $1, 'Tester')
     RETURNING user_id;`,
    [email]
  );
  return res.rows[0].user_id;
};

//verify filters, counts, and ordering.
describe("getSitesPaginated()", () => {
  let userId: string;

  beforeAll(async () => {
    await createTables();
  });

  beforeEach(async () => {
    await executeQuery(
      "TRUNCATE feedback, sites, users RESTART IDENTITY CASCADE;"
    );
    userId = await insertTestUser("paginated@user.com");
  });

  it("returns correct total count and paginated results", async () => {
    for (let i = 1; i <= 15; i++) {
      await createSite({
        name: `Site ${i}`,
        url: `https://example${i}.dev`,
        owner_id: userId,
        description: `Site number ${i}`,
      });
    }

    const page1 = await getSitesPaginated({
      owner_id: userId,
      searchText: "",
      limit: 10,
      offset: 0,
      is_admin: true,
    });

    const page2 = await getSitesPaginated({
      owner_id: userId,
      searchText: "",
      limit: 10,
      offset: 10,
      is_admin: true,
    });

    expect(page1.totalCount).toBe(15);
    expect(page1.sites.length).toBe(10);
    expect(page2.sites.length).toBe(5);
  });

  it("filters by searchText", async () => {
    await createSite({
      name: "Visible Site",
      url: "https://visible.dev",
      owner_id: userId,
      description: "Test search",
    });
    await createSite({
      name: "Hidden Site",
      url: "https://hidden.dev",
      owner_id: userId,
      description: "Should not match",
    });

    const filtered = await getSitesPaginated({
      owner_id: userId,
      searchText: "Visible",
      limit: 10,
      offset: 0,
      is_admin: true,
    });

    expect(filtered.totalCount).toBe(1);
    expect(filtered.sites[0]?.name).toBe("Visible Site");
  });
});
