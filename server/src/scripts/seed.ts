import { createTables, executeQuery } from "../models/db";
import { randomUUID } from "crypto";

const seed = async () => {
  console.log("Seeding mock data...");
  await createTables();

  await executeQuery("DELETE FROM feedback;", []);
  await executeQuery("DELETE FROM sites;", []);

  const owner1 = randomUUID();
  const owner2 = randomUUID();

  const owner1Id = randomUUID();
  const owner2Id = randomUUID();

  const users = [
    {
      user_id: owner1,
      provider: "google",
      provider_id: owner1Id,
      email: "owner1@gmail.com",
      name: "owner1",
      is_admin: false,
    },
    {
      user_id: owner2,
      provider: "yle",
      provider_id: owner2Id,
      email: "owner2@gmail.com",
      name: "owner2",
      is_admin: true,
    },
  ];

  for (const u of users) {
    await executeQuery(
      ` INSERT INTO users (user_id, provider, provider_id, email, name, is_admin)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (provider, provider_id)
                DO UPDATE SET
                email = EXCLUDED.email,
                name = EXCLUDED.name,
                picture = EXCLUDED.picture,
                is_admin = EXCLUDED.is_admin,
                updated_on = now()
                RETURNING *;`,
      [u.user_id, u.provider, u.provider_id, u.email, u.name, u.is_admin]
    );
  }

  const sites = [
    {
      name: "Feedbaker",
      url: "https://feedbaker.com",
      owner_id: owner2,
      description: "Feedback management platform",
    },
    {
      name: "Yle FI",
      url: "https://yle.fi/",
      owner_id: owner1,
      description: "Yle Uutiset.",
    },
    {
      name: "Google",
      url: "https://www.google.com/",
      owner_id: owner1,
      description:
        "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking",
    },
    {
      name: "CodeHub",
      url: null,
      owner_id: owner2,
      description: "Developer resource hub",
    },
  ];

  for (const s of sites) {
    await executeQuery(
      `INSERT INTO sites (site_id, name, url, owner_id, description, created_on, updated_on)
       VALUES ($1, $2, $3, $4, $5, now(), now())`,
      [randomUUID(), s.name, s.url, s.owner_id, s.description]
    );
  }

  console.log("Done seeding.");
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
