/* @name getOriginalUrl */
SELECT
  original
FROM urls 
WHERE
  short = :short AND
  domain_id = :domainID;

/* @name tryStoreUrl */
INSERT INTO urls (short, original, domain_id)
VALUES (:short, :original, :domainId)
ON CONFLICT DO NOTHING;

/* @name getDomainId */
SELECT id
FROM domains
WHERE domain = :domain;

/* @name getDomains */
SELECT id, domain
FROM domains;