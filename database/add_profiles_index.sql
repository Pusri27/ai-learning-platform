-- Add index to improve sort performance on profiles table
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles (created_at DESC);
