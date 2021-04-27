/* @name getUserByName */
SELECT
  id, username, password_hash AS "passwordHash"
FROM users
WHERE username = :username;

/* @name getUserById */
SELECT
  id, username, password_hash AS "passwordHash"
FROM users
WHERE id = :id;

/* @name createUser */
INSERT INTO users (username, password_hash)
VALUES (:username, :passwordHash)
RETURNING id;

/* @name changeUserPasswordHash */
UPDATE users
SET password_hash = :passwordHash
WHERE id = :id;