-- RLS Policies for Admin User Management

-- Allow admins to update other users' profiles (name and role)
DROP POLICY IF EXISTS "Admins can update other users" ON profiles;
CREATE POLICY "Admins can update other users" ON profiles 
FOR UPDATE 
USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to delete other users (but not themselves)
DROP POLICY IF EXISTS "Admins can delete other users" ON profiles;
CREATE POLICY "Admins can delete other users" ON profiles 
FOR DELETE 
USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    AND id != auth.uid()  -- Prevent admin from deleting themselves
);
