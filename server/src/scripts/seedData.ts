import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

import {
  feedbackData,
  FeedbackPlaceholder,
  SitePlaceholder,
  sitesData,
  UserPlaceholder,
  usersData,
} from "./placeholder-data";

async function connectToDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  console.log("Connected to:", process.env.DATABASE_URL);
  return client;
}

export const main = async () => {
  const client = await connectToDb();
  console.log("Seeding data...");
  // await createTables();

  // await client.query("DELETE FROM feedback;", []);
  // await client.query("DELETE FROM sites;", []);
  // await client.query("DELETE FROM users;", []);

  const users: UserPlaceholder[] = usersData;
  const insertedUsers = await Promise.all(
    users.map((u) =>
      client.query(
        ` INSERT INTO users (provider, provider_id, email, name, is_admin, created_on, updated_on, picture)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (provider, provider_id)
                DO NOTHING
                RETURNING *;`,
        [
          u.provider,
          u.provider_id,
          u.email,
          u.name,
          u.is_admin,
          u.created_on,
          u.updated_on,
          u.picture ?? null,
        ]
      )
    )
  );

  const validUsers = insertedUsers.filter(
    (result) => result && result.rows && result.rows.length > 0
  );
  console.log(`Seeded ${validUsers.length} users`);

  const selectedUsers = await client.query(`select user_id from users;`);
  const validUsersData = selectedUsers.rows;

  if (validUsersData.length === 0) {
    console.warn("No users inserted — seeding aborted.");
    process.exit(1);
  }

  const sites: SitePlaceholder[] = sitesData;
  const insertedSites = await Promise.all(
    sites.map((site) => {
      const randomUser =
        validUsersData[Math.floor(Math.random() * validUsersData.length)];

      const userId = randomUser?.user_id;
      return client.query(
        `INSERT INTO sites (owner_id, name, url, description, created_on, updated_on)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO NOTHING
         RETURNING *;`,
        [
          userId,
          site.name,
          site.url,
          site.description,
          site.created_on,
          site.updated_on,
        ]
      );
    })
  );
  const validSites = insertedSites.filter(
    (result) => result && result.rows && result.rows.length > 0
  );
  console.log(`Seeded ${validSites.length} sites`);

  const selectedSites = await client.query(`select site_id, url from sites;`);
  const validSitesData = selectedSites.rows;

  if (validSitesData.length === 0) {
    console.warn("No sites inserted — skipping feedback seed.");
    process.exit(1);
  }

  const feedback: FeedbackPlaceholder[] = feedbackData;
  const insertedFeedback = await Promise.all(
    feedback.map((f) => {
      const randomSite =
        validSitesData[Math.floor(Math.random() * validSitesData.length)];

      const siteId = randomSite?.site_id;

      return client.query(
        `INSERT INTO feedback (site_id, author, body, public, created_on, updated_on, comment)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *;`,
        [
          siteId,
          f.author,
          f.body,
          f.public,
          f.created_on,
          f.updated_on,
          f.comment ?? null,
        ]
      );
    })
  );
  const validFeedback = insertedFeedback.filter(
    (r) => r && r.rows && r.rows.length > 0
  );
  console.log(`Seeded ${validFeedback.length} feedback`);

  console.log("Done seeding.");
};

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
