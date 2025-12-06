-- 1. MATIKAN RLS SEMENTARA (Untuk memastikan bukan masalah permission)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Hapus profile lama (untuk bersih-bersih)
DELETE FROM profiles WHERE email ILIKE 'pusriananda@gmail.com';

-- 3. Masukkan ulang profile dengan ID yang BENAR dari auth.users
INSERT INTO profiles (id, email, role, xp, created_at)
SELECT id, email, 'admin', 1000, now()
FROM auth.users
WHERE email ILIKE 'pusriananda@gmail.com';

-- 4. Cek hasilnya
SELECT * FROM profiles WHERE email ILIKE 'pusriananda@gmail.com';
