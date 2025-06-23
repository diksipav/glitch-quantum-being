
-- Create achievements table to store different types of achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ritual_name TEXT NOT NULL,
  level INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  required_completions INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ritual_name, level)
);

-- Create user_achievements table to track user progress
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create ritual_completion_tracking table for achievement calculations
CREATE TABLE public.ritual_completion_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ritual_name TEXT NOT NULL,
  completion_count INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ritual_name)
);

-- Insert initial achievements for each ritual type
INSERT INTO public.achievements (ritual_name, level, name, description, required_completions) VALUES
('Grounding Posture', 1, 'Earth Walker', 'You have found your foundation. Your connection to the earth deepens with each grounding practice.', 3),
('Grounding Posture', 2, 'Stone Guardian', 'Your stability is unshakeable. You have become one with the earth beneath you.', 6),
('Grounding Posture', 3, 'Mountain Spirit', 'Like a mountain, you are immovable and eternal. Your presence commands respect.', 9),

('Breath Synchronization', 1, 'Wind Whisperer', 'You have learned to dance with your breath. The rhythm of life flows through you.', 3),
('Breath Synchronization', 2, 'Storm Caller', 'Your breath commands the elements. You breathe with the power of the wind.', 6),
('Breath Synchronization', 3, 'Air Master', 'You are one with the breath of the universe. Every inhale brings cosmic energy.', 9),

('Spinal Waves', 1, 'Wave Rider', 'Your spine flows like water. You have discovered the ocean within your body.', 3),
('Spinal Waves', 2, 'Current Keeper', 'Energy flows through you like a river. Your spinal waves create ripples of power.', 6),
('Spinal Waves', 3, 'Tide Master', 'You control the tides of energy within. Your spine is a conduit for cosmic forces.', 9),

('Breath of Fire', 1, 'Flame Keeper', 'The inner fire has been kindled. Your breath ignites the spark of transformation.', 3),
('Breath of Fire', 2, 'Inferno Sage', 'Your inner fire burns bright. You have mastered the flames of purification.', 6),
('Breath of Fire', 3, 'Phoenix Rising', 'From your inner fire, you are reborn. You embody the eternal flame of life.', 9),

('Calisthenics', 1, 'Body Sculptor', 'You have begun to craft your temple. Your body responds to your will.', 3),
('Calisthenics', 2, 'Strength Forger', 'Your body is your anvil, your will the hammer. You forge strength from within.', 6),
('Calisthenics', 3, 'Iron Sage', 'Your body is a weapon of discipline. You have achieved mastery over form.', 9),

('Bouldering', 1, 'Rock Climber', 'You have learned to read the stone. Every hold teaches you about persistence.', 3),
('Bouldering', 2, 'Cliff Walker', 'Heights no longer intimidate you. You move through space with confidence.', 6),
('Bouldering', 3, 'Mountain Conqueror', 'You have conquered fear and gravity. The mountains bow to your determination.', 9),

('Yoga', 1, 'Pose Keeper', 'You have found balance in stillness. Your body speaks the ancient language of yoga.', 3),
('Yoga', 2, 'Flow Master', 'Movement and breath unite in perfect harmony. You embody the flow of life.', 6),
('Yoga', 3, 'Unity Sage', 'You have achieved the union of mind, body, and spirit. You are yoga.', 9),

('Skating', 1, 'Blade Walker', 'You glide with grace across the surface. Balance is your new language.', 3),
('Skating', 2, 'Ice Dancer', 'You dance with gravity and momentum. The ice responds to your rhythm.', 6),
('Skating', 3, 'Glide Master', 'You are one with motion itself. You flow like liquid across any surface.', 9),

('Surf', 1, 'Wave Rider', 'You have learned to read the ocean. Each wave teaches you about flow and timing.', 3),
('Surf', 2, 'Ocean Dancer', 'You dance with the sea. The waves carry you like an old friend.', 6),
('Surf', 3, 'Sea Sage', 'You are one with the ocean. You ride the eternal waves of existence.', 9),

('Animal Flow', 1, 'Wild Mover', 'You have awakened your primal nature. Your body remembers its ancient wisdom.', 3),
('Animal Flow', 2, 'Pack Leader', 'You move with the instinct of the wild. Your body flows with animal grace.', 6),
('Animal Flow', 3, 'Beast Master', 'You embody the spirit of all creatures. You are the apex of natural movement.', 9),

('Running', 1, 'Ground Pounder', 'Your feet know the earth. Each step builds your connection to the path.', 3),
('Running', 2, 'Distance Keeper', 'You have found your rhythm. The miles bend to your will.', 6),
('Running', 3, 'Endless Runner', 'You run with the spirit of the eternal. Distance is just a number.', 9),

('Ice Bath', 1, 'Cold Embracer', 'You have faced the cold and found strength. Your mind controls your response.', 3),
('Ice Bath', 2, 'Frost Walker', 'Cold is your teacher. You have learned the lessons of ice and fire.', 6),
('Ice Bath', 3, 'Ice Sage', 'You are one with the cold. Temperature cannot shake your inner fire.', 9);

-- Add RLS policies for achievements tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_completion_tracking ENABLE ROW LEVEL SECURITY;

-- Achievements are readable by everyone
CREATE POLICY "Achievements are publicly readable" ON public.achievements FOR SELECT USING (true);

-- Users can only see their own achievement progress
CREATE POLICY "Users can view their own achievements" ON public.user_achievements 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own ritual tracking" ON public.ritual_completion_tracking 
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to update achievements when ritual is completed
CREATE OR REPLACE FUNCTION public.update_achievements_and_tracking(p_user_id uuid, p_ritual_name text)
RETURNS void AS $$
DECLARE
    current_count integer;
    new_count integer;
    achievement_record record;
BEGIN
    -- Update or insert ritual completion tracking
    INSERT INTO public.ritual_completion_tracking (user_id, ritual_name, completion_count, last_completed_at, updated_at)
    VALUES (p_user_id, p_ritual_name, 1, now(), now())
    ON CONFLICT (user_id, ritual_name)
    DO UPDATE SET 
        completion_count = ritual_completion_tracking.completion_count + 1,
        last_completed_at = now(),
        updated_at = now()
    RETURNING completion_count INTO new_count;

    -- Check for new achievements to unlock
    FOR achievement_record IN 
        SELECT a.id, a.required_completions, a.level
        FROM public.achievements a
        LEFT JOIN public.user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = p_user_id
        WHERE a.ritual_name = p_ritual_name 
        AND ua.id IS NULL 
        AND a.required_completions <= new_count
        ORDER BY a.level
    LOOP
        -- Unlock the achievement
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (p_user_id, achievement_record.id)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing ritual logging function to include achievement tracking
CREATE OR REPLACE FUNCTION public.update_streak_and_log_ritual(p_user_id uuid, p_ritual_name text, p_duration_seconds integer)
 RETURNS TABLE(new_current_streak integer, new_longest_streak integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    last_ritual_date date;
    today date := current_date;
    yesterday date := current_date - interval '1 day';
    current_s int;
    longest_s int;
    todays_rituals_count int;
BEGIN
    -- Log the new ritual first
    INSERT INTO public.ritual_logs (user_id, ritual_name, duration_seconds, completed_at)
    VALUES (p_user_id, p_ritual_name, p_duration_seconds, now());

    -- Update achievement tracking
    PERFORM public.update_achievements_and_tracking(p_user_id, p_ritual_name);

    -- Check how many rituals were completed today to avoid incrementing streak multiple times
    SELECT count(*) INTO todays_rituals_count
    FROM public.ritual_logs
    WHERE user_id = p_user_id AND completed_at::date = today;

    -- Only update the streak on the first ritual of the day
    IF todays_rituals_count = 1 THEN
        -- Get the user's current streak information
        SELECT current_streak, longest_streak INTO current_s, longest_s
        FROM public.profiles
        WHERE id = p_user_id;

        -- Get the date of the most recent ritual before today
        SELECT max(completed_at::date) INTO last_ritual_date
        FROM public.ritual_logs
        WHERE user_id = p_user_id AND completed_at::date < today;

        IF last_ritual_date IS NULL THEN
            -- This is the user's first ritual
            current_s := 1;
        ELSIF last_ritual_date = yesterday THEN
            -- The user maintained the streak from yesterday
            current_s := current_s + 1;
        ELSIF last_ritual_date < yesterday THEN
            -- The user broke the streak, so it resets to 1
            current_s := 1;
        END IF;
        
        -- Update the longest streak if the current one is greater
        IF current_s > longest_s THEN
            longest_s := current_s;
        END IF;
        
        -- Save the new streak values to the user's profile
        UPDATE public.profiles
        SET current_streak = current_s, longest_streak = longest_s
        WHERE id = p_user_id;

        -- Return the newly computed streaks
        RETURN QUERY SELECT current_s, longest_s;
    ELSE
        -- If it's not the first ritual of the day, just return the existing streaks
        SELECT current_streak, longest_streak INTO current_s, longest_s
        FROM public.profiles
        WHERE id = p_user_id;
        RETURN QUERY SELECT current_s, longest_s;
    END IF;
END;
$function$
