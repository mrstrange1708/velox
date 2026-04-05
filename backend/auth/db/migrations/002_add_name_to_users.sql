-- +goose Up
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
-- Update existing users with a placeholder name if needed (optional)
UPDATE users SET name = 'Unknown' WHERE name IS NULL;
-- Add NOT NULL constraint after updating existing rows
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- +goose Down
ALTER TABLE users DROP COLUMN IF EXISTS name;
