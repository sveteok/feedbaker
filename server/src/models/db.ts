import pg from "pg";
// const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;
// const pool = new pg.Pool({
//   host: PG_HOST,
//   port: Number(PG_PORT),
//   user: PG_USERNAME,
//   password: PG_PASSWORD,
//   database: PG_DATABASE,
// });

const { DATABASE_URL } = process.env;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

export const executeQuery = async (query: string, parameters?: unknown[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, parameters);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
      error.name = "dbError";
      throw error;
    }
    console.error(error);
    throw new Error("Unknown database error");
  } finally {
    client.release();
  }
};

export class QueryBuilder {
  query = "";
  params: unknown[] = [];

  addParam(value: unknown): string {
    this.params.push(value);
    return `$${this.params.length}`;
  }
}

export const createTables = async () => {
  await executeQuery(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

  const usersTableQuery = `CREATE TABLE IF NOT EXISTS "users" (
    "user_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "provider" VARCHAR(50) NOT NULL, 
    "provider_id" VARCHAR(200) NOT NULL, 
    "email" VARCHAR(255),
    "name" VARCHAR(255),
    "is_admin" BOOLEAN DEFAULT FALSE,
    "picture" TEXT,
    "created_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (provider, provider_id)
  );`;
  await executeQuery(usersTableQuery);

  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING gin (name gin_trgm_ops);`
  );

  console.log("Users table and idx_users_name_trgm initialized");

  const sitesTableQuery = `CREATE TABLE IF NOT EXISTS "sites" (
    "site_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "url" TEXT,
    "owner_id" UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    "description" TEXT,
    "created_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (owner_id, name)
  );`;
  await executeQuery(sitesTableQuery);
  console.log("Sites table initialized");

  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_sites_name_trgm ON sites USING gin (name gin_trgm_ops);`
  );
  console.log("INDEX idx_sites_name_trgm created");
  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_sites_url_trgm ON sites USING gin (url gin_trgm_ops);`
  );
  console.log("INDEX idx_sites_url_trgm created");

  const feedbackTableQuery = `CREATE TABLE IF NOT EXISTS "feedback" (
    "feedback_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "site_id" UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    "author" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "created_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "public" BOOLEAN DEFAULT TRUE,
    "comment" TEXT
  );`;
  await executeQuery(feedbackTableQuery);
  console.log("Feedback table initialized");

  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_feedback_body_trgm ON feedback USING gin (body gin_trgm_ops);`
  );
  console.log("INDEX idx_feedback_body_trgm created");

  const feedbackSiteIndexQuery = `CREATE INDEX IF NOT EXISTS "idx_feedback_siteid" ON feedback(site_id);`;
  await executeQuery(feedbackSiteIndexQuery);
  console.log("INDEX idx_feedback_siteid created");

  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_feedback_site_public_created ON feedback (site_id, public, created_on DESC);`
  );
  console.log("INDEX idx_feedback_site_public_created created");
  await executeQuery(
    `CREATE INDEX IF NOT EXISTS idx_created_on ON sites (created_on DESC);`
  );
  console.log("INDEX idx_created_on created");

  const feedbackSummaryTableQuery = `CREATE TABLE IF NOT EXISTS "feedback_summary" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "site_id" UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    "summary" TEXT,
    "started_on" TIMESTAMPTZ DEFAULT now(), -- when generation starts
    "updated_on" TIMESTAMPTZ DEFAULT now(),  -- when AI response is saved
    "error" VARCHAR(255),
    CONSTRAINT unique_site_summary UNIQUE (site_id)
  );`;
  await executeQuery(feedbackSummaryTableQuery);
  console.log("feedback_summary table initialized");
};
