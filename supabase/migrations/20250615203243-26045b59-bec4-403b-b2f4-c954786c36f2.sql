
-- Create a policy to allow authenticated (logged-in) users to insert new challenges.
-- This is needed for the "Explore More Presence" feature to save newly generated challenges.
CREATE POLICY "Allow authenticated users to insert challenges"
  ON public.challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
