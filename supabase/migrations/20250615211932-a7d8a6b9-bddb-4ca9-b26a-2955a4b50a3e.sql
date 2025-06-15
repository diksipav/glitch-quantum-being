
-- Add streak columns to the profiles table to store user streaks
ALTER TABLE public.profiles
ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0,
ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0;

-- Enable Row Level Security on the profiles table for better data protection
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add a policy to allow users to view their own profile data
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Add a policy to allow users to update their own profile data
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create a function to log a completed ritual and update the user's streak
CREATE OR REPLACE FUNCTION public.update_streak_and_log_ritual(
    p_user_id uuid,
    p_ritual_name text,
    p_duration_seconds integer
)
RETURNS TABLE(new_current_streak int, new_longest_streak int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
