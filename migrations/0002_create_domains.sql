CREATE TABLE domains (
  id SERIAL PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE
);

ALTER TABLE urls
ADD COLUMN domain_id INTEGER;

WITH localhost AS (
  INSERT INTO domains(domain) 
  VALUES ('http://localhost') 
  RETURNING id
)
UPDATE urls
SET domain_id = id
FROM localhost;

ALTER TABLE urls
ALTER COLUMN domain_id
SET NOT NULL;

ALTER TABLE urls
ADD CONSTRAINT urls_domain_id_fkey
FOREIGN KEY (domain_id)
REFERENCES domains (id);
