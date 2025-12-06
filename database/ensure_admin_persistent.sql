-- 1. Grant Execute Permissions (Penting!)
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO service_role;
GRANT EXECUTE ON FUNCTION is_admin TO anon;

-- 2. Pastikan RLS Profile Benar
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Re-Apply Admin Role (Case Insensitive)
UPDATE profiles
SET role = 'admin'
WHERE email ILIKE 'pusriananda@gmail.com';

-- 4. Cek apakah ada user lain dengan email yang mirip (Debugging)
SELECT id, email, role, created_at 
FROM profiles 
WHERE email ILIKE '%pusri%';

-- 5. Pastikan Policy Select Profile benar
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
