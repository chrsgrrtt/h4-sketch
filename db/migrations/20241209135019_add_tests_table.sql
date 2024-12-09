-- migrate:up
CREATE TABLE test_table (
   id text PRIMARY KEY,
   name text,
   description text
);

-- migrate:down
DROP TABLE test_table;