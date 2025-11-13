CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "users" (
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
  );

CREATE TABLE IF NOT EXISTS "sites" (
    "site_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "url" TEXT,
    "owner_id" UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    "description" TEXT,
    "created_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (owner_id, name)
  );

CREATE TABLE IF NOT EXISTS "feedback" (
    "feedback_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "site_id" UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    "author" VARCHAR(255) UNIQUE NOT NULL,
    "body" TEXT NOT NULL,
    "created_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_on" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "public" BOOLEAN DEFAULT TRUE,
    "comment" TEXT 
  );

CREATE TABLE IF NOT EXISTS feedback_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    summary TEXT,
    started_on TIMESTAMPTZ DEFAULT now(),  -- when generation starts
    updated_on TIMESTAMPTZ DEFAULT now(),  -- when AI response is saved
    error VARCHAR(255),
    CONSTRAINT unique_site_summary UNIQUE (site_id)
);

CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_sites_name_trgm ON sites USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_sites_url_trgm ON sites USING gin (url gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_feedback_body_trgm ON feedback USING gin (body gin_trgm_ops);
CREATE INDEX idx_feedback_site_public_created ON feedback (site_id, public, created_on DESC);
CREATE INDEX idx_created ON sites (created_on DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_siteid ON feedback(site_id);