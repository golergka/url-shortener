ALTER TABLE urls
ADD COLUMN user_id INTEGER;

ALTER TABLE urls
ADD CONSTRAINT urls_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id);