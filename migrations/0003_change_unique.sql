ALTER TABLE urls
DROP CONSTRAINT urls_short_key;

CREATE UNIQUE INDEX urls_short_domain_id_idx
ON urls(short, domain_id);

ALTER TABLE urls
ADD CONSTRAINT urls_short_domain_id_key
UNIQUE USING INDEX urls_short_domain_id_idx;