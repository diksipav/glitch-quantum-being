
-- Create a table for meditation logs
CREATE TABLE public.meditation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.meditation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for meditation logs
CREATE POLICY "Users can view their own meditation logs" 
  ON public.meditation_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meditation logs" 
  ON public.meditation_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation logs" 
  ON public.meditation_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a table for presence challenge logs  
CREATE TABLE public.presence_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  challenge_id UUID REFERENCES public.challenges NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for presence logs
ALTER TABLE public.presence_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for presence logs
CREATE POLICY "Users can view their own presence logs" 
  ON public.presence_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presence logs" 
  ON public.presence_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence logs" 
  ON public.presence_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);
