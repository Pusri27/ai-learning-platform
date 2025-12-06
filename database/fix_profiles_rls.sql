-- Ensure profiles table exists and has correct permissions
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  xp integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Policy to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policy to allow users to insert their own profile (if not handled by trigger)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the current user has a profile (Idempotent insert)
-- Note: This must be run in the SQL Editor as a query, replacing the email
-- INSERT INTO profiles (id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users
-- WHERE email = 'Pusriananda@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
