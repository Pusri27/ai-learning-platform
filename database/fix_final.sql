-- 1. Pastikan ekstensi UUID tersedia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Pastikan tabel profiles ada dan strukturnya benar
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  xp integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Reset RLS Policies (Hapus semua yang lama)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;
DROP POLICY IF EXISTS "Admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON courses;

-- 4. Buat Policy Profiles yang Sederhana & Benar
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Buat Fungsi RPC 'is_admin' (Bypass RLS untuk pengecekan role)
-- Fungsi ini berjalan dengan hak akses database owner (SECURITY DEFINER), jadi tidak terhalang RLS user.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 6. FORCE UPDATE Admin Data (Pastikan data benar-benar ada)
INSERT INTO public.profiles (id, email, role, xp)
SELECT id, email, 'admin', 0
FROM auth.users
WHERE email = 'Pusriananda@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- 7. Cek hasil (akan muncul di tab Results)
SELECT * FROM profiles WHERE email = 'Pusriananda@gmail.com';
