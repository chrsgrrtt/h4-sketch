CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE test_table (
   id text PRIMARY KEY,
   name text,
   description text
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20241209135019');
