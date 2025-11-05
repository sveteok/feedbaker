import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createTables, executeQuery } from "../models/db";
import { createSite } from "../models/sites";
import { createFeedback, getFeedbackPaginated } from "../models/feedback";

const insertUser = async () => {
  const res = await executeQuery(
    `INSERT INTO users (provider, provider_id, email, name)
     VALUES ('google', gen_random_uuid()::text, 'feedback@user.com', 'User')
     RETURNING user_id;`
  );
  return res.rows[0].user_id;
};

//verify that admin/public filters and counts behave as expected.
describe("getFeedbackPaginated()", () => {
  let userId: string;
  let siteId: string;

  beforeAll(async () => {
    await createTables();
  });

  beforeEach(async () => {
    await executeQuery(
      "TRUNCATE feedback, sites, users RESTART IDENTITY CASCADE;"
    );
    userId = await insertUser();

    const site = await createSite({
      name: "Feedback Test Site",
      url: "https://feedback.dev",
      owner_id: userId,
      description: "Feedback test",
    });
    siteId = site.site_id;
  });

  it("returns paginated feedback results with total count", async () => {
    for (let i = 1; i <= 12; i++) {
      await createFeedback({
        site_id: siteId,
        author: `Author ${i}`,
        body: `Body ${i}`,
      });
    }

    const page1 = await getFeedbackPaginated({
      site_id: siteId,
      limit: 10,
      offset: 0,
      is_admin: true,
    });

    const page2 = await getFeedbackPaginated({
      site_id: siteId,
      limit: 10,
      offset: 10,
      is_admin: true,
    });

    expect(page1.totalCount).toBe(12);
    expect(page1.feedback.length).toBe(10);
    expect(page2.feedback.length).toBe(2);
  });

  it("filters feedback by text", async () => {
    await createFeedback({
      site_id: siteId,
      author: "Anna",
      body: "Awesome work",
    });
    await createFeedback({
      site_id: siteId,
      author: "John",
      body: "Not related",
    });

    const results = await getFeedbackPaginated({
      site_id: siteId,
      search: "Awesome",
      limit: 10,
      offset: 0,
      is_admin: true,
    });

    expect(results.totalCount).toBe(1);
    expect(results.feedback[0]?.body).toBe("Awesome work");
  });
});
