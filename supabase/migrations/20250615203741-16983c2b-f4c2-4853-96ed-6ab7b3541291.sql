
-- Drop the existing foreign key constraint that references public.profiles
ALTER TABLE public.user_challenges DROP CONSTRAINT IF EXISTS user_challenges_user_id_fkey;

-- Add a new foreign key constraint that references auth.users directly.
-- This makes the system more robust if a user exists in auth but not in profiles.
ALTER TABLE public.user_challenges
  ADD CONSTRAINT user_challenges_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
