
-- Drop dependent objects first in the correct order to avoid dependency errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create table for challenges if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Add a unique constraint to the title to prevent duplicate challenges
ALTER TABLE public.challenges ADD CONSTRAINT challenges_title_key UNIQUE (title);

-- Add comments for clarity
COMMENT ON TABLE public.challenges IS 'Stores the definitions of presence challenges.';
COMMENT ON COLUMN public.challenges.difficulty IS 'e.g., EASY, MEDIUM, HARD';

-- Create a table to track user progress on challenges if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started', -- Can be: not_started, active, completed, rejected, aborted
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_challenges_user_id_challenge_id_key UNIQUE (user_id, challenge_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.user_challenges IS 'Tracks the status of challenges for each user.';
COMMENT ON COLUMN public.user_challenges.status IS 'Can be: not_started, active, completed, rejected, aborted';

-- Enable RLS for both tables
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors on re-run, making the script idempotent
DROP POLICY IF EXISTS "Allow authenticated users to read challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can view their own challenge statuses" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can insert their own challenge statuses" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update their own challenge statuses" ON public.user_challenges;

-- RLS Policies for challenges table: Authenticated users can read all challenges
CREATE POLICY "Allow authenticated users to read challenges"
  ON public.challenges FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_challenges table: Users can manage their own challenge entries
CREATE POLICY "Users can view their own challenge statuses"
  ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenge statuses"
  ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenge statuses"
  ON public.user_challenges FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed initial challenges, avoiding duplicates if they already exist
INSERT INTO public.challenges (title, description, difficulty)
VALUES
  ('Sensory Awareness', 'Identify 5 distinct smells in your environment and imagine their molecular structures.', 'MEDIUM'),
  ('Temporal Anchor', 'Set random alarms throughout the day. When they sound, fully note your surroundings and mental state.', 'HARD'),
  ('Peripheral Expansion', 'For 15 minutes, focus on expanding your peripheral awareness while keeping your gaze fixed.', 'EASY'),
  ('Active Listening', 'In your next conversation, listen without planning your reply. Just absorb.', 'EASY'),
  ('Mindful Touch', 'For the next hour, notice whenever you touch something. Observe the temperature, texture, and pressure without judgment.', 'MEDIUM')
ON CONFLICT (title) DO NOTHING;

-- This function runs when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- Create a profile for the new user.
  insert into public.profiles (id, username)
  values (new.id, 'New Traveler');

  -- Assign all existing challenges to the new user with a 'not_started' status.
  insert into public.user_challenges (user_id, challenge_id, status)
  select new.id, c.id, 'not_started'
  from public.challenges c
  left join public.user_challenges uc on c.id = uc.challenge_id and uc.user_id = new.id
  where uc.id is null;

  return new;
end;
$function$;

-- This trigger executes the handle_new_user function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
