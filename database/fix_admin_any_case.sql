-- 1. Pastikan fungsi RPC ada (untuk berjaga-jaga)
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

-- 2. UPDATE Role Admin (Case Insensitive)
-- Menggunakan ILIKE agar tidak peduli huruf besar/kecil
UPDATE profiles
SET role = 'admin'
WHERE email ILIKE 'pusriananda@gmail.com';

-- 3. INSERT jika belum ada (Case Insensitive dari auth.users)
INSERT INTO public.profiles (id, email, role, xp)
SELECT id, email, 'admin', 0
FROM auth.users
WHERE email ILIKE 'pusriananda@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- 4. Tampilkan hasil untuk konfirmasi
SELECT email, role FROM profiles WHERE email ILIKE 'pusriananda@gmail.com';
