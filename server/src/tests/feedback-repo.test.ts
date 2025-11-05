import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createSite } from "../models/sites";
import { createTables, executeQuery } from "../models/db";
import {
  createFeedback,
  deleteFeedback,
  findFeedbackById,
  updateFeedback,
} from "../models/feedback";

const insertTestUser = async () => {
  const userRes = await executeQuery(
    `INSERT INTO users (provider, provider_id, email, name)
     VALUES ('google', gen_random_uuid()::text, 'owner@google.com', 'Google Test')
     RETURNING user_id;`
  );
  return userRes.rows[0].user_id as string;
};

describe("Feedback Repository", () => {
  let userId: string;
  let siteId: string;
  let feedbackId: string;

  beforeAll(async () => {
    await createTables();
  });

  beforeEach(async () => {
    await executeQuery(
      "TRUNCATE feedback, sites, users RESTART IDENTITY CASCADE;"
    );
    userId = await insertTestUser();

    const newSite = await createSite({
      name: "Feedback Site",
      url: "https://feedback.dev",
      owner_id: userId,
      description: "For feedback tests",
    });
    siteId = newSite.site_id;
  });

  it("creates and retrieves feedback", async () => {
    const newFeedback = await createFeedback({
      author: "Svetlana",
      site_id: siteId,
      body: "Great site!",
    });
    feedbackId = newFeedback.feedback_id;

    const found = await findFeedbackById(feedbackId);
    expect(found?.author).toBe("Svetlana");
    expect(found?.body).toBe("Great site!");
  });

  it("updates feedback comment and visibility", async () => {
    const fb = await createFeedback({
      author: "Anna",
      site_id: siteId,
      body: "Not bad",
    });

    const updated = await updateFeedback({
      feedback_id: fb.feedback_id,
      comment: "Thanks for your opinion!",
      public: false,
    });

    expect(updated.comment).toBe("Thanks for your opinion!");
    expect(updated.public).toBe(false);
  });

  it("deletes feedback", async () => {
    const fb = await createFeedback({
      author: "User",
      site_id: siteId,
      body: "Delete me",
    });

    feedbackId = fb.feedback_id;
    const deleted = await deleteFeedback({
      feedback_id: fb.feedback_id,
      site_id: siteId,
    });
    expect(deleted?.body).toBe("Delete me");

    const found = await findFeedbackById(feedbackId);
    expect(found).toBeNull();
  });
});
