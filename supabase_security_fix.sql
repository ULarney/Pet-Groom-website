-- Run ONCE in the Supabase SQL Editor after reviewing permissions.
-- Prevent signed-in users from elevating themselves to admin by changing profiles.role.
REVOKE UPDATE ON TABLE public.profiles FROM anon, authenticated;
GRANT UPDATE (name) ON TABLE public.profiles TO authenticated;
-- Existing RLS "Users Update Own Profile" still restricts which row may be updated.
