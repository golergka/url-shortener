ALTER TABLE urls 
ADD COLUMN editable BOOLEAN;

/* All urls before this change will not be editable, all future will be */
UPDATE urls
SET editable = FALSE;

ALTER TABLE urls
ALTER COLUMN editable
SET NOT NULL;

ALTER TABLE urls
ALTER COLUMN editable
SET DEFAULT(TRUE);