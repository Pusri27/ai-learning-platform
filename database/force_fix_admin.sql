-- 1. Pastikan tabel profiles ada kolom role
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Reset RLS Policies (Hapus yang lama biar bersih)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;

-- 3. Buat Policy baru yang pasti benar
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Izinkan user melihat profilnya sendiri
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

-- Izinkan user mengedit profilnya sendiri
CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Izinkan insert (jika belum ada)
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. FORCE INSERT/UPDATE Admin Profile
-- Query ini mengambil ID dari tabel auth.users (akun login) dan memasukkannya ke public.profiles
INSERT INTO public.profiles (id, email, role, xp)
SELECT id, email, 'admin', 0
FROM auth.users
WHERE email = 'Pusriananda@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- 5. Cek hasilnya (Opsional, akan muncul di tab Results)
SELECT * FROM public.profiles WHERE email = 'Pusriananda@gmail.com';
