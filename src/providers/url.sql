/* @name getOriginalUrl */
SELECT original
FROM urls
WHERE short = :short;

/* @name tryStoreUrl */
INSERT INTO urls (short, original)
VALUES (:short, :original)
ON CONFLICT DO NOTHING;