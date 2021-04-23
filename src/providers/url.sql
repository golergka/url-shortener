/* @name getOriginal */
SELECT original
FROM urls
WHERE short = :short;