-- 1. Cek kondisi SEBELUM update (untuk diagnosa)
SELECT 'BEFORE' as stage, id, email, role FROM profiles WHERE email = 'pusriananda@gmail.com';

-- 2. Force Update langsung ke tabel profiles
UPDATE profiles
SET role = 'admin'
WHERE email = 'pusriananda@gmail.com';

-- 3. Jika row tidak ada, insert dari auth.users
INSERT INTO profiles (id, email, role, xp)
SELECT id, email, 'admin', 1000
FROM auth.users
WHERE email = 'pusriananda@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 4. Cek kondisi SETELAH update
SELECT 'AFTER' as stage, id, email, role FROM profiles WHERE email = 'pusriananda@gmail.com';

-- 5. Cek auth.users untuk memastikan email benar-benar ada
SELECT 'AUTH_USER' as stage, id, email FROM auth.users WHERE email = 'pusriananda@gmail.com';
