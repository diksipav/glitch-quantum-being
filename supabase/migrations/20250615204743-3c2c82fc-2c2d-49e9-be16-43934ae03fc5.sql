
ALTER TABLE public.user_challenges
ADD COLUMN is_daily BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.user_challenges
ADD COLUMN mission_date DATE;

CREATE INDEX idx_user_challenges_daily_mission ON public.user_challenges (user_id, mission_date) WHERE is_daily = true;
