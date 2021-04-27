/* @name getOriginalUrl */
SELECT
  original
FROM urls 
WHERE
  alias = :alias AND
  domain_id = :domainID;

/* @name tryStoreUrl */
INSERT INTO urls (alias, original, domain_id, user_id)
VALUES (:alias, :original, :domainId, :userId)
ON CONFLICT DO NOTHING
RETURNING id;

/* @name getDomainId */
SELECT id
FROM domains
WHERE domain = :domain;

/* @name getDomains */
SELECT id, domain
FROM domains;

/* 
  @name setUrlsUserId 
  @param urlIds -> (...)
*/
UPDATE urls
SET user_id = :userId
WHERE id IN :urlIds;

/* @name setUrlAlias */
UPDATE urls
SET alias = :alias
WHERE 
  id = :urlId AND
  user_id = :userId
RETURNING id, alias;