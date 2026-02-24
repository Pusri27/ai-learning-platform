-- ===================================================
-- FIX: Create is_admin() RPC Function
-- Run this in Supabase SQL Editor
-- ===================================================

-- Drop existing function if any
DROP FUNCTION IF EXISTS is_admin();

-- Create is_admin RPC function
-- Returns true if the currently logged-in user has role = 'admin'
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Test: SELECT is_admin(); -- should return false for regular users, true for admin
