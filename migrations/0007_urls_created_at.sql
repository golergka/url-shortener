ALTER TABLE urls
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();