CREATE TABLE urls (
  short TEXT NOT NULL UNIQUE,
  original TEXT NOT NULL
);

CREATE INDEX urls_original_idx ON urls(original);