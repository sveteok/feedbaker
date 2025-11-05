import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import {
  createSite,
  deleteSite,
  findSiteById,
  updateSite,
} from "../models/sites";
import { createTables, executeQuery } from "../models/db";

const insertTestUser = async () => {
  const userRes = await executeQuery(
    `INSERT INTO users (provider, provider_id, email, name)
     VALUES ('google', gen_random_uuid()::text, 'owner@google.com', 'Google Test')
     RETURNING user_id;`
  );
  return userRes.rows[0].user_id as string;
};

describe("Sites Repository", () => {
  let userId: string;
  let siteId: string;

  beforeAll(async () => {
    await createTables();
  });

  beforeEach(async () => {
    await executeQuery(
      "TRUNCATE feedback, sites, users RESTART IDENTITY CASCADE;"
    );
    userId = await insertTestUser();
    const check = await executeQuery("SELECT COUNT(*) FROM users;");
    console.log("User count", check.rows[0]);
  });

  it("creates and retrieves a site", async () => {
    const newSite = await createSite({
      name: "Feedbaker Mock",
      url: "https://feedbaker.dev",
      owner_id: userId,
      description: "Initial site",
    });
    siteId = newSite.site_id;
    console.log(newSite);

    const found = await findSiteById(siteId);
    expect(found?.name).toBe("Feedbaker Mock");
  });

  it("updates a site", async () => {
    const site = await createSite({
      name: "My Site",
      url: "https://mysite.dev",
      owner_id: userId,
      description: "Before update",
    });

    const updated = await updateSite({
      name: "My Site Updated",
      url: "https://mysite.dev",
      site_id: site.site_id,
      description: "Updated description",
    });

    expect(updated.name).toBe("My Site Updated");
    expect(updated.description).toBe("Updated description");
  });

  it("deletes a site", async () => {
    const site = await createSite({
      name: "Delete Test",
      url: "https://delete.dev",
      owner_id: userId,
      description: "To be deleted",
    });

    const siteId = site.site_id;

    const deleted = await deleteSite(site.site_id);
    expect(deleted?.name).toBe("Delete Test");

    const found = await findSiteById(siteId);
    expect(found).toBeNull();
  });
});
